"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatWidget: React.FC = () => {
  const TOPICS = [
    {
      label: "Productivity",
      prompt: "Let's talk about productivity tips.",
      icon: "⚡",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      label: "Coding Help",
      prompt: "I need help with coding.",
      icon: "💻",
      color: "from-blue-500 to-indigo-600",
    },
    {
      label: "Career Advice",
      prompt: "Give me some career advice.",
      icon: "🎯",
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "General Chat",
      prompt: "Let's chat!",
      icon: "💬",
      color: "from-violet-500 to-purple-600",
    },
  ];

  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0].label);
  const [topicSet, setTopicSet] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !topicSet) return;
    let newMessages = [...messages];
    if (!topicSet) {
      const topicPrompt =
        TOPICS.find((t) => t.label === selectedTopic)?.prompt || "Let's chat!";
      newMessages = [
        { role: "user" as const, content: topicPrompt },
        ...(input.trim() ? [{ role: "user" as const, content: input }] : []),
      ];
      setTopicSet(true);
    } else if (input.trim()) {
      newMessages = [...messages, { role: "user", content: input }];
    }
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: data.reply || "Sorry, I couldn't answer that.",
          },
        ]);
      }, 1000);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Error: Could not reach AI service." },
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTopic = () => TOPICS.find((t) => t.label === selectedTopic);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-all duration-500 md:bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className={`relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 transition-all duration-500 transform hover:scale-110 ${open ? "rotate-180 shadow-purple-500/50" : "shadow-black/50"} before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-indigo-600 before:via-purple-600 before:to-pink-600 before:blur-lg before:opacity-50 before:-z-10 before:animate-pulse`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Open AI Chat"
        >
          <span className="transition-all duration-500 relative z-10">
            {open ? "✕" : "🤖"}
          </span>
          {!open && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
          )}
        </button>
      </div>

      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-32 md:right-8 md:w-[340px] md:h-[520px]">
          <div className="relative bg-gradient-to-b from-slate-900 via-gray-900 to-black border border-gray-800/50 rounded-none md:rounded-3xl shadow-2xl w-full h-full flex flex-col backdrop-blur-xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-500 overflow-hidden md:w-[340px] md:h-[520px]">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-800/50 bg-gradient-to-r from-slate-900/80 via-gray-900/80 to-black/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${getCurrentTopic()?.color} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white text-lg font-bold">AI</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">AI Assistant</span>
                    <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                      Online
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-normal flex items-center gap-1">
                    <span>{getCurrentTopic()?.icon}</span>
                    <span>{selectedTopic}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-red-400 text-xl w-10 h-10 rounded-full hover:bg-gray-800/50 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Topic Picker */}
            <div className="relative px-4 md:px-2 py-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-black/50">
              <label className="block text-sm text-gray-300 mb-2 font-medium md:text-xs md:mb-1">
                Choose your topic:
              </label>
              <div className="flex gap-2 flex-wrap md:gap-0.5">
                {TOPICS.map((t) => (
                  <button
                    key={t.label}
                    className={`group relative px-4 py-2 rounded-2xl text-sm font-medium border transition-all duration-300 overflow-hidden md:px-1.5 md:py-0.5 md:text-[11px] ${
                      selectedTopic === t.label
                        ? `bg-gradient-to-r ${t.color} text-white border-white/20 shadow-lg transform scale-105`
                        : "bg-gray-800/70 text-gray-400 border-gray-700 hover:bg-gray-700/70 hover:text-white hover:border-gray-600 hover:transform hover:scale-105"
                    }`}
                    onClick={() => {
                      setSelectedTopic(t.label);
                      setMessages([]);
                      setTopicSet(false);
                      setInput("");
                    }}
                    disabled={loading}
                  >
                    <span className="relative z-10 flex items-center gap-2 md:gap-0.5">
                      <span className="md:text-base">{t.icon}</span>
                      <span>{t.label}</span>
                    </span>
                    {selectedTopic === t.label && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 relative">
              {messages.length === 0 && (
                <div className="text-center mt-8 md:mt-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${getCurrentTopic()?.color} rounded-full flex items-center justify-center mx-auto shadow-2xl`}
                    >
                      <span className="text-white text-3xl">
                        {getCurrentTopic()?.icon}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <div className="text-gray-300 text-lg font-medium mb-2">
                    Ready to help with {selectedTopic.toLowerCase()}!
                  </div>
                  <div className="text-gray-500 text-sm">
                    Ask me anything to get started.
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2 duration-500`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`relative group ${msg.role === "user" ? "order-2" : "order-1"}`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm shadow-xl relative overflow-hidden ${
                        msg.role === "user"
                          ? `bg-gradient-to-r ${getCurrentTopic()?.color} text-white`
                          : "bg-gray-800/90 text-gray-100 border border-gray-700/50"
                      }`}
                    >
                      <div className="relative z-10">{msg.content}</div>
                      {msg.role === "user" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(loading || isTyping) && (
                <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                  <div className="px-4 py-3 rounded-2xl bg-gray-800/90 text-gray-300 text-sm border border-gray-700/50 flex items-center gap-3 shadow-xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="relative p-4 border-t border-gray-800/50 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-gray-800/90 text-gray-100 border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder-gray-500 transition-all duration-300 shadow-inner"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) handleSend();
                    }}
                    disabled={loading}
                    autoFocus
                  />
                  {input && (
                    <button
                      onClick={() => setInput("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
                <button
                  className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${getCurrentTopic()?.color} text-white font-medium hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 relative overflow-hidden group`}
                  onClick={handleSend}
                  disabled={loading || (!input.trim() && topicSet)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Sending</span>
                      </>
                    ) : (
                      <>
                        <span>Send</span>
                        <span className="text-lg">→</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Input hints */}
              {!topicSet && (
                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <span>💡</span>
                  <span>Press Enter to send or click a topic to start</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
