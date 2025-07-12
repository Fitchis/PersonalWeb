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
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Coding Help",
      prompt: "I need help with coding.",
      icon: "💻",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Career Advice",
      prompt: "Give me some career advice.",
      icon: "🎯",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "General Chat",
      prompt: "Let's chat!",
      icon: "💬",
      color: "from-purple-500 to-pink-500",
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
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-500"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className={`relative group bg-white shadow-2xl hover:shadow-3xl text-gray-800 rounded-full w-16 h-16 flex items-center justify-center text-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-500 hover:scale-110 ${open ? "rotate-45 bg-gray-100" : ""} border-2 border-gray-100`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Open AI Chat"
        >
          <span className="transition-all duration-500 relative z-10">
            {open ? "✕" : "🤖"}
          </span>
          {!open && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-32 md:right-8 md:w-[400px] md:h-[600px]">
          <div className="relative bg-white border-2 border-gray-100 rounded-none md:rounded-3xl shadow-2xl w-full h-full flex flex-col animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-4 duration-500 overflow-hidden">
            {/* Decorative top border */}
            <div
              className={`h-1 bg-gradient-to-r ${getCurrentTopic()?.color} w-full`}
            ></div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${getCurrentTopic()?.color} rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300`}
                  >
                    <span className="text-white text-xl font-bold">AI</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 text-lg">
                      AI Assistant
                    </span>
                    <div className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium border border-green-200">
                      Online
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium flex items-center gap-2 mt-1">
                    <span className="text-base">{getCurrentTopic()?.icon}</span>
                    <span>{selectedTopic}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
              >
                ×
              </button>
            </div>

            {/* Topic Picker */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <label className="block text-sm md:text-xs text-gray-700 mb-3 font-semibold">
                Choose your topic:
              </label>
              <div className="grid grid-cols-2 gap-2 md:gap-1 md:grid-cols-4">
                {TOPICS.map((t) => (
                  <button
                    key={t.label}
                    className={`group relative p-3 md:p-2 rounded-xl text-sm md:text-xs font-medium border-2 transition-all duration-300 hover:scale-105 ${
                      selectedTopic === t.label
                        ? `bg-gradient-to-r ${t.color} text-white border-transparent shadow-lg`
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    onClick={() => {
                      setSelectedTopic(t.label);
                      setMessages([]);
                      setTopicSet(false);
                      setInput("");
                    }}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2 md:gap-1 justify-center">
                      <span className="text-lg md:text-base">{t.icon}</span>
                      <span className="md:hidden">{t.label}</span>
                      <span className="hidden md:inline">
                        {t.label.split(" ")[0]}
                      </span>
                    </div>
                    {selectedTopic === t.label && (
                      <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 && (
                <div className="text-center mt-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${getCurrentTopic()?.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500`}
                    >
                      <span className="text-white text-3xl">
                        {getCurrentTopic()?.icon}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
                  </div>
                  <div className="text-gray-700 text-xl font-bold mb-2">
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
                  <div className={`relative group max-w-[85%]`}>
                    <div
                      className={`px-4 py-3 text-sm shadow-lg relative overflow-hidden ${
                        msg.role === "user"
                          ? `bg-gradient-to-r ${getCurrentTopic()?.color} text-white rounded-2xl rounded-br-md`
                          : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md"
                      }`}
                    >
                      <div className="relative z-10">{msg.content}</div>
                      {msg.role === "user" && (
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl rounded-br-md"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(loading || isTyping) && (
                <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white text-gray-600 text-sm border border-gray-200 flex items-center gap-3 shadow-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="font-medium">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-gray-50 text-gray-800 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-500 transition-all duration-300 hover:border-gray-300"
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                      ×
                    </button>
                  )}
                </div>
                <button
                  className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${getCurrentTopic()?.color} text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 relative overflow-hidden group`}
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
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </button>
              </div>

              {!topicSet && (
                <div className="mt-3 text-xs text-gray-500 flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                  <span className="text-blue-500">💡</span>
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
