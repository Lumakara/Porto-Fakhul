import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Sparkles, Bot, User, KeyRound, Loader2 } from 'lucide-react';
import type { ChatMessage } from '../../types';
import { usePreferences } from '../../contexts/PreferencesContext';
import { loadChatHistory, saveChatHistory, clearChatHistory } from '../../lib/chatStorage';
import { sendChatMessage, createMessageId } from '../../lib/aiChat';

const SUGGESTIONS = [
  'Who is Fakhul?',
  'What are his top skills?',
  'Tell me about his projects',
  'How can I contact him?',
];

interface ChatPanelProps {
  /** Switch the parent FAB panel to the Settings tab. */
  onOpenSettings?: () => void;
}

export function ChatPanel({ onOpenSettings }: ChatPanelProps) {
  const { preferences } = usePreferences();
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasApiKey = preferences.ai.apiKey.trim().length > 0;

  // Persist history whenever it changes.
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isSending]);

  // Cancel any in-flight request on unmount.
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMsg: ChatMessage = {
        id: createMessageId(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      const nextHistory = [...messages, userMsg];
      setMessages(nextHistory);
      setInput('');
      setIsSending(true);

      const controller = new AbortController();
      abortRef.current = controller;

      // Create a placeholder assistant message we stream tokens into.
      const assistantId = createMessageId();
      let streamStarted = false;

      const result = await sendChatMessage(nextHistory, preferences.ai, {
        signal: controller.signal,
        onToken: (fullText) => {
          setMessages((prev) => {
            if (!streamStarted) {
              streamStarted = true;
              return [
                ...prev,
                {
                  id: assistantId,
                  role: 'assistant',
                  content: fullText,
                  timestamp: Date.now(),
                },
              ];
            }
            return prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m));
          });
        },
      });

      setMessages((prev) => {
        if (result.ok) {
          // Ensure the final content is present (covers non-streaming responses).
          if (streamStarted) {
            return prev.map((m) => (m.id === assistantId ? { ...m, content: result.content } : m));
          }
          return [
            ...prev,
            { id: assistantId, role: 'assistant', content: result.content, timestamp: Date.now() },
          ];
        }
        // Error: replace any partial stream with the error message.
        const errorMsg: ChatMessage = {
          id: assistantId,
          role: 'assistant',
          content: result.error || 'Something went wrong.',
          timestamp: Date.now(),
          error: true,
        };
        if (streamStarted) {
          return prev.map((m) => (m.id === assistantId ? errorMsg : m));
        }
        return [...prev, errorMsg];
      });

      setIsSending(false);
      abortRef.current = null;
    },
    [messages, isSending, preferences.ai]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header row */}
      <div className="flex items-center justify-between px-1 pb-3 mb-1 border-b border-charcoal/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-sage animate-ping opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sage" />
          </span>
          <span className="font-hud text-[11px] tracking-widest uppercase text-charcoal-light">
            AI Assistant
          </span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            data-sound="click"
            className="flex items-center gap-1 text-[10px] font-hud uppercase tracking-wider text-charcoal-light hover:text-terracotta transition-colors cursor-none"
            data-cursor="magnetic"
            aria-label="Clear chat history"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 py-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center h-full py-8 px-2">
            <div className="w-12 h-12 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-terracotta" />
            </div>
            <p className="text-sm font-display text-charcoal mb-1">Ask me about Fakhul</p>
            <p className="text-xs text-charcoal-light font-sans mb-5 max-w-[240px] leading-relaxed">
              I can help you explore his skills, projects, and how to get in touch.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  disabled={isSending}
                  data-sound="click"
                  className="px-3 py-1.5 rounded-full bg-surface border border-charcoal/10 text-[11px] font-sans text-charcoal-light hover:text-terracotta hover:border-terracotta/30 transition-colors cursor-none disabled:opacity-50"
                  data-cursor="magnetic"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                  m.role === 'user'
                    ? 'bg-charcoal text-sand'
                    : m.error
                      ? 'bg-red-400/15 text-red-400 border border-red-400/30'
                      : 'bg-terracotta/15 text-terracotta border border-terracotta/25'
                }`}
              >
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm font-sans leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === 'user'
                    ? 'bg-charcoal text-sand rounded-br-sm'
                    : m.error
                      ? 'bg-red-400/10 text-red-500 border border-red-400/20 rounded-bl-sm'
                      : 'bg-surface border border-charcoal/10 text-charcoal rounded-bl-sm'
                }`}
              >
                {m.content}
                {m.error && !hasApiKey && (
                  <button
                    onClick={onOpenSettings}
                    className="mt-2 flex items-center gap-1.5 text-[11px] font-hud uppercase tracking-wider text-terracotta hover:underline cursor-none"
                    data-cursor="magnetic"
                  >
                    <KeyRound className="w-3 h-3" /> Open Settings
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isSending && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-end gap-2">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-terracotta/15 text-terracotta border border-terracotta/25 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-surface border border-charcoal/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-charcoal-light/50"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          aria-label="Chat message"
          className="flex-1 bg-surface border border-charcoal/10 rounded-full px-4 py-2.5 text-sm font-sans text-charcoal outline-none focus:border-terracotta/50 transition-colors cursor-none placeholder:text-charcoal-light/50"
          data-cursor="grow"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          data-sound="click"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-charcoal text-sand flex items-center justify-center hover:bg-terracotta transition-colors disabled:opacity-40 disabled:hover:bg-charcoal cursor-none"
          data-cursor="grow"
          aria-label="Send message"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
