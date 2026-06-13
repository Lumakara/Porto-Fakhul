// ============================================================================
//  EMAILJS CONFIGURATION  ──  *** PUT YOUR EMAILJS IDS HERE ***
// ----------------------------------------------------------------------------
//  The contact form uses EmailJS (https://www.emailjs.com) to deliver messages
//  straight to your Gmail inbox, then send an automatic reply back to the
//  visitor. You need a free EmailJS account and TWO templates.
//
//  ── Setup (see docs/MANUAL_SETUP.md for full step-by-step) ──────────────────
//   1. Create an EmailJS account and connect your Gmail as a "Service".
//   2. Create two email templates:
//        • Notification  → sends the visitor's message TO YOU.
//        • Auto-reply     → sends a confirmation TO THE VISITOR.
//          (paste docs/emailjs-autoreply-template.html into this one)
//   3. Copy your IDs into a `.env` file in the project root:
//
//        VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
//        VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//        VITE_EMAILJS_TEMPLATE_CONTACT=template_xxxxxxx   (notification → you)
//        VITE_EMAILJS_TEMPLATE_AUTOREPLY=template_yyyyyyy (auto-reply → visitor)
//
//   4. Restart the dev server / redeploy.
//
//  No secrets here are dangerous to expose — the EmailJS *public* key is meant
//  to be used in the browser. Lock down usage in the EmailJS dashboard
//  (allowed origins, rate limits).
// ============================================================================

export const EMAIL_CONFIG = {
  publicKey: ((import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined) ?? '').trim(),
  serviceId: ((import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined) ?? '').trim(),
  /** Template that delivers the visitor's message to your inbox. */
  templateContact: ((import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT as string | undefined) ?? '').trim(),
  /** Template that sends the automatic confirmation back to the visitor. */
  templateAutoReply: ((import.meta.env.VITE_EMAILJS_TEMPLATE_AUTOREPLY as string | undefined) ?? '').trim(),
  /** Where the notification email is delivered (your inbox). */
  ownerEmail: 'fakhulrohman2@gmail.com',
  ownerName: 'Fakhul Rohman',
};

/** True when the minimum required IDs for sending a notification are present. */
export function isEmailConfigured(): boolean {
  return Boolean(EMAIL_CONFIG.publicKey && EMAIL_CONFIG.serviceId && EMAIL_CONFIG.templateContact);
}

/** Which specific env var(s) are missing — used for detailed error logs. */
export function getMissingEmailConfig(): string[] {
  const missing: string[] = [];
  if (!EMAIL_CONFIG.publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
  if (!EMAIL_CONFIG.serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
  if (!EMAIL_CONFIG.templateContact) missing.push('VITE_EMAILJS_TEMPLATE_CONTACT');
  return missing;
}
