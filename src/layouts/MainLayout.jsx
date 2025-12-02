import React, { memo } from 'react';
import HUD from './HUD';
import BottomNav from './BottomNav';

const MainLayout = memo(({ children }) => {
    return (
        <div className="w-full h-screen max-w-md mx-auto bg-slate-900 overflow-hidden relative font-sans shadow-2xl">
            <HUD />
            <div className="h-full z-10 relative bg-slate-900 overflow-hidden">
                {children}
            </div>
            <BottomNav />
        </div>
    );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
