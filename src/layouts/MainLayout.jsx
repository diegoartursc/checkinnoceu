import React, { memo } from 'react';
import BottomNav from './BottomNav';
import HUD from './HUD';

const MainLayout = memo(({ children }) => {
  return (
    // Outer Container: The "Void" (Dark Background, Centered)
    <div className="fixed inset-0 bg-[#0f172a] flex justify-center overflow-hidden">

      {/* Mobile App Frame: Max width 480px, Full Height */}
      <div className="w-full max-w-[480px] h-full flex flex-col relative overflow-hidden bg-sky-50 shadow-2xl">

        {/* HUD - Should be positioned absolutely or relative within this frame */}
        <HUD />

        {/* Main Content Area - Clipped, children handle scroll */}
        <div className="flex-1 overflow-hidden relative">
          <div className="w-full h-full relative">
            {children}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
