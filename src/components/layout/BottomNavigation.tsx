// src/components/layout/BottomNavigation.tsx
import React, { memo } from 'react';
import { Home, Map, Heart, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', icon: Home, label: 'Hoje', color: 'from-orange-400 to-orange-600', border: 'border-orange-700' },
    { path: '/map', icon: Map, label: 'Mapa', color: 'from-blue-400 to-blue-600', border: 'border-blue-700' },
    { path: '/lar', icon: Heart, label: 'Lar', color: 'from-pink-400 to-pink-600', border: 'border-pink-700' },
    { path: '/settings', icon: Settings, label: 'Config', color: 'from-gray-400 to-gray-600', border: 'border-gray-700' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex items-center justify-around z-40 px-4 py-3 border-t-4 border-gray-100">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isActive
                ? `bg-gradient-to-b ${item.color} text-white shadow-lg scale-110 -translate-y-6 border-b-4 ${item.border}`
                : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
            }`}
          >
             <item.icon size={isActive ? 28 : 24} strokeWidth={3} fill={isActive && item.label === 'Lar' ? 'currentColor' : 'none'} />
             <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
