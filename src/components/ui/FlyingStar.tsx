// src/components/ui/FlyingStar.tsx
import React, { memo, useEffect } from 'react';
import { Star } from 'lucide-react';

interface FlyingStarProps {
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
    onComplete: () => void;
}

const FlyingStar = memo(({ startPos, endPos, onComplete }: FlyingStarProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const deltaX = endPos.x - startPos.x;
  const deltaY = endPos.y - startPos.y;

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: `${startPos.x}px`,
        top: `${startPos.y}px`,
        // @ts-ignore
        '--target-x': `${deltaX}px`,
        '--target-y': `${deltaY}px`,
        animation: 'flyToHUD 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
      }}
    >
      <Star size={32} className="fill-yellow-400 text-yellow-400 drop-shadow-lg" />
    </div>
  );
});

FlyingStar.displayName = 'FlyingStar';

export default FlyingStar;
