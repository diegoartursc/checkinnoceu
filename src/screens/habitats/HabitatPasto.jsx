import React from 'react';

const HabitatPasto = ({ children }) => {
  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-b from-emerald-50 to-green-200">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds */}
        <div className="absolute top-10 left-[10%] text-white/40 animate-pulse text-6xl">☁️</div>
        <div className="absolute top-20 right-[15%] text-white/30 animate-pulse delay-1000 text-5xl">☁️</div>

        {/* Grass Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-300/30 to-transparent"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default HabitatPasto;
