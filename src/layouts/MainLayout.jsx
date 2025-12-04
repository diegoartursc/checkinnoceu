import React, { memo } from 'react';
import HUD from './HUD';
import BottomNav from './BottomNav';

const MainLayout = memo(({ children }) => {
    return (
        <div className="fixed inset-0 w-full h-full bg-slate-900 flex justify-center items-center overflow-hidden">
            <div className="relative w-full max-w-md h-full flex flex-col shadow-2xl bg-sky-50 overflow-hidden">
                <HUD />
                <div className="flex-1 overflow-hidden relative">
                    {children}
                </div>
                <BottomNav />
            </div>
        </div>
    );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
