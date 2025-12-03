import React, { memo, useState } from 'react';
import { Heart } from 'lucide-react';
import Button from '../../components/ui/Button';

// Momento de Gratidão
const GratitudeScreen = memo(({ onComplete }) => {
  const [selected, setSelected] = useState(null);
  const [customText, setCustomText] = useState('');

  const gratitudeOptions = [
    { id: 1, emoji: '👨‍👩‍👧‍👦', text: 'Minha Família' },
    { id: 2, emoji: '👫', text: 'Meus Amigos' },
    { id: 3, emoji: '🎮', text: 'Poder Brincar' },
    { id: 4, emoji: '❤️', text: 'Saúde' },
    { id: 5, emoji: '🏠', text: 'Minha Casa' },
    { id: 6, emoji: '🍎', text: 'Comida Gostosa' },
    { id: 7, emoji: '📚', text: 'Aprender' },
    { id: 8, emoji: '🌞', text: 'Dia Bonito' },
  ];

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleSubmit = () => {
    if (selected || customText) {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col p-6 relative overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-purple-50 to-blue-50" />

      <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full min-h-full">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <div className="text-5xl sm:text-6xl mb-3">🙏</div>
          <h1 className="text-2xl sm:text-3xl font-black text-purple-900 mb-2">
            Momento de Gratidão
          </h1>
          <p className="text-sm sm:text-base text-purple-700 font-medium">
            Pelo que você é grato hoje?
          </p>
        </div>

        {/* Grid de opções */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {gratitudeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                bg-white rounded-2xl p-3 sm:p-4 border-4 transition-all duration-200
                ${selected === option.id
                  ? 'border-purple-500 scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'border-purple-200 hover:border-purple-300 hover:scale-102'
                }
              `}
            >
              <div className="text-3xl sm:text-4xl mb-2">{option.emoji}</div>
              <div className="text-[10px] sm:text-xs font-bold text-gray-700 leading-tight">{option.text}</div>
            </button>
          ))}
        </div>

        {/* Ou escrever */}
        <div className="mb-6">
          <p className="text-center text-purple-700 font-bold mb-3">Ou escreva:</p>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Digite aqui..."
            className="w-full px-4 py-3 rounded-2xl border-4 border-purple-200 text-center font-medium focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Botão */}
        <Button
          variant="success"
          size="lg"
          onClick={handleSubmit}
          disabled={!selected && !customText}
          icon={Heart}
          className="w-full"
        >
          Continuar com Gratidão 💜
        </Button>
      </div>
    </div>
  );
});

GratitudeScreen.displayName = 'GratitudeScreen';

export default GratitudeScreen;
