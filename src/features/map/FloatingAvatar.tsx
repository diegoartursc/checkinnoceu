// src/features/map/FloatingAvatar.tsx
import React, { memo } from 'react';

const FloatingAvatar = memo(() => {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ animation: 'hoverFloat 2s ease-in-out infinite' }}
    >
      <div className="relative">
        {/* Shadow below */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/30 rounded-full blur-sm"></div>

        {/* Avatar frame */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-1 rounded-2xl shadow-[0_10px_30px_rgba(14,165,233,0.5)] border-4 border-sky-200">
          <div className="bg-white rounded-xl p-2">
            <div className="text-4xl">😇</div>
          </div>
        </div>
      </div>
    </div>
  );
});

FloatingAvatar.displayName = 'FloatingAvatar';

export default FloatingAvatar;
