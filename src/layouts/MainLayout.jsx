import React, { memo } from 'react';
import BottomNav from './BottomNav';
import HUD from './HUD';

const MainLayout = memo(({ children }) => {
  return (
    <div className="flex justify-center min-h-screen w-full bg-slate-900">
      <div className="flex flex-col h-screen w-full max-w-[480px] bg-sky-50 relative shadow-2xl overflow-hidden">
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
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
