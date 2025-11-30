// src/features/game/CatcherGame.tsx
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';

interface CatcherGameProps {
    data: {
        target: string;
        avoid: string;
    };
    onWin: () => void;
}

const CatcherGame = memo(({ data, onWin }: CatcherGameProps) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const hasWonRef = useRef(false);

  useEffect(() => {
    if (score >= 5 && !hasWonRef.current) {
      hasWonRef.current = true;
      onWin();
    }
  }, [score, onWin]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (score >= 5) return;
      const newItem = {
        id: Date.now(),
        left: Math.random() * 70 + 10,
        type: Math.random() > 0.3 ? 'good' : 'bad',
        emoji: Math.random() > 0.3 ? data.target : data.avoid
      };
      setItems(prev => [...prev, newItem]);
    }, 800);
    return () => clearInterval(interval);
  }, [data, score]);

  const handleItemClick = useCallback((id: number, type: string) => {
    if (type === 'good') {
      setScore(prev => prev + 1);
    } else {
      setScore(prev => Math.max(0, prev - 1));
    }
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  return (
    <div className="h-full relative overflow-hidden bg-sky-50 rounded-xl border-2 border-sky-100">
      <div className="absolute top-2 right-2 font-bold text-sky-600 bg-white px-3 py-1 rounded-full shadow-sm z-10">
        {score} / 5
      </div>
      <p className="text-center text-gray-400 text-xs mt-2 pointer-events-none">
        Toque em {data.target}!
      </p>
      {items.map(item => (
        <button
          key={item.id}
          onAnimationEnd={() => setItems(prev => prev.filter(i => i.id !== item.id))}
          onClick={() => handleItemClick(item.id, item.type)}
          className="absolute text-3xl sm:text-4xl animate-fall cursor-pointer active:scale-90 transition-transform"
          style={{ left: `${item.left}%`, animationDuration: '3s' }}
        >
          {item.emoji}
        </button>
      ))}
    </div>
  );
});

CatcherGame.displayName = 'CatcherGame';

export default CatcherGame;
