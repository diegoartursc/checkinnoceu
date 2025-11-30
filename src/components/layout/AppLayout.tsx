// src/components/layout/AppLayout.tsx
import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const AppLayout = memo(() => {
  return (
    <div className="w-full h-screen max-w-md mx-auto bg-slate-900 overflow-hidden relative font-sans shadow-2xl">
      <Header />
      <div className="h-full z-10 relative bg-slate-900 pb-20">
         <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;
