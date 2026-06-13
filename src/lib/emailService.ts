import { EMAIL_CONFIG, isEmailConfigured, getMissingEmailConfig } from '../config/email';

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface EmailSendResult {
  ok: boolean;
  /** Detailed, human-readable diagnostic log lines for the on-screen console. */
  logs: string[];
  error?: string;
}

function ts(): string {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

/** Low-level EmailJS REST call. Returns ok + raw response text for logging. */
async function sendTemplate(
  templateId: string,
  params: Record<string, string>,
  signal?: AbortSignal
): Promise<{ ok: boolean; status: number; text: string }> {
  const res = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAIL_CONFIG.serviceId,
      template_id: templateId,
      user_id: EMAIL_CONFIG.publicKey,
      template_params: params,
    }),
    signal,
  });
  const text = await res.text().catch(() => '');
  return { ok: res.ok, status: res.status, text };
}

/**
 * Contact flow:
 *   1. Deliver the visitor's message to the owner's Gmail (notification template).
 *   2. Send an automatic confirmation back to the visitor (auto-reply template).
 *
 * Every step is recorded in `logs` (with timestamps + HTTP status) so the
 * Contact UI can show exactly where things succeeded or failed. The auto-reply
 * is best-effort: if it fails the overall send is still considered successful
 * because the message reached the owner.
 */
export async function sendContactEmails(
  payload: ContactPayload,
  signal?: AbortSignal
): Promise<EmailSendResult> {
  const logs: string[] = [];
  logs.push(`[${ts()}] Initialising EmailJS transport…`);

  if (!isEmailConfigured()) {
    const missing = getMissingEmailConfig();
    logs.push(`[${ts()}] ✗ EmailJS is not configured. Missing: ${missing.join(', ')}`);
    logs.push(`[${ts()}] → Add these to your .env file (see docs/MANUAL_SETUP.md).`);
    return {
      ok: false,
      logs,
      error: `EmailJS not configured — missing ${missing.join(', ')}.`,
    };
  }

  const now = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());

  // Superset of common EmailJS template variable names so it works with most
  // template configurations without the user renaming fields.
  const baseParams: Record<string, string> = {
    name: payload.name,
    from_name: payload.name,
    email: payload.email,
    from_email: payload.email,
    reply_to: payload.email,
    message: payload.message,
    title: `New message from ${payload.name}`,
    time: now,
    to_name: EMAIL_CONFIG.ownerName,
    to_email: EMAIL_CONFIG.ownerEmail,
  };

  // ── Step 1: notification to the owner ──────────────────────────────────────
  logs.push(`[${ts()}] → Sending notification to ${EMAIL_CONFIG.ownerEmail}…`);
  try {
    const r = await sendTemplate(EMAIL_CONFIG.templateContact, baseParams, signal);
    if (!r.ok) {
      logs.push(`[${ts()}] ✗ Notification failed: HTTP ${r.status} ${r.text || ''}`.trim());
      logs.push(`[${ts()}] → Check VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_CONTACT and EmailJS allowed origins.`);
      return { ok: false, logs, error: `Notification email failed (HTTP ${r.status}).` };
    }
    logs.push(`[${ts()}] ✓ Notification delivered (HTTP ${r.status}).`);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      logs.push(`[${ts()}] · Cancelled by user.`);
      return { ok: false, logs, error: 'Cancelled.' };
    }
    const msg = err instanceof Error ? err.message : String(err);
    logs.push(`[${ts()}] ✗ Network error sending notification: ${msg}`);
    return { ok: false, logs, error: 'Network error while sending. Check your connection.' };
  }

  // ── Step 2: auto-reply to the visitor (best-effort) ─────────────────────────
  if (EMAIL_CONFIG.templateAutoReply) {
    logs.push(`[${ts()}] → Sending auto-reply to ${payload.email}…`);
    try {
      const autoParams: Record<string, string> = { ...baseParams, to_name: payload.name, to_email: payload.email };
      const r = await sendTemplate(EMAIL_CONFIG.templateAutoReply, autoParams, signal);
      if (r.ok) {
        logs.push(`[${ts()}] ✓ Auto-reply sent to visitor (HTTP ${r.status}).`);
      } else {
        logs.push(`[${ts()}] ⚠ Auto-reply failed: HTTP ${r.status} ${r.text || ''}`.trim());
        logs.push(`[${ts()}] · Your message was still delivered — only the confirmation failed.`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logs.push(`[${ts()}] ⚠ Auto-reply network error: ${msg} (message still delivered).`);
    }
  } else {
    logs.push(`[${ts()}] · Auto-reply skipped (VITE_EMAILJS_TEMPLATE_AUTOREPLY not set).`);
  }

  logs.push(`[${ts()}] ✓ Done. Message delivered successfully.`);
  return { ok: true, logs };
}
