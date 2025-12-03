import React, { memo } from 'react';
import HUD from './HUD';
import BottomNav from './BottomNav';

const MainLayout = memo(({ children, showHud = true, showNav = true }) => {
    return (
        <div className="flex justify-center w-full h-[100dvh] bg-sky-50 overflow-hidden">
            <div className="relative w-full max-w-md h-full flex flex-col shadow-2xl bg-sky-50 overflow-hidden">
                {showHud && <HUD />}
                <main className="flex-1 w-full h-full overflow-y-auto scroll-smooth custom-scrollbar relative">
                    {children}
                </main>
                {showNav && <BottomNav />}
            </div>
        </div>
    );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
