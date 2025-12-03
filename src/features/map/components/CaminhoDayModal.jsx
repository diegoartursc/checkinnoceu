import React, { memo, useState } from 'react';
import { X, Heart, Star } from 'lucide-react';
import Button from '../../../components/ui/Button';

const CaminhoDayModal = memo(({ isOpen, onClose, dayNumber, monthLabel, devotionalData }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen || !devotionalData) return null;

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // Simple feedback logic - always positive for now
    setFeedback("Ótima escolha! Vamos guardar isso no coração 💛");
  };

  const handleClose = () => {
    // Reset state before closing
    setSelectedOption(null);
    setFeedback(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-sky-50 to-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl border-4 border-sky-200 animate-in zoom-in-95 duration-300">

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-sky-400 hover:text-sky-600 transition-colors bg-white rounded-full p-1 shadow-sm"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider mb-3">
            <Star size={12} fill="currentColor" />
            <span>Dia {dayNumber} • {monthLabel}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
            {devotionalData.title}
          </h2>
        </div>

        {/* Main Message */}
        <div className="bg-sky-50/50 rounded-2xl p-6 mb-6 border-2 border-sky-100/50">
          <p className="text-slate-600 text-lg text-center font-medium leading-relaxed">
            "{devotionalData.message}"
          </p>
        </div>

        {/* Question & Options */}
        <div className="space-y-4">
          <h3 className="text-center text-slate-700 font-bold text-lg">
            {devotionalData.question}
          </h3>

          <div className="grid gap-3">
            {!feedback ? (
              devotionalData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className="w-full bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-300 text-slate-600 font-bold py-4 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                 <div className="inline-block bg-green-100 p-3 rounded-full mb-3 text-green-500">
                    <Heart size={32} fill="currentColor" />
                 </div>
                 <p className="text-green-800 font-bold text-lg mb-4">
                   {feedback}
                 </p>
                 <Button onClick={handleClose} variant="primary" className="w-full">
                   Voltar ao Caminho
                 </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer decoration */}
        <div className="mt-8 text-center opacity-40">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Caminho da Luz</p>
        </div>

      </div>
    </div>
  );
});

CaminhoDayModal.displayName = 'CaminhoDayModal';

export default CaminhoDayModal;
