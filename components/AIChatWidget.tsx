"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatWidget: React.FC = () => {
  // Site-focused topics (Indonesian)
  const TOPICS = [
    {
      label: "Tentang Fitur",
      prompt: "Jelaskan fitur utama situs ini dan cara menggunakannya.",
      icon: "📚",
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Akun & Login",
      prompt: "Bantu saya soal pendaftaran, verifikasi email, dan login.",
      icon: "🔐",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Todo & Produktivitas",
      prompt: "Bagaimana cara mengelola Todo dan deadline di situs ini?",
      icon: "✅",
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Mock Interview",
      prompt: "Bagaimana membuat dan menjalankan mock interview?",
      icon: "�",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Notifikasi & Profil",
      prompt: "Bagaimana mengatur notifikasi dan mengubah profil?",
      icon: "🔔",
      color: "from-fuchsia-500 to-rose-500",
    },
    {
      label: "PWA & Instalasi",
      prompt: "Bagaimana memasang website ini sebagai aplikasi (PWA)?",
      icon: "�",
      color: "from-cyan-500 to-sky-500",
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

  // Helper to get current topic definition
  const getCurrentTopic = () => TOPICS.find((t) => t.label === selectedTopic);

  // Suggestions per topic
  const getSuggestions = () => {
    switch (selectedTopic) {
      case "Tentang Fitur":
        return [
          "Apa saja fitur utama di website ini?",
          "Bagaimana cara mulai menggunakan website ini?",
          "Apa manfaat masing-masing fitur?",
        ];
      case "Akun & Login":
        return [
          "Bagaimana cara daftar dan verifikasi email?",
          "Saya lupa password, apa yang harus dilakukan?",
          "Bisakah login dengan Google atau GitHub?",
        ];
      case "Todo & Produktivitas":
        return [
          "Bagaimana menambahkan dan menyusun Todo?",
          "Apa itu deadline pada Todo dan cara memakainya?",
          "Apakah ada drag & drop untuk Todo?",
        ];
      case "Mock Interview":
        return [
          "Bagaimana membuat sesi mock interview baru?",
          "Apa saja yang disimpan dari hasil interview?",
          "Bisakah men-custom pertanyaan interview?",
        ];
      case "Notifikasi & Profil":
        return [
          "Bagaimana mengatur dan menandai notifikasi?",
          "Bagaimana cara ubah nama dan foto profil?",
          "Apakah ada notifikasi email?",
        ];
      case "PWA & Instalasi":
        return [
          "Bagaimana memasang situs ini sebagai aplikasi di HP?",
          "Apakah situs ini bisa offline?",
          "Apa itu service worker di situs ini?",
        ];
      default:
        return ["Apa saja yang bisa kamu bantu di website ini?"]; 
    }
  };

  // Unified send with optional override text (for quick suggestions)
  const send = async (overrideText?: string) => {
    const text = overrideText ?? input;
    if (!text.trim() && !topicSet) return;
    let newMessages = [...messages];
    if (!topicSet) {
      const topicPrompt = getCurrentTopic()?.prompt || "Mari mulai bertanya tentang website ini.";
      newMessages = [
        { role: "user" as const, content: topicPrompt },
        ...(text.trim() ? [{ role: "user" as const, content: text.trim() }] : []),
      ];
      setTopicSet(true);
    } else if (text.trim()) {
      newMessages = [...messages, { role: "user", content: text.trim() }];
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
            content: data.reply || "Maaf, saya belum bisa menjawab itu.",
          },
        ]);
      }, 800);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Error: Layanan AI tidak dapat dijangkau." },
        ]);
      }, 800);
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
          <div className="text-[11px] text-gray-500 mt-1">Tanya apa pun tentang fitur & cara pakai website ini.</div>
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
                Pilih topik:
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
                  <div className="text-gray-700 text-xl font-bold mb-1">
                    Siap bantu soal {selectedTopic.toLowerCase()}.
                  </div>
                  <div className="text-gray-500 text-sm">
                    Pilih contoh pertanyaan di bawah atau ketik sendiri.
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 justify-center">
                    {getSuggestions().map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => send(s)}
                        className="px-3 py-1.5 text-xs rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition"
                        disabled={loading}
                        aria-label={`Contoh: ${s}`}
                      >
                        {s}
                      </button>
                    ))}
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
        <span className="font-medium">AI sedang berpikir...</span>
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
                    placeholder="Tanyakan tentang fitur atau cara pakai..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) send();
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
                  onClick={() => send()}
                  disabled={loading || (!input.trim() && topicSet)}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Mengirim</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim</span>
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
                  <span>Tekan Enter untuk mengirim atau pilih topik untuk mulai</span>
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
