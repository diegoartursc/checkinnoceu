import React, { useState, useCallback, memo } from 'react';

/**
 * Quiz Game - Multiple choice question
 */
const QuizGame = memo(({ data, onWin }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = useCallback((idx) => {
    setSelected(idx);
    if (idx === data.answer) setTimeout(onWin, 1000);
  }, [data.answer, onWin]);

  return (
    <div className="h-full flex flex-col justify-center p-4">
      <div className="bg-indigo-100 p-4 rounded-xl mb-6 text-center shadow-inner">
        <p className="text-base sm:text-lg font-bold text-indigo-800">{data.question}</p>
      </div>
      <div className="space-y-3">
        {data.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full p-3 sm:p-4 rounded-xl font-bold text-left text-sm sm:text-base transition-all border-b-4 ${
              selected === idx
                ? (idx === data.answer ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700')
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
});

QuizGame.displayName = 'QuizGame';

export default QuizGame;
