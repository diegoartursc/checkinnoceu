import React, { useState, useEffect, useCallback, memo } from 'react';

/**
 * Memory Game - Match pairs of emojis
 */
const MemoryGame = memo(({ data, onWin }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const shuffled = [...data.items]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, content: emoji }));
    setCards(shuffled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = useCallback((id) => {
    if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = cards.find(c => c.id === newFlipped[1]);

      if (firstCard.content === secondCard.content) {
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
