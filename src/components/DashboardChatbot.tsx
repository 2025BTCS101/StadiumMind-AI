'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStadiumState } from '../context/StadiumContext';
import { askGeminiAI } from '../utils/gemini';
import { useThemeSettings } from '../context/ThemeContext';
import { MessageSquare, Sparkles, X, Send, Mic, MicOff, Volume2, VolumeX, Bot, User } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface SpeechRecognitionInstance {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
  onerror: () => void;
  onend: () => void;
}

export const DashboardChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const state = useStadiumState();
  const { voiceEnabled, language } = useThemeSettings();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Greetings Commander. I am your AI Operations Copilot. Ask me to diagnose gate congestion, explain transit status, allocate staff, or compile security instructions.',
      time: '12:00'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition binding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance };
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = language === 'en' ? 'en-US' : language;

        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };
        rec.onerror = () => setIsRecording(false);
        rec.onend = () => setIsRecording(false);
        recognitionRef.current = rec;
      }
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { sender: 'user', text: textToSend, time: currentTime };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Connects directly to the Gemini API (using key in .env.local) or local state reasoning fallback
      const response = await askGeminiAI(textToSend, state);
      const botMsg: ChatMessage = { sender: 'bot', text: response, time: currentTime };
      setMessages((prev) => [...prev, botMsg]);

      if (voiceEnabled) {
        speakText(response);
      }
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = {
        sender: 'bot',
        text: 'Connection disruption to smart grid. Unable to compile AI prediction model.',
        time: currentTime
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'Why is Gate C congested?',
    'Best volunteer placement suggestions?',
    'Explain current sustainability metrics',
    'Emergency evacuation route recommendations'
  ];

  return (
    <div className="fixed bottom-6 right-20 z-50">
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 px-4 gap-2 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200"
        title="Open AI Command Copilot"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Ask AI Copilot</span>
        <Sparkles className="h-4 w-4 text-indigo-200 animate-pulse" />
      </button>

      {/* Floating Panel Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-[-56px] sm:right-0 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 transition-all duration-300">
          
          {/* Header */}
          <div className="bg-indigo-600/10 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-500" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase">AI Operations Copilot</h3>
                <p className="text-[8px] text-slate-500 font-semibold tracking-wider uppercase">Gemini-Powered Smart Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="h-[280px] overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/40">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isUser ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'
                    }`}>
                      {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex flex-col">
                      <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-200 text-slate-850 dark:bg-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-800/80 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[8px] text-slate-500 font-semibold">
                        <span>{msg.time}</span>
                        {!isUser && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="text-slate-500 hover:text-indigo-500"
                          >
                            {isSpeaking ? <Volume2 className="h-3 w-3 text-indigo-500 animate-pulse" /> : <VolumeX className="h-3 w-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-indigo-400">
                    <Bot className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <div className="rounded-xl rounded-tl-none bg-slate-900 border border-slate-800/80 px-3 py-2">
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions Scroll list */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-950">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {sampleQueries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(query)}
                  className="shrink-0 rounded-full border border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-[10px] text-slate-600 dark:text-slate-400 hover:border-indigo-500/50 hover:bg-slate-900 hover:text-slate-100 transition-all font-semibold"
                >
                  {query.replace('?', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 flex gap-2 items-center border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={toggleRecording}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-150 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-700'
              }`}
            >
              {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(input);
              }}
              className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none border border-slate-250 dark:border-slate-800 focus:border-indigo-500 transition-all"
            />

            <button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardChatbot;
