"use client";
import React, { useEffect, useState } from "react";
import { fallbackQuotes } from "./fallbackQuotes";

const categories = [
  { value: "inspire", label: "Motivation" },
  { value: "religion", label: "Religion" },
  { value: "love", label: "Love" },
  { value: "funny", label: "Funny" },
  { value: "life", label: "Life" },
  { value: "success", label: "Success" },
];

function getLocalQuote(
  category: string
): { text: string; author: string } | null {
  const localQuotes = fallbackQuotes[category];
  if (localQuotes && localQuotes.length > 0) {
    return localQuotes[Math.floor(Math.random() * localQuotes.length)];
  }
  return null;
}

export default function MotivationalQuoteWidget() {
  const [category, setCategory] = useState(categories[0].value);
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = getLocalQuote(category);
    if (q) {
      setQuote(q);
    } else {
      setQuote(null);
      setError("Failed to get quote. Try another category.");
    }
    setLoading(false);
  }, [category]);

  return (
    <div className="bg-gray-900/60 rounded-xl p-3 md:p-4 shadow-lg border border-gray-700/60 w-full h-full flex flex-col justify-center items-center text-center text-xs md:text-sm min-h-[120px] md:min-h-[160px] backdrop-blur-sm">
      <div className="mb-2 w-full flex flex-col items-center">
        <label htmlFor="quote-category" className="text-gray-400 text-xs mb-1">
          Quote Category:
        </label>
        <select
          id="quote-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-800 text-gray-200 px-2 py-1 rounded-md border border-gray-700 text-xs"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        className="mb-1 md:mb-2 text-gray-300"
      >
        <path
          d="M7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M7 17C7 15.3431 8.34315 14 10 14H14C15.6569 14 17 15.3431 17 17V18C17 19.1046 16.1046 20 15 20H9C7.89543 20 7 19.1046 7 18V17Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      {loading && <p className="text-gray-400">Loading...</p>}
      {quote && (
        <>
          <p className="text-xs md:text-base font-semibold italic mb-1 md:mb-2 text-gray-100 leading-snug drop-shadow-lg">
            “{quote.text}”
          </p>
          <span className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide">
            — {quote.author}
          </span>
        </>
      )}
      {error && <p className="text-yellow-400 mt-2">{error}</p>}
    </div>
  );
}
