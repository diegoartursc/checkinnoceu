import React from 'react';

const HabitatNuvem = ({ children }) => {
  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-b from-blue-50 to-sky-200">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds */}
        <div className="absolute top-8 left-[20%] text-white/60 animate-bounce delay-700 text-7xl opacity-50">☁️</div>
        <div className="absolute bottom-32 right-[10%] text-white/40 animate-pulse text-6xl">☁️</div>
        <div className="absolute top-1/3 left-10 text-white/30 text-4xl">✨</div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default HabitatNuvem;
