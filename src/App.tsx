import { useState } from 'react';
import { CodeDebugger } from './components/CodeDebugger';
import { ChatBot } from './components/ChatBot';
import { Code2, Sparkles } from 'lucide-react';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Code2 className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 flex items-center gap-2">
                CodeMentor.AI
                <Sparkles className="size-4 text-indigo-500" />
              </h1>
              <p className="text-slate-600 text-sm">Smart Coding Helper for Students</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CodeDebugger />
      </main>

      {/* Chatbot */}
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-600 text-sm">
            Powered by Lingo.dev AI Workflows | Supporting Telugu, Tamil, Hindi, Malayalam, Kannada, Punjabi, Bengali
          </p>
        </div>
      </footer>
    </div>
  );
}
