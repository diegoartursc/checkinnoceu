import React, { memo } from 'react';

// Campo Gramado + Decorações de Bioma 3D com Parallax
const BiomeDecorations = memo(({ monthIndex }) => {
  const getSeasonDecorations = () => {
    const month = monthIndex; // 0=Jan, 11=Dez

    // Verão (Dez-Mar): Flores vibrantes e palmeiras
    if (month >= 11 || month <= 2) {
      return (
        <>
          {/* Elementos ATRÁS da estrada (z-[0]) */}
          <div className="absolute left-[-10px] top-[8%] text-7xl opacity-50 z-[0]">🌴</div>
          <div className="absolute right-[-5px] top-[25%] text-6xl opacity-45 z-[0]">🌴</div>
          <div className="absolute left-2 top-[50%] text-5xl opacity-40 z-[0]">🌿</div>
          <div className="absolute right-3 top-[68%] text-7xl opacity-50 z-[0]">🌴</div>

          {/* Elementos NO MEIO (z-[2] - ao lado da estrada) */}
          <div className="absolute left-4 top-[12%] text-6xl opacity-55 z-[2] drop-shadow-lg">🌺</div>
          <div className="absolute right-6 top-[20%] text-5xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>🌻</div>
          <div className="absolute left-6 top-[38%] text-4xl opacity-50 z-[2]">🪨</div>
          <div className="absolute right-4 top-[55%] text-6xl opacity-55 z-[2] drop-shadow-lg">🌺</div>
          <div className="absolute left-5 top-[75%] text-5xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3.5s' }}>🌻</div>
          <div className="absolute right-5 top-[88%] text-4xl opacity-50 z-[2]">🪨</div>

          {/* Elementos NA FRENTE da estrada (z-[15] - profundidade) */}
          <div className="absolute left-[-5px] top-[32%] text-8xl opacity-70 z-[15] drop-shadow-2xl">🌿</div>
          <div className="absolute right-[-8px] top-[78%] text-7xl opacity-65 z-[15] drop-shadow-2xl">🌺</div>
        </>
      );
    }

    // Outono (Abr-Jun): Folhas caindo e cogumelos
    if (month >= 3 && month <= 5) {
      return (
        <>
          {/* Elementos ATRÁS */}
          <div className="absolute left-[-8px] top-[10%] text-6xl opacity-45 z-[0]">🌳</div>
          <div className="absolute right-[-6px] top-[28%] text-7xl opacity-40 z-[0]">🌳</div>
          <div className="absolute left-2 top-[55%] text-6xl opacity-45 z-[0]">🌳</div>

          {/* Elementos NO MEIO */}
          <div className="absolute left-5 top-[15%] text-6xl opacity-55 z-[2] drop-shadow-lg animate-pulse" style={{ animationDuration: '4s' }}>🍂</div>
          <div className="absolute right-4 top-[22%] text-7xl opacity-60 z-[2] drop-shadow-lg">🍁</div>
          <div className="absolute left-6 top-[40%] text-5xl opacity-50 z-[2]">🍄</div>
          <div className="absolute right-6 top-[58%] text-6xl opacity-55 z-[2] drop-shadow-lg animate-pulse" style={{ animationDuration: '5s' }}>🍂</div>
          <div className="absolute left-4 top-[72%] text-5xl opacity-50 z-[2]">🍄</div>
          <div className="absolute right-3 top-[85%] text-4xl opacity-45 z-[2]">🪨</div>

          {/* Elementos NA FRENTE */}
          <div className="absolute left-[-6px] top-[35%] text-8xl opacity-65 z-[15] drop-shadow-2xl animate-pulse" style={{ animationDuration: '6s' }}>🍁</div>
          <div className="absolute right-[-10px] top-[68%] text-7xl opacity-70 z-[15] drop-shadow-2xl">🍂</div>
        </>
      );
    }

    // Inverno (Jul-Set): Neve e pinheiros
    if (month >= 6 && month <= 8) {
      return (
        <>
          {/* Elementos ATRÁS */}
          <div className="absolute left-[-12px] top-[12%] text-8xl opacity-50 z-[0]">🌲</div>
          <div className="absolute right-[-10px] top-[30%] text-7xl opacity-45 z-[0]">🌲</div>
          <div className="absolute left-[-8px] top-[60%] text-8xl opacity-50 z-[0]">🌲</div>

          {/* Elementos NO MEIO */}
          <div className="absolute left-4 top-[18%] text-4xl opacity-60 z-[2] animate-pulse" style={{ animationDuration: '3s' }}>❄️</div>
          <div className="absolute right-5 top-[25%] text-5xl opacity-55 z-[2] animate-pulse" style={{ animationDuration: '4s' }}>❄️</div>
          <div className="absolute left-6 top-[45%] text-6xl opacity-60 z-[2] animate-pulse" style={{ animationDuration: '5s' }}>❄️</div>
          <div className="absolute right-4 top-[65%] text-4xl opacity-55 z-[2] animate-pulse" style={{ animationDuration: '3.5s' }}>❄️</div>
          <div className="absolute left-5 top-[82%] text-5xl opacity-60 z-[2] animate-pulse" style={{ animationDuration: '4.5s' }}>❄️</div>

          {/* Elementos NA FRENTE */}
          <div className="absolute left-[-5px] top-[38%] text-9xl opacity-70 z-[15] drop-shadow-2xl">🌲</div>
          <div className="absolute right-[-8px] top-[75%] text-8xl opacity-65 z-[15] drop-shadow-2xl">🌲</div>
        </>
      );
    }

    // Primavera (Out-Nov): Flores coloridas e borboletas
    return (
      <>
        {/* Elementos ATRÁS */}
        <div className="absolute left-[-6px] top-[8%] text-6xl opacity-45 z-[0]">🌳</div>
        <div className="absolute right-[-8px] top-[26%] text-7xl opacity-40 z-[0]">🌳</div>
        <div className="absolute left-2 top-[52%] text-6xl opacity-45 z-[0]">🌳</div>

        {/* Elementos NO MEIO */}
        <div className="absolute left-5 top-[14%] text-6xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>🌸</div>
        <div className="absolute right-4 top-[20%] text-7xl opacity-65 z-[2] drop-shadow-lg">🌺</div>
        <div className="absolute left-6 top-[36%] text-5xl opacity-55 z-[2]">🦋</div>
        <div className="absolute right-6 top-[48%] text-6xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>🌼</div>
        <div className="absolute left-4 top-[66%] text-7xl opacity-65 z-[2] drop-shadow-lg">🌻</div>
        <div className="absolute right-5 top-[78%] text-5xl opacity-55 z-[2]">🦋</div>
        <div className="absolute left-6 top-[90%] text-6xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3.5s' }}>🌸</div>

        {/* Elementos NA FRENTE */}
        <div className="absolute left-[-7px] top-[42%] text-8xl opacity-70 z-[15] drop-shadow-2xl">🌺</div>
        <div className="absolute right-[-10px] top-[84%] text-7xl opacity-65 z-[15] drop-shadow-2xl">🌻</div>
      </>
    );
  };

  return (
    <>
      {/* Props 3D do Bioma com Parallax (sem fundo verde - mantém céu azul) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getSeasonDecorations()}
      </div>
    </>
  );
});

BiomeDecorations.displayName = 'BiomeDecorations';

export default BiomeDecorations;
