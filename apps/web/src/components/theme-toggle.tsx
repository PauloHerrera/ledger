"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Icons } from "@repo/ui/icons";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={`flex w-14 h-7 p-1 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
        } ${className || ""}`}
        onClick={toggleTheme}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
        tabIndex={0}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full shadow transition-transform duration-300 ${
            isDark ? "translate-x-7 bg-zinc-800" : "translate-x-0 bg-gray-200"
          }`}
        >
          {isDark ? (
            <Icons.Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
          ) : (
            <Icons.Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
          )}
        </span>
      </button>
    </div>
  );
}
