/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import { ChatMessage } from "../types";

const SUGGESTED_PROMPTS = [
  "What is an Order Block (OB) in SMC?",
  "How do I manage a 1:3 Risk-Reward ratio?",
  "Explain Fair Value Gaps (FVG) simply.",
  "How does CPI news affect EUR/USD volatility?",
  "Tips to avoid emotional revenge trading."
];

export default function Mentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "model",
      content: "Hello! I am **FX-Mentor**, your AI Forex Trading Coach. I can help you analyze your trade setups, explain technical terms (like Order Blocks, Liquidity, and Fair Value Gaps), design risk strategies, or debug your trading mindset. What would you like to master today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Map ChatMessage structure to server history format
      const clientHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: textToSend,
          history: clientHistory
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Server");
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "model",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error(err);
      setError("Unable to reach your AI Mentor. Showing offline suggestions instead.");
      
      // Provide an extremely useful fallback response in case server has issues
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        role: "model",
        content: "I am having trouble reaching the API key backend. Let's make sure you configure your **GEMINI_API_KEY** in the **Secrets/Settings** panel. In the meantime, remember the fundamental law of Forex trading: **Focus on keeping Drawdown minimal.** Capital preservation is 10x more important than any singular winning trade!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "initial",
        role: "model",
        content: "Hello! I am **FX-Mentor**, your AI Forex Trading Coach. I can help you analyze your trade setups, explain technical terms (like Order Blocks, Liquidity, and Fair Value Gaps), design risk strategies, or debug your trading mindset. What would you like to master today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError(null);
  };

  // Basic markdown bold to html translator helper
  const renderMessageContent = (content: string) => {
    return content.split("\n").map((paragraph, idx) => {
      // Simple bold parsing **text** -> <strong>text</strong>
      const parts = paragraph.split(/\*\*([^*]+)\*\*/g);
      const renderedLine = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="font-bold text-emerald-300">{part}</strong>;
        }
        return part;
      });

      return (
        <p key={idx} className="mb-2 last:mb-0 leading-relaxed text-sm">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[650px] max-w-4xl mx-auto overflow-hidden" id="ai-mentor-section">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Bot className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans">FX-Mentor</h2>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                <Sparkles className="w-3 h-3" />
                SMC Expert
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Your institutional forex & technical analysis mentor.</p>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors text-xs flex items-center gap-1 border border-slate-800/80"
          title="Reset chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
              msg.role === "user" 
                ? "bg-slate-800 border-slate-700 text-slate-300" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`rounded-2xl px-4 py-3 shadow-md ${
              msg.role === "user" 
                ? "bg-slate-800 text-slate-100 rounded-tr-none" 
                : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
            }`}>
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {renderMessageContent(msg.content)}
              </div>
              <span className="block text-[10px] text-slate-500 mt-2 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
              <div className="flex gap-1 py-1.5" id="typing-indicator">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/20">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Ask FX-Mentor About:
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 group text-left"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Tray */}
      <form onSubmit={handleFormSubmit} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask FX-Mentor about structural breaks, liquidity sweeps..."
          disabled={isLoading}
          className="flex-1 bg-slate-900/80 border border-slate-800 focus:outline-none focus:border-emerald-500 text-sm text-white px-4 py-3 rounded-xl transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 p-3 rounded-xl transition-colors shrink-0 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
