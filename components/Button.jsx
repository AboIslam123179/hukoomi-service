"use client";

import { useState } from "react";

export default function LoadingButton({ children, onClick, w }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent multiple clicks

    if (onClick) {
      try {
        // Parent must return true (start loading) or false (skip loading)
        const shouldLoad = await onClick(e);
        if (shouldLoad === false) return;

        setLoading(true);
        setTimeout(() => setLoading(false), 5000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-3xl font-medium transition-colors duration-300
        ${
          loading ? "opacity-80 cursor-not-allowed" : "hover:bg-[rgb(122,0,36)]"
        }
      `}
      style={{ backgroundColor: "rgb(92,0,26)", width: w || "40%" }}
    >
      {children}
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
    </button>
  );
}
