import React, { memo, useMemo } from 'react';

import { seededRandom } from '../../utils/dateUtils';

// Parallax Decorations (Match-3 Style)
const ParallaxDecorations = memo(({ position }) => {
  const decorations = useMemo(() => {
    // Use seededRandom to be pure
    const random = (seed, min, max) => seededRandom(seed) * (max - min) + min;

    return [
      // Islands
      { type: 'island', emoji: '🏝️', left: random(1, 5, 15), top: position * 0.3, size: 40, delay: 0 },
      { type: 'island', emoji: '🏝️', left: random(2, 70, 85), top: position * 0.5, size: 35, delay: 0.5 },

      // Rainbows
      { type: 'rainbow', emoji: '🌈', left: random(3, 10, 20), top: position * 0.4, size: 50, delay: 1 },
      { type: 'rainbow', emoji: '🌈', left: random(4, 75, 85), top: position * 0.6, size: 45, delay: 1.5 },

      // Stars
      { type: 'star', emoji: '✨', left: random(5, 15, 25), top: position * 0.2, size: 25, delay: 0.8 },
      { type: 'star', emoji: '⭐', left: random(6, 75, 85), top: position * 0.35, size: 30, delay: 1.2 },
    ];
  }, [position]);

  return (
    <>
      {decorations.map((deco, i) => (
        <div
          key={i}
          className="absolute pointer-events-none opacity-40 animate-pulse"
          style={{
            left: `${deco.left}%`,
            top: `${deco.top}px`,
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
