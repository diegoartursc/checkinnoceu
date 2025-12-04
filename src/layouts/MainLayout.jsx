import React, { memo } from 'react';
import BottomNav from './BottomNav';
import HUD from './HUD';

const MainLayout = memo(({ children }) => {
  return (
    <div className="w-full min-h-screen flex justify-center bg-sky-50">
      {/* Inner wrapper: Mobile frame */}
      {/* CHANGED: min-h-screen -> h-screen (or h-[100dvh]) to fix infinite growth bug.
          This is CRITICAL for the central scrollable area to work. */}
      <div className="relative flex flex-col max-w-md w-full h-[100dvh] overflow-hidden bg-sky-50 shadow-2xl">
        {/* HUD - Overlay/Fixed Top */}
        <HUD />

        {/* Central Scrollable Area */}
        {/* Adds padding for HUD and BottomNav so content doesn't get hidden */}
        <div className="flex-1 w-full overflow-y-auto custom-scrollbar optimize-scroll pt-16 pb-24">
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
