import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Settings, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getApiKey,
  setApiKey as saveApiKey,
  getSystemPrompt,
  setSystemPrompt as saveSystemPrompt,
  getChatHistory,
  saveChatHistory,
} from '../lib/chatStorage';
import type { ChatMessage } from '../lib/chatStorage';

/*
 * SECURITY NOTE: This chatbot stores the OpenAI API key in localStorage and sends
 * it directly from the browser. Any XSS vector or malicious browser extension on
 * this domain can read the key. Since this is a personal portfolio site, the risk
 * is limited to the site owner. Users should configure a scoped, low-limit API key
 * (e.g., with a $5/month hard cap) to minimize potential abuse if the key is exposed.
 */

interface AIChatbotProps {
  onClose: () => void;
}

export function AIChatbot({ onClose }: AIChatbotProps) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(getChatHistory);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState(getApiKey);
  const [systemPrompt, setSystemPromptState] = useState(getSystemPrompt);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSaveSettings = useCallback(() => {
    saveApiKey(apiKey);
    saveSystemPrompt(systemPrompt);
    setShowSettings(false);
  }, [apiKey, systemPrompt]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const currentKey = getApiKey();
    if (!currentKey) {
      setShowSettings(true);
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    // Abort any previous in-flight request and create a new controller
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 500,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent =
        data.choices?.[0]?.message?.content || t('chat.error');
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantContent,
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (err) {
      // Don't set error state if the request was intentionally aborted
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : t('chat.error'));
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, t]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasApiKey = !!getApiKey();

  return (
    <div className="fixed bottom-20 right-6 z-40 w-[340px] max-w-[calc(100vw-48px)] h-[460px] max-h-[calc(100vh-120px)] bg-sand border border-charcoal/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal/10 bg-sand-alt">
        <span className="font-hud text-xs font-medium text-charcoal tracking-widest uppercase">
          {t('chat.title')}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-charcoal-light hover:text-charcoal hover:bg-stone/30 transition-colors duration-200"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-charcoal-light hover:text-charcoal hover:bg-stone/30 transition-colors duration-200"
            aria-label={t('common.close')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Settings Panel (collapsible) */}
      {showSettings && (
        <div className="px-4 py-3 border-b border-charcoal/10 bg-stone/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-hud text-[10px] text-charcoal-light uppercase tracking-widest">
              {t('chat.apiKeyLabel')}
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-charcoal-light hover:text-charcoal"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-charcoal/10 bg-sand focus:outline-none focus:ring-1 focus:ring-terracotta/50 text-charcoal"
          />
          <div>
            <span className="font-hud text-[10px] text-charcoal-light uppercase tracking-widest">
              {t('chat.systemPromptLabel')}
            </span>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPromptState(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-charcoal/10 bg-sand focus:outline-none focus:ring-1 focus:ring-terracotta/50 text-charcoal resize-none"
            />
          </div>
          <button
            onClick={handleSaveSettings}
            className="w-full px-3 py-2 text-xs font-hud tracking-wider uppercase rounded-lg bg-terracotta text-white hover:bg-terracotta/90 transition-colors duration-200"
          >
            {t('chat.save')}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {!hasApiKey && messages.length === 0 && !showSettings && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <p className="text-xs text-charcoal-light font-hud">
              {t('chat.apiKeyMissing')}
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="text-xs font-hud text-terracotta hover:underline flex items-center space-x-1"
            >
              <Settings className="w-3 h-3" />
              <span>{t('chat.apiKeySetup')}</span>
            </button>
          </div>
        )}

        {hasApiKey && messages.length === 0 && !showSettings && (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-charcoal-light font-hud text-center">
              {t('chat.welcome')}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-terracotta text-white rounded-br-sm'
                  : 'bg-stone/40 text-charcoal rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-stone/40 text-charcoal-light px-3 py-2 rounded-xl rounded-bl-sm text-xs">
              <span className="inline-flex space-x-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </span>
              <span className="ml-1">{t('chat.typing')}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <span className="text-[10px] text-red-500 font-hud">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-charcoal/10 bg-sand-alt">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder')}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-charcoal/10 bg-sand focus:outline-none focus:ring-1 focus:ring-terracotta/50 text-charcoal placeholder:text-charcoal-light/50"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-terracotta text-white disabled:opacity-40 hover:bg-terracotta/90 transition-colors duration-200"
            aria-label={t('chat.send')}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;
