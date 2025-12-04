import React, { memo } from 'react';
import BottomNav from './BottomNav';
import HUD from './HUD';

const MainLayout = memo(({ children }) => {
  return (
    <div className="w-full min-h-screen flex justify-center bg-sky-50">
      {/* Inner wrapper: Mobile frame */}
      <div className="relative flex flex-col max-w-md w-full min-h-screen overflow-hidden bg-sky-50 shadow-2xl">
        {/* HUD - Overlay/Fixed Top */}
        <HUD />

        {/* Central Scrollable Area */}
        {/* Adds padding for HUD and BottomNav so content doesn't get hidden */}
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar optimize-scroll pt-16 pb-24">
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
