'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStadiumState } from '../context/StadiumContext';
import { askGeminiAI } from '../utils/gemini';
import { useThemeSettings } from '../context/ThemeContext';
import { Send, Mic, MicOff, Volume2, VolumeX, Smartphone, User, Bot, HelpCircle } from 'lucide-react';
import { t } from '../utils/translations';

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

export const AICompanion: React.FC = () => {
  const state = useStadiumState();
  const { voiceEnabled, language } = useThemeSettings();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hi! I am your StadiumMind Fan Assistant. Ask me about seats, shortest lines, transit, parking, or stadium directions.', time: '12:00' }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);


  // Speech Recognition Setup (Web Speech API)
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

        rec.onerror = () => {
          setIsRecording(false);
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Safari.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      // Cancel speech synthesis if speaking
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); // cancel any active speech
    
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
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Query our Gemini service (combines API call with detailed local fallback using live context)
      const aiReply = await askGeminiAI(textToSend, state, undefined, language);
      
      const botMsg: ChatMessage = { sender: 'bot', text: aiReply, time: currentTime };
      setMessages(prev => [...prev, botMsg]);
      
      // Auto-speech response if enabled globally
      if (voiceEnabled) {
        speakText(aiReply);
      }
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = { sender: 'bot', text: 'Sorry, I am having trouble connecting to the stadium grid. Please try again.', time: currentTime };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuery = (query: string) => {
    handleSendMessage(query);
  };

  const sampleQueries = [
    'Where is the nearest restroom?',
    'What is the shortest food queue?',
    'Why is Gate C congested?',
    'Metro schedules & delays?',
    'Translate the emergency announcement'
  ];

  return (
    <div className="flex h-[580px] w-full max-w-[340px] flex-col overflow-hidden rounded-[36px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl relative">
      {/* Speaker/Camera notch */}
      <div className="absolute top-2 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full bg-slate-800 z-20" />

      {/* App Header */}
      <div className="bg-slate-900 px-4 pb-3 pt-6 text-left border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
            <Smartphone className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide uppercase">StadiumMind Hub</h2>
            <p className="text-[9px] text-slate-500 font-semibold">FIFA 2026 Companion App</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-400 uppercase">{t('grid_connected', language)}</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none bg-slate-950">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-blue-400'
                }`}>
                  {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                
                {/* Bubble */}
                <div className="flex flex-col">
                  <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed transition-all duration-200 ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800/80 rounded-tl-none'
                  }`}>
                    {index === 0 && msg.sender === 'bot' ? t('bot_initial', language) : msg.text}
                  </div>
                  
                  {/* Meta (time / TTS speaker) */}
                  <div className={`mt-1 flex items-center gap-1.5 text-[8px] text-slate-500 font-semibold ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.time}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(index === 0 ? t('bot_initial', language) : msg.text)}
                        className="text-slate-500 hover:text-blue-400 transition-colors"
                        title="Read out loud"
                      >
                        {isSpeaking ? <Volume2 className="h-3 w-3 text-blue-500 animate-pulse" /> : <VolumeX className="h-3 w-3" />}
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
            <div className="flex gap-2 max-w-[85%]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-blue-400">
                <Bot className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800/80 px-3.5 py-2">
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Queries (Pills scroll list) */}
      <div className="border-t border-slate-900 bg-slate-950 p-2.5">
        <div className="mb-1 flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
          <HelpCircle className="h-3 w-3 text-slate-600" />
          <span>{t('tap_to_ask', language)}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
          {sampleQueries.map((query, i) => (
            <button
              key={i}
              onClick={() => handleSampleQuery(query)}
              className="shrink-0 rounded-full border border-slate-850 bg-slate-900/60 px-2.5 py-1 text-[10px] text-slate-400 hover:border-blue-500/50 hover:bg-slate-900 hover:text-slate-200 transition-all duration-200 font-medium"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-900 bg-slate-900/90 p-3 flex gap-2 items-center">
        {/* Voice dictation button */}
        <button
          onClick={toggleRecording}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
            isRecording 
              ? 'bg-red-600 text-white animate-pulse' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
          }`}
          title="Hold/Tap to Speak"
        >
          {isRecording ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRecording ? t('listening', language) : t('type_placeholder', language)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(input);
          }}
          disabled={isRecording}
          className="flex-1 rounded-xl bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none border border-slate-800 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-600"
        />

        {/* Send button */}
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 transition-all duration-200"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Virtual Navigation Pill */}
      <div className="h-1.5 w-24 rounded-full bg-slate-800 mx-auto my-1.5" />
    </div>
  );
};
export default AICompanion;
