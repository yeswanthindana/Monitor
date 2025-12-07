import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Cpu, AlertCircle, Terminal, X } from 'lucide-react';
import { SystemSnapshot } from '../types';
import { analyzeSystemHealth, chatWithSystemAdvisor } from '../services/geminiService';

interface AiAdvisorProps {
  snapshot: SystemSnapshot;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ snapshot, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello. I am SysMon AI. I'm monitoring your system telemetry in real-time. How can I assist you with optimization or diagnostics?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsAnalyzing(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    history.push({ role: 'user', text: userMsg.text });

    const responseText = await chatWithSystemAdvisor(history, snapshot);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsAnalyzing(false);
  };

  const handleRunDiagnostics = async () => {
    setIsAnalyzing(true);
    const report = await analyzeSystemHealth(snapshot);
    const modelMsg: Message = {
      id: Date.now().toString(),
      role: 'model',
      text: report,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, modelMsg]);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full bg-dark-card border-l border-dark-border shadow-2xl shadow-black w-full md:w-[400px] fixed right-0 top-0 bottom-0 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-border bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neon-purple/10 rounded-md">
            <Bot className="text-neon-purple" size={18} />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">SysMon AI Advisor</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-gray-400 font-mono">ONLINE</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-dark-border bg-black/10">
        <button 
            onClick={handleRunDiagnostics}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple text-xs py-2 px-3 rounded border border-neon-purple/30 transition-all"
        >
            <Terminal size={14} />
            Full Diagnostics
        </button>
        <button 
             onClick={() => setInput("Identify resource hogs")}
             disabled={isAnalyzing}
             className="flex items-center justify-center gap-2 bg-neon-yellow/10 hover:bg-neon-yellow/20 text-neon-yellow text-xs py-2 px-3 rounded border border-neon-yellow/30 transition-all"
        >
            <AlertCircle size={14} />
            Check Bottlenecks
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-neon-purple/20 text-gray-100 border border-neon-purple/30 rounded-br-none' 
                : 'bg-dark-bg text-gray-300 border border-dark-border rounded-bl-none'
            }`}>
              {msg.role === 'model' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  {/* Basic markdown parsing simulation for line breaks and lists */}
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="min-h-[1rem] m-0 leading-relaxed">
                        {line.startsWith('- ') ? <span className="ml-2 block">• {line.substring(2)}</span> : line}
                    </p>
                  ))}
                </div>
              ) : (
                msg.text
              )}
              <div className="text-[10px] text-white/30 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isAnalyzing && (
            <div className="flex justify-start">
                <div className="bg-dark-bg border border-dark-border p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                     <Cpu size={16} className="text-neon-purple animate-spin" />
                     <span className="text-xs text-gray-400">Analyzing telemetry...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-dark-border bg-black/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about system status..."
            className="flex-1 bg-dark-bg border border-dark-border rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all"
            disabled={isAnalyzing}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isAnalyzing}
            className="bg-neon-purple hover:bg-neon-purple/80 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-md transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
