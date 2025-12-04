import React, { useState, useEffect, useCallback } from 'react';

const DocinhosDoCeuGame = ({ onFinish }) => {
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20); // Limite de movimentos
  const [gameOver, setGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const candies = ['🍬', '🍭', '🎂', '🍪', '🍩', '🧁'];

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push(candies[Math.floor(Math.random() * candies.length)]);
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  }, [candies]);

  // Check for matches
  const findMatches = (boardToCheck) => {
    const matches = new Set();

    // Check horizontal matches
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          boardToCheck[i][j] &&
          boardToCheck[i][j] === boardToCheck[i][j + 1] &&
          boardToCheck[i][j] === boardToCheck[i][j + 2]
        ) {
          matches.add(`${i},${j}`);
          matches.add(`${i},${j + 1}`);
          matches.add(`${i},${j + 2}`);
          
          // Check for longer matches
          if (j + 3 < 5 && boardToCheck[i][j] === boardToCheck[i][j + 3]) {
            matches.add(`${i},${j + 3}`);
            
            if (j + 4 < 5 && boardToCheck[i][j] === boardToCheck[i][j + 4]) {
              matches.add(`${i},${j + 4}`);
            }
          }
        }
      }
    }

    // Check vertical matches
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < 3; i++) {
        if (
          boardToCheck[i][j] &&
          boardToCheck[i][j] === boardToCheck[i + 1][j] &&
          boardToCheck[i][j] === boardToCheck[i + 2][j]
        ) {
          matches.add(`${i},${j}`);
          matches.add(`${i + 1},${j}`);
          matches.add(`${i + 2},${j}`);
          
          // Check for longer matches
          if (i + 3 < 5 && boardToCheck[i][j] === boardToCheck[i + 3][j]) {
            matches.add(`${i + 3},${j}`);
            
            if (i + 4 < 5 && boardToCheck[i][j] === boardToCheck[i + 4][j]) {
              matches.add(`${i + 4},${j}`);
            }
          }
        }
      }
    }

    return Array.from(matches).map(match => {
      const [row, col] = match.split(',').map(Number);
      return { row, col };
    });
  };

  // Remove matches and drop candies
  const removeMatchesAndDrop = (currentBoard, matches) => {
    // Create a copy of the board
    const newBoard = currentBoard.map(row => [...row]);

    // Remove matched candies
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });

    // Drop candies down
    for (let j = 0; j < 5; j++) {
      let writeIndex = 4;
      for (let i = 4; i >= 0; i--) {
        if (newBoard[i][j] !== null) {
          newBoard[writeIndex][j] = newBoard[i][j];
          if (writeIndex !== i) {
            newBoard[i][j] = null;
          }
          writeIndex--;
        }
      }
    }

    // Fill empty spaces with new candies
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (newBoard[i][j] === null) {
          newBoard[i][j] = candies[Math.floor(Math.random() * candies.length)];
        }
      }
    }

    return newBoard;
  };

  // Process matches recursively
  const processMatches = useCallback((currentBoard, totalScore = 0) => {
    const matches = findMatches(currentBoard);
    
    if (matches.length === 0) {
      // No more matches, return current board and score
      setBoard(currentBoard);
      setScore(prev => prev + totalScore);
      setIsChecking(false);
      return;
    }

    // Calculate score for current matches
    const currentMatchScore = matches.length * 10;
    
    // Remove matches and drop candies
    const newBoard = removeMatchesAndDrop(currentBoard, matches);
    
    // Continue processing matches recursively
    setTimeout(() => {
      processMatches(newBoard, totalScore + currentMatchScore);
    }, 300);
  }, [findMatches, removeMatchesAndDrop, candies]);

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (isChecking || gameOver || moves <= 0) return;

    if (!selectedCell) {
      setSelectedCell({ row, col });
    } else {
      const { row: selectedRow, col: selectedCol } = selectedCell;
      
      // Check if cells are adjacent
      const isAdjacent = 
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row);

      if (isAdjacent) {
        // Swap candies
        const newBoard = board.map(r => [...r]);
        const temp = newBoard[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = newBoard[row][col];
        newBoard[row][col] = temp;

        // Check if swap creates a match
        const matchesAfterSwap = findMatches(newBoard);
        
        if (matchesAfterSwap.length > 0) {
          // Valid move - update board and process matches
          setBoard(newBoard);
          setMoves(prev => prev - 1);
          setSelectedCell(null);
          setIsChecking(true);
          processMatches(newBoard);
        } else {
          // Invalid move - revert swap
          setSelectedCell(null);
        }
      } else {
        // Select new cell
        setSelectedCell({ row, col });
      }
    }
  };

  // Check if game is over
  useEffect(() => {
    if (moves <= 0 && !isChecking) {
      setGameOver(true);
    }
  }, [moves, isChecking]);

  // Initialize board on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Handle game finish
  const handleFinish = () => {
    onFinish(score);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* CAMADA 1: Fundo Rosa Celestial */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-purple-100"></div>

      {/* CAMADA 2: Nuvens Sutis */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-[5%] text-pink-200/50 animate-pulse gpu-accelerate">
          <div className="text-4xl">☁️</div>
        </div>
        <div className="absolute top-12 right-[8%] text-purple-200/40 animate-pulse gpu-accelerate" style={{ animationDelay: '0.5s' }}>
          <div className="text-3xl">☁️</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-pink-800">
            Docinhos do Céu
          </h1>
          <p className="text-sm text-pink-600 mt-1">
            Combine 3 ou mais docinhos iguais! 🍬
          </p>
        </div>

        {/* Score and Moves */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-pink-100">
            <p className="text-sm font-bold text-pink-700">Pontos: {score}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-pink-100">
            <p className="text-sm font-bold text-pink-700">Movimentos: {moves}</p>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-pink-100 mx-auto max-w-xs">
          <div className="grid grid-cols-5 gap-2">
            {board.map((row, rowIndex) =>
              row.map((candy, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    aspect-square text-3xl rounded-lg shadow-sm border-2 transition-all
                    ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'border-yellow-400 bg-yellow-100 scale-110'
                      : 'border-pink-200 bg-white hover:scale-105'
                    }
                    active:scale-95
                  `}
                >
                  {candy}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full relative">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Parabéns!
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Você fez <span className="font-bold text-pink-600">{score}</span> pontos!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Docinhos celestiais deliciosos!
              </p>
              <button
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Finalizar Jogo
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 mx-4 mt-6 shadow-sm">
          <p className="text-[10px] text-pink-700 text-center font-medium leading-tight">
            💡 Toque em dois docinhos adjacentes para trocá-los e formar combinações!
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

export default DocinhosDoCeuGame;