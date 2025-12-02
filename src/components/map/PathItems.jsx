import React, { memo, useMemo } from 'react';

import { seededRandom } from '../../utils/dateUtils';

// Itens decorativos no caminho (entre níveis)
const PathItems = memo(({ dayIndex }) => {
  const items = useMemo(() => {
    const decorations = [];
    const types = ['💰', '💛', '👣', '✨'];

    // Adiciona 1-2 itens aleatórios entre alguns dias
    // Use dayIndex as seed
    if (dayIndex % 3 === 0 && seededRandom(dayIndex) > 0.5) {
      const randomType = types[Math.floor(seededRandom(dayIndex + 1) * types.length)];
      const randomOffset = (seededRandom(dayIndex + 2) - 0.5) * 30;

      decorations.push({
        emoji: randomType,
        offset: randomOffset,
        delay: seededRandom(dayIndex + 3) * 2
      });
    }

    return decorations;
  }, [dayIndex]);

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-30 animate-pulse pointer-events-none"
          style={{
            left: `calc(50% + ${item.offset}px)`,
            top: '25px',
            animationDelay: `${item.delay}s`,
            animationDuration: '3s'
          }}
        >
          {item.emoji}
        </div>
      ))}
    </>
  );
});

PathItems.displayName = 'PathItems';

export default PathItems;
