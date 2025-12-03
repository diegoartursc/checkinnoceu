import React, { memo } from 'react';
import BottomNav from './BottomNav';
import HUD from './HUD';

const MainLayout = memo(({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-sky-50">
      {/* HUD - Overlay/Fixed Top */}
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
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
