import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 size-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-indigo-500' : 'bg-gradient-to-br from-purple-500 to-indigo-500'
      }`}>
        {isUser ? (
          <User className="size-4 text-white" />
        ) : (
          <Bot className="size-4 text-white" />
        )}
      </div>

      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-2.5 max-w-[85%] ${
            isUser
              ? 'bg-indigo-500 text-white rounded-tr-sm'
              : 'bg-white text-slate-900 border border-slate-200 rounded-tl-sm shadow-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <p className="text-xs text-slate-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}
