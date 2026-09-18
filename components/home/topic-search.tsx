"use client";

import { useState } from "react";
import { ALL_TOPICS } from "@/lib/homepage-data";

export function TopicSearch() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const hits = q
    ? ALL_TOPICS.filter((t) => `${t.title} ${t.description}`.toLowerCase().includes(q)).slice(0, 6)
    : [];

  let resultText = "";
  if (q) {
    resultText = hits.length
      ? `${hits.length} topic${hits.length > 1 ? "s" : ""} match "${query.trim()}"`
      : "No topic matched yet — try a broader term.";
  }

  return (
    <>
      <div className="mm-search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          placeholder="Try: equations, graphs, probability…"
          aria-label="Search topics"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="mm-search-results">{resultText}</div>
    </>
  );
}
