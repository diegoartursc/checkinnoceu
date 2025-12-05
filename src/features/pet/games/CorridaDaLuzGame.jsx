import React, { useState, useEffect, useCallback, useRef } from 'react';

const CorridaDaLuzGame = ({ onFinish }) => {
  const [playerPosition, setPlayerPosition] = useState(1); // 0, 1, 2 (3 lanes)
  const [obstacles, setObstacles] = useState([]);
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const gameLoopRef = useRef();
  const obstacleIdRef = useRef(0);
  const starIdRef = useRef(0);
  
  // Game constants
  const LANE_COUNT = 3;
  const GAME_SPEED = 2; // pixels per frame
  const OBSTACLE_SPAWN_RATE = 0.02; // chance per frame
  const STAR_SPAWN_RATE = 0.015; // chance per frame

  // Move player to different lane
  const movePlayer = useCallback((direction) => {
    if (gameOver || !gameStarted) return;
    
    setPlayerPosition(prev => {
      let newPos = prev;
      if (direction === 'left' && prev > 0) {
        newPos = prev - 1;
      } else if (direction === 'right' && prev < LANE_COUNT - 1) {
        newPos = prev + 1;
      }
      return newPos;
    });
  }, [gameOver, gameStarted]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movePlayer('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movePlayer('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      // Move obstacles and stars
      setObstacles(prev => 
        prev
          .map(obs => ({ ...obs, x: obs.x - GAME_SPEED }))
          .filter(obs => obs.x > -50) // Remove if off screen
      );

      setStars(prev => 
        prev
          .map(star => ({ ...star, x: star.x - GAME_SPEED }))
          .filter(star => star.x > -50) // Remove if off screen
      );

      // Spawn obstacles
      if (Math.random() < OBSTACLE_SPAWN_RATE) {
        const newObstacle = {
          id: obstacleIdRef.current++,
          lane: Math.floor(Math.random() * LANE_COUNT),
          x: 100, // Start from right side
        };
        setObstacles(prev => [...prev, newObstacle]);
      }

      // Spawn stars
      if (Math.random() < STAR_SPAWN_RATE) {
        const newStar = {
          id: starIdRef.current++,
          lane: Math.floor(Math.random() * LANE_COUNT),
          x: 100, // Start from right side
        };
        setStars(prev => [...prev, newStar]);
      }

      // Update distance and score
      setDistance(prev => prev + 1);
      setScore(prev => prev + 1);

      // Check collisions
      const playerX = 50; // Player is at 50% from left
      const playerY = playerPosition * 33 + 16; // Approximate Y position
      
      // Check obstacle collision
      const obstacleCollision = obstacles.some(obs => {
        const obsX = obs.x;
        const obsY = obs.lane * 33 + 16;
        
        // Simple collision detection
        const distance = Math.sqrt(
          Math.pow(playerX - obsX, 2) + Math.pow(playerY - obsY, 2)
        );
        
        return distance < 25; // Collision threshold
      });

      if (obstacleCollision) {
        setGameOver(true);
      }
    }, 50); // Update 20 times per second

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, playerPosition, obstacles]);

  // Check star collection
  useEffect(() => {
    const playerX = 50;
    const playerY = playerPosition * 33 + 16;
    
    const collectedStars = stars.filter(star => {
      const starX = star.x;
      const starY = star.lane * 33 + 16;
      
      const distance = Math.sqrt(
        Math.pow(playerX - starX, 2) + Math.pow(playerY - starY, 2)
      );
      
      return distance < 25; // Collection threshold
    });

    if (collectedStars.length > 0) {
      // Remove collected stars and add to score
      setStars(prev => prev.filter(star => 
        !collectedStars.some(collected => collected.id === star.id)
      ));
      
      setScore(prev => prev + collectedStars.length * 10); // 10 points per star
    }
  }, [stars, playerPosition]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setObstacles([]);
    setStars([]);
    setScore(0);
    setDistance(0);
    setPlayerPosition(1);
    obstacleIdRef.current = 0;
    starIdRef.current = 0;
  };

  // Handle game finish
  const handleFinish = () => {
    onFinish(score);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* CAMADA 1: Fundo Estrelado Celestial */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-800 to-blue-600"></div>

      {/* Estrelas no fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 5}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-300">
            Corrida da Luz
          </h1>
          <p className="text-sm text-yellow-200 mt-1">
            Desvie de obstáculos e colete estrelas! ⚡
          </p>
        </div>

        {/* Score and Distance */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/30">
            <p className="text-sm font-bold text-yellow-300">Distância: {Math.floor(distance / 10)}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/30">
            <p className="text-sm font-bold text-yellow-300">Estrelas: {score}</p>
          </div>
        </div>

        {/* Game Area */}
        {!gameStarted ? (
          // Start Screen
          <div className="flex flex-col items-center justify-center h-64 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h2 className="text-xl font-bold text-white mb-4">Pronto para Correr?</h2>
            <p className="text-white/80 text-center mb-6 px-4">
              Use as setas ou A/D para mudar de faixa!<br />
              Evite obstáculos e colete estrelas!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Iniciar Corrida
            </button>
          </div>
        ) : gameOver ? (
          // Game Over Screen
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full relative">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Corrida Encerrada!
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Você percorreu <span className="font-bold text-purple-600">{Math.floor(distance / 10)}</span> metros!
              </p>
              <p className="text-lg text-gray-600 mb-2">
                Coletou <span className="font-bold text-yellow-600">{score}</span> estrelas!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Que corrida celestiais!
              </p>
              <button
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Finalizar Jogo
              </button>
            </div>
          </div>
        ) : (
          // Game Screen
          <div className="relative h-64 bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl overflow-hidden border-4 border-white/30">
            {/* Road lanes */}
            <div className="absolute inset-0 flex">
              {[0, 1, 2].map(lane => (
                <div
                  key={lane}
                  className="border-r border-dashed border-white/50 last:border-r-0"
                  style={{ width: '33.33%' }}
                />
              ))}
            </div>

            {/* Moving road effect */}
            <div className="absolute inset-0 bg-repeat-y opacity-30" 
                 style={{ 
                   backgroundImage: 'linear-gradient(transparent 50%, white 50%)',
                   backgroundSize: '100% 20px',
                   animation: 'roadMove 0.5s linear infinite'
                 }}></div>

            {/* Player */}
            <div
              className="absolute w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-200"
              style={{
                left: '50px',
                top: `${playerPosition * 33 + 10}%`,
                transform: 'translateY(-50%)'
              }}
            >
              <span className="text-2xl">🏃‍♂️</span>
            </div>

            {/* Obstacles */}
            {obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                className="absolute w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-red-300"
                style={{
                  right: `${100 - obstacle.x}%`,
                  top: `${obstacle.lane * 33 + 10}%`,
                  transform: 'translateY(-50%)'
                }}
              >
                <span className="text-lg">🪨</span>
              </div>
            ))}

            {/* Stars */}
            {stars.map(star => (
              <div
                key={star.id}
                className="absolute w-8 h-8 text-yellow-300 flex items-center justify-center animate-pulse"
                style={{
                  right: `${100 - star.x}%`,
                  top: `${star.lane * 33 + 10}%`,
                  transform: 'translateY(-50%)'
                }}
              >
                ⭐
              </div>
            ))}

            {/* Controls hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white/80 text-sm">
                Use ← → ou A/D para mover
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mx-4 mt-6 shadow-sm border border-white/30">
          <p className="text-[10px] text-yellow-200 text-center font-medium leading-tight">
            💡 Evite as pedras 🪨 e colete as estrelas ⭐ para ganhar pontos!
          </p>
        </div>

        {/* Finish Button */}
        {gameStarted && !gameOver && (
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

      {/* CSS Animation for road */}
      <style jsx>{`
        @keyframes roadMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
      `}</style>
    </div>
  );
};

export default CorridaDaLuzGame;