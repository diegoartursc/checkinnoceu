// src/features/map/ParallaxDecorations.tsx
import React, { memo, useState } from 'react';

interface ParallaxDecorationsProps {
    position: number;
}

const ParallaxDecorations = memo(({ position }: ParallaxDecorationsProps) => {
  // Use state to hold random values to keep them stable across renders
  const [decorations] = useState(() => {
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    return [
      // Islands
      { type: 'island', emoji: '🏝️', left: random(5, 15), topFactor: 0.3, size: 40, delay: 0 },
      { type: 'island', emoji: '🏝️', left: random(70, 85), topFactor: 0.5, size: 35, delay: 0.5 },

      // Rainbows
      { type: 'rainbow', emoji: '🌈', left: random(10, 20), topFactor: 0.4, size: 50, delay: 1 },
      { type: 'rainbow', emoji: '🌈', left: random(75, 85), topFactor: 0.6, size: 45, delay: 1.5 },

      // Stars
      { type: 'star', emoji: '✨', left: random(15, 25), topFactor: 0.2, size: 25, delay: 0.8 },
      { type: 'star', emoji: '⭐', left: random(75, 85), topFactor: 0.35, size: 30, delay: 1.2 },
    ];
  });

  return (
    <>
      {decorations.map((deco, i) => (
        <div
          key={i}
          className="absolute pointer-events-none opacity-40 animate-pulse"
          style={{
            left: `${deco.left}%`,
            top: `${position * deco.topFactor}px`,
            fontSize: `${deco.size}px`,
            animationDelay: `${deco.delay}s`,
            zIndex: deco.type === 'star' ? 5 : 1
          }}
        >
          {deco.emoji}
        </div>
      ))}
    </>
  );
});

ParallaxDecorations.displayName = 'ParallaxDecorations';

export default ParallaxDecorations;
