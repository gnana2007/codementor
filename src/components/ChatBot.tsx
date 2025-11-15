import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { MessageCircle, X, Send, Sparkles, Languages } from 'lucide-react';
import { sendChatMessage } from '../utils/api';
import { ChatMessage } from './ChatMessage';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatBot({ isOpen, onToggle }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding tutor. I can help you in any Indian language - Telugu, Tamil, Hindi, Malayalam, Kannada, Punjabi, or Bengali. Ask me anything about coding!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          size="lg"
          className="fixed bottom-6 right-6 size-14 rounded-full shadow-2xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 z-50 p-0"
        >
          <MessageCircle className="size-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full sm:w-[400px] sm:bottom-6 sm:right-6 h-[600px] sm:h-[650px] z-50 flex flex-col shadow-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden bg-white border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-white">AI Coding Tutor</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Languages className="size-3 text-white/80" />
                  <p className="text-white/80 text-xs">Multilingual Support</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20 size-8 p-0"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Language Badge */}
          <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100">
            <div className="flex flex-wrap gap-1 text-xs">
              {['తెలుగు', 'தமிழ்', 'हिंदी', 'മലയാളം', 'ಕನ್ನಡ', 'ਪੰਜਾਬੀ', 'বাংলা', 'English'].map((lang) => (
                <Badge key={lang} variant="secondary" className="bg-white text-indigo-700 text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center text-slate-500 text-sm">
                <div className="flex gap-1">
                  <div className="size-2 rounded-full bg-slate-400 animate-bounce"></div>
                  <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="size-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-4 bg-white">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question in any language..."
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 self-end"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
}
