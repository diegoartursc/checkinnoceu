import React, { memo } from 'react';
import HUD from './HUD';
import BottomNav from './BottomNav';

const MainLayout = memo(({ children }) => {
    return (
        <div className="w-full h-full max-w-md mx-auto bg-slate-900 overflow-hidden relative font-sans shadow-2xl flex flex-col">
            <HUD />

            {/* O container do conteúdo precisa de flex-1 e overflow-hidden para conter as transições */}
            <div className="flex-1 w-full relative overflow-hidden bg-slate-900">
                {children}
            </div>

            <BottomNav />
        </div>
    );
});

MainLayout.displayName = 'MainLayout';
export default MainLayout;
