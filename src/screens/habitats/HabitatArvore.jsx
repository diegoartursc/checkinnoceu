import React from 'react';

const HabitatArvore = ({ children }) => {
  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-b from-blue-100 to-green-100">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-800/10 to-transparent"></div>
        <div className="absolute top-10 right-10 text-yellow-400/50 text-6xl animate-pulse">☀️</div>
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 font-bold bg-white/50 p-4 rounded-xl backdrop-blur-sm">
           🔒 Habitat Árvore (Em breve)
        </div>
      </div>
    </div>
  );
};

export default HabitatArvore;
