import React, { useState, useEffect } from 'react';

const FazendinhaDaCriacaoGame = ({ onFinish }) => {
  const [garden, setGarden] = useState([
    { id: 0, state: 'empty', waterCount: 0, growthProgress: 0 },
    { id: 1, state: 'empty', waterCount: 0, growthProgress: 0 },
    { id: 2, state: 'empty', waterCount: 0, growthProgress: 0 },
    { id: 3, state: 'empty', waterCount: 0, growthProgress: 0 }
  ]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [gameOver, setGameOver] = useState(false);

  // Game timer
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  // Plant a seed in a plot
  const plantSeed = (plotId) => {
    if (garden[plotId].state === 'empty') {
      setGarden(prev => 
        prev.map(plot => 
          plot.id === plotId 
            ? { ...plot, state: 'seed', waterCount: 0, growthProgress: 0 }
            : plot
        )
      );
    }
  };

  // Water a plant
  const waterPlant = (plotId) => {
    const plot = garden[plotId];
    if (plot.state === 'seed' || plot.state === 'growing') {
      const newWaterCount = plot.waterCount + 1;
      let newState = plot.state;
      let newGrowthProgress = plot.growthProgress + 25; // Each watering adds 25% growth
      
      if (newGrowthProgress >= 100 && plot.state === 'growing') {
        newState = 'ready';
      } else if (newWaterCount >= 1 && plot.state === 'seed') {
        newState = 'growing';
        newGrowthProgress = 25;
      }

      setGarden(prev => 
        prev.map(p => 
          p.id === plotId 
            ? { ...p, state: newState, waterCount: newWaterCount, growthProgress: newGrowthProgress }
            : p
        )
      );
    }
  };

  // Harvest a plant
  const harvestPlant = (plotId) => {
    const plot = garden[plotId];
    if (plot.state === 'ready') {
      // Add points for harvesting
      const pointsEarned = 50;
      setScore(prev => prev + pointsEarned);
      
      // Reset the plot to empty
      setGarden(prev => 
        prev.map(p => 
          p.id === plotId 
            ? { ...p, state: 'empty', waterCount: 0, growthProgress: 0 }
            : p
        )
      );
    }
  };

  // Get visual representation of plot state
  const getPlotVisual = (plot) => {
    switch (plot.state) {
      case 'empty':
        return (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            🕳️
          </div>
        );
      case 'seed':
        return (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🌱
          </div>
        );
      case 'growing':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-3xl mb-1">🌿</div>
            <div className="w-8 h-1 bg-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${plot.growthProgress}%` }}
              />
            </div>
          </div>
        );
      case 'ready':
        return (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🌾
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
            ❓
          </div>
        );
    }
  };

  // Get plot action button text
  const getPlotActionText = (plot) => {
    switch (plot.state) {
      case 'empty':
        return 'Plantar';
      case 'seed':
      case 'growing':
        return 'Regar';
      case 'ready':
        return 'Colher';
      default:
        return 'Ação';
    }
  };

  // Get plot action handler
  const handlePlotAction = (plotId) => {
    const plot = garden[plotId];
    switch (plot.state) {
      case 'empty':
        plantSeed(plotId);
        break;
      case 'seed':
      case 'growing':
        waterPlant(plotId);
        break;
      case 'ready':
        harvestPlant(plotId);
        break;
      default:
        break;
    }
  };

  // Handle game finish
  const handleFinish = () => {
    onFinish(score);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* CAMADA 1: Fundo Verde Celestial */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-emerald-100"></div>

      {/* CAMADA 2: Nuvens Sutis */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-[5%] text-green-200/50 animate-pulse gpu-accelerate">
          <div className="text-4xl">☁️</div>
        </div>
        <div className="absolute top-12 right-[8%] text-emerald-200/40 animate-pulse gpu-accelerate" style={{ animationDelay: '0.5s' }}>
          <div className="text-3xl">☁️</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            Fazendinha da Criação
          </h1>
          <p className="text-sm text-green-600 mt-1">
            Plante, regue e colha frutos celestiais! 🌱
          </p>
        </div>

        {/* Score and Timer */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-green-100">
            <p className="text-sm font-bold text-green-700">Pontos: {score}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-green-100">
            <p className="text-sm font-bold text-green-700">Tempo: {formatTime(timeLeft)}</p>
          </div>
        </div>

        {/* Garden Plots */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {garden.map((plot) => (
            <div
              key={plot.id}
              className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl p-4 shadow-sm border border-amber-200 min-h-[120px]"
            >
              <div className="flex flex-col items-center">
                {/* Plot Visual */}
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mb-2 shadow-inner">
                  {getPlotVisual(plot)}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handlePlotAction(plot.id)}
                  disabled={gameOver}
                  className={`
                    w-full py-2 rounded-xl font-bold text-sm shadow-sm transition-all
                    ${plot.state === 'empty' 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : plot.state === 'ready'
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                    ${gameOver ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}
                  `}
                >
                  {getPlotActionText(plot)}
                </button>

                {/* Growth Progress Bar (for growing plants) */}
                {(plot.state === 'growing' || plot.state === 'ready') && (
                  <div className="w-full mt-2">
                    <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${plot.growthProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-green-700 text-center mt-1">
                      Crescimento: {plot.growthProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full relative">
              <div className="text-6xl mb-4">🌾</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Colheita Finalizada!
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Você colheu <span className="font-bold text-green-600">{score}</span> frutos!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                A fazendinha da criação floresceu!
              </p>
              <button
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Finalizar Jogo
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 mx-4 mt-6 shadow-sm">
          <p className="text-[10px] text-green-700 text-center font-medium leading-tight">
            💡 Plante sementes, regue-as e espere crescerem para colher frutos e ganhar pontos!
          </p>
        </div>

        {/* Finish Button */}
        {!gameOver && (
          <div className="mt-6 px-4">
            <button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-3 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              Encerrar Jogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FazendinhaDaCriacaoGame;