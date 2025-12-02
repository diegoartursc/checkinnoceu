import React, { useMemo, memo } from 'react';
import { X } from 'lucide-react';
import { GAME_TYPES } from '../../constants/gameTypes';
import {
  MemoryGame,
  CatcherGame,
  QuizGame,
  HarvestGame,
  WarmupGame,
  SequenceGame,
  RevealGame
} from '../games';

/**
 * Game Overlay - Displays a game modal
 */
const GameOverlay = memo(({ config, onClose, onWin }) => {
  const GameComponent = useMemo(() => {
    switch(config.gameType) {
      case GAME_TYPES.MEMORY: return MemoryGame;
      case GAME_TYPES.CATCHER: return CatcherGame;
      case GAME_TYPES.QUIZ: return QuizGame;
      case GAME_TYPES.HARVEST: return HarvestGame;
      case GAME_TYPES.WARMUP: return WarmupGame;
      case GAME_TYPES.SEQUENCE: return SequenceGame;
      case GAME_TYPES.REVEAL: return RevealGame;
      default: return null;
    }
  }, [config.gameType]);

  return (
    <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 ${config.bg} flex justify-between items-center`}>
          <h3 className={`font-black text-lg sm:text-xl uppercase ${config.color}`}>
            {config.gameData.title}
          </h3>
          <button
            onClick={onClose}
            className="bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors"
          >
            <X size={20} className="text-gray-600"/>
          </button>
        </div>
        <div className="p-2 sm:p-4 h-80 sm:h-96 relative bg-slate-50 overflow-hidden">
           {GameComponent && <GameComponent data={config.gameData} onWin={onWin} />}
        </div>
      </div>
    </div>
  );
});

GameOverlay.displayName = 'GameOverlay';

export default GameOverlay;
