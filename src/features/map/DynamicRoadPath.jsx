import React, { memo, useCallback, useMemo } from 'react';

// Dynamic Road Path - Conecta Pontos Exatos dos Nodes (King/Zynga Professional Style)
const DynamicRoadPath = memo(({ nodePositions, containerHeight }) => {
  // Gera SVG path que conecta EXATAMENTE os centros dos nodes
  const generateConnectedPath = useCallback(() => {
    if (!nodePositions || nodePositions.length === 0) return '';

    let pathData = '';

    // Move to primeiro node
    pathData += `M ${nodePositions[0].x} ${nodePositions[0].y} `;

    // Conecta todos os nodes com curvas suaves
    for (let i = 1; i < nodePositions.length; i++) {
      const prev = nodePositions[i - 1];
      const curr = nodePositions[i];

      // Quadratic Bezier para curva suave
      const controlX = (prev.x + curr.x) / 2;
      const controlY = (prev.y + curr.y) / 2;

      pathData += `Q ${controlX} ${controlY}, ${curr.x} ${curr.y} `;
    }

    return pathData;
  }, [nodePositions]);

  const pathData = useMemo(() => generateConnectedPath(), [generateConnectedPath]);

  if (!pathData) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-[1]"
      width="100%"
      height={containerHeight}
      style={{ minHeight: '100%' }}
    >
      <defs>
        {/* Enhanced Cobblestone Texture Pattern - Realista */}
        <pattern id="roadTexture" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* Pedra 1 - Tom mais claro */}
          <rect x="2" y="2" width="24" height="24" fill="#8b8680" rx="4" opacity="0.95">
            <animate attributeName="opacity" values="0.95;0.92;0.95" dur="5s" repeatCount="indefinite" />
          </rect>
          <rect x="3" y="3" width="10" height="10" fill="#a8a29e" rx="2" opacity="0.3" />

          {/* Pedra 2 - Tom médio */}
          <rect x="31" y="2" width="26" height="24" fill="#6b7280" rx="4" opacity="0.9" />
          <path d="M 35 8 Q 40 10, 45 8" stroke="#52525b" strokeWidth="1" fill="none" opacity="0.5" />

          {/* Pedra 3 - Tom escuro */}
          <rect x="2" y="31" width="24" height="26" fill="#57534e" rx="4" opacity="0.93" />
          <circle cx="10" cy="40" r="2" fill="#3f3f46" opacity="0.4" />

          {/* Pedra 4 - Tom marrom */}
          <rect x="31" y="31" width="26" height="26" fill="#78716c" rx="4" opacity="0.88" />
          <rect x="38" y="38" width="8" height="8" fill="#a8a29e" rx="1" opacity="0.25" />

          {/* Linhas de separação (argamassa/terra) */}
          <line x1="28" y1="0" x2="28" y2="60" stroke="#3f3f46" strokeWidth="3" opacity="0.5" />
          <line x1="0" y1="28" x2="60" y2="28" stroke="#3f3f46" strokeWidth="3" opacity="0.5" />

          {/* Rachaduras nas pedras */}
          <path d="M 8 6 L 12 10" stroke="#27272a" strokeWidth="0.8" opacity="0.4" />
          <path d="M 40 35 Q 42 38, 44 40" stroke="#27272a" strokeWidth="0.8" opacity="0.3" />
          <path d="M 6 45 L 10 50" stroke="#27272a" strokeWidth="0.7" opacity="0.35" />

          {/* Musgo e sujeira (detalhes verdes/marrons) */}
          <circle cx="7" cy="8" r="1.5" fill="#84cc16" opacity="0.35" />
          <circle cx="50" cy="12" r="1.2" fill="#65a30d" opacity="0.3" />
          <circle cx="15" cy="48" r="1.8" fill="#78716c" opacity="0.25" />
          <circle cx="45" cy="50" r="1" fill="#84cc16" opacity="0.4" />

          {/* Variações de cor (highlights) */}
          <ellipse cx="12" cy="12" rx="3" ry="2" fill="#d6d3d1" opacity="0.15" />
          <ellipse cx="42" cy="18" rx="4" ry="2.5" fill="#e7e5e4" opacity="0.12" />
          <ellipse cx="18" cy="42" rx="2.5" ry="2" fill="#fafaf9" opacity="0.1" />
        </pattern>

        <filter id="roadRelief">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#d4d4d8" surfaceScale="1.5" result="diffLight">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feComposite in="diffLight" in2="SourceGraphic" operator="multiply" />
        </filter>

        <linearGradient id="depthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#57534e" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#78716c" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6b7280" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* CAMADA 1: Sombra (Profundidade 3D) */}
      <path
        d={pathData}
        fill="none"
        stroke="#27272a"
        strokeWidth="76"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        transform="translate(0, 4)"
      />

      {/* CAMADA 2: Borda Grama Escura */}
      <path
        d={pathData}
        fill="none"
        stroke="#4d7c0f"
        strokeWidth="88"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* CAMADA 3: Borda Grama Clara */}
      <path
        d={pathData}
        fill="none"
        stroke="#65a30d"
        strokeWidth="80"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />

      {/* CAMADA 4: Estrada Cobblestone */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#roadTexture)"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* CAMADA 5: Overlay Profundidade */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#depthGradient)"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />

      {/* CAMADA 6: Highlight */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5,10"
        opacity="0.6"
      />
    </svg>
  );
});

DynamicRoadPath.displayName = 'DynamicRoadPath';

export default DynamicRoadPath;
