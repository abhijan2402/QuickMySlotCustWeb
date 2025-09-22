import React from "react";

export default function CardCarouselLoader({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative min-w-[320px] h-[320px] bg-gray-200 rounded-xl overflow-hidden"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
}
