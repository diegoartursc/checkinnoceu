// src/features/game/MemoryGame.tsx
import React, { memo, useState, useCallback, useEffect } from 'react';

interface Card {
    id: number;
    content: string;
}

interface MemoryGameProps {
    data: {
        items: string[];
    };
    onWin: () => void;
}

const MemoryGame = memo(({ data, onWin }: MemoryGameProps) => {
  // Initialize state once. The component key in parent handles resets.
  const [cards] = useState<Card[]>(() => {
    return [...data.items]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, content: emoji }));
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleCardClick = useCallback((id: number) => {
    if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = cards.find(c => c.id === newFlipped[1]);

      if (firstCard && secondCard && firstCard.content === secondCard.content) {
        setMatched(prev => [...prev, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped, matched, cards]);

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setTimeout(onWin, 500);
    }
  }, [matched, cards, onWin]);

  return (
    <div className="grid grid-cols-4 gap-2 h-full content-center p-2">
      {cards.map(card => {
        const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
        return (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 transform ${isFlipped ? 'bg-white shadow-md rotate-0' : 'bg-sky-200 rotate-180'}`}
          >
            {isFlipped ? card.content : ''}
          </button>
        );
      })}
    </div>
  );
});

MemoryGame.displayName = 'MemoryGame';

export default MemoryGame;
