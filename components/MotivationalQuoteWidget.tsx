import React from "react";

const quotes = [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
  },
  {
    text: "Don’t watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
  {
    text: "Believe you can and you’re halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Your limitation—it’s only your imagination.",
    author: "Unknown",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
  },
];

function getQuoteOfTheDay() {
  // Use day of year to pick a quote, so it changes daily but is consistent
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return quotes[day % quotes.length];
}

export default function MotivationalQuoteWidget() {
  const quote = getQuoteOfTheDay();
  return (
    <div className="bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 rounded-xl p-4 shadow-lg border border-cyan-700 w-full h-full flex flex-col justify-center items-center text-center text-sm max-w-xs min-w-[180px] min-h-[180px]">
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        className="mb-2 text-cyan-400"
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
      <p className="text-base md:text-lg font-semibold italic mb-2 text-cyan-100 leading-snug drop-shadow-lg">
        “{quote.text}”
      </p>
      <span className="text-xs md:text-sm text-cyan-300 font-medium tracking-wide">
        — {quote.author}
      </span>
    </div>
  );
}
