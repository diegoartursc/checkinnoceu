import React, { memo, useState, useMemo } from 'react';
import { Play, ArrowRight, Sun, CheckCircle, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getDailyContent } from '../../utils/contentGenerator';

const CheckInScreen = memo(({ currentDay, onCompleteDay, isCompletedToday }) => {
  const [step, setStep] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState(null);

  const dailyData = useMemo(() => getDailyContent(currentDay), [currentDay]);

  if (isCompletedToday) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in z-20 relative">
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-b from-green-300 to-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.6)] border-4 border-green-600 animate-bounce">
          <CheckCircle size={64} className="text-white sm:w-20 sm:h-20" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-md">Dia Completado!</h2>
        <p className="text-white/90 text-base sm:text-lg mb-8">Volte amanhã para mais luz!</p>
        <div className="bg-gradient-to-br from-white/30 to-white/10 p-4 rounded-2xl backdrop-blur-md border-2 border-white/40 text-white shadow-xl">
          <p className="text-sm font-bold opacity-75 uppercase">Tesouro de hoje:</p>
          <p className="italic font-serif text-base sm:text-lg mt-2">"{dailyData.verse}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 pt-8 sm:pt-10 overflow-y-auto relative z-20 custom-scrollbar">
      <div className="w-full h-3 bg-black/10 rounded-full mb-4 sm:mb-6 overflow-hidden border border-white/20">
        <div
          className="h-full bg-yellow-400 transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in slide-in-from-right">
          <div className="bg-white/90 p-6 rounded-full shadow-2xl ring-4 ring-white/30">
            <Sun size={56} className="text-yellow-500 fill-yellow-500 animate-spin-slow sm:w-16 sm:h-16" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg font-[nunito]">
            Jornada<br/>do Dia {currentDay}
          </h1>
          <Button onClick={() => setStep(1)} className="w-full text-lg sm:text-xl bg-gradient-to-b from-orange-400 to-orange-600 border-orange-700 shadow-[0_8px_30px_rgba(251,146,60,0.4)]">
            Começar <Play fill="white" size={20}/>
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-right">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-center border-b-8 border-gray-200 relative mb-8">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
              Mensagem
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-700 leading-relaxed mb-4">
              "{dailyData.message}"
            </p>
          </div>
          <Button onClick={() => setStep(2)} className="w-full bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_8px_30px_rgba(34,197,94,0.4)]">
            Próximo <ArrowRight />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right space-y-4">
           <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl mb-4 text-center">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Desafio</span>
             <p className="text-lg sm:text-xl font-bold text-gray-700 mt-2">{dailyData.quiz.question}</p>
           </div>
           <div className="space-y-3">
             {dailyData.quiz.options.map(opt => (
               <button
                 key={opt.id}
                 onClick={() => {
                   setQuizSelected(opt.id);
                   setIsQuizCorrect(opt.correct);
                 }}
                 className={`w-full p-3 sm:p-4 rounded-2xl font-bold text-left transition-all border-b-4 text-sm sm:text-base ${
                   quizSelected === opt.id
                     ? (opt.correct ? 'bg-gradient-to-b from-green-300 to-green-500 border-green-600 text-white shadow-[0_4px_20px_rgba(34,197,94,0.4)]' : 'bg-gradient-to-b from-red-300 to-red-500 border-red-600 text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)]')
                     : 'bg-gradient-to-b from-white to-gray-50 border-gray-300 text-gray-700 hover:from-gray-50 hover:to-gray-100 shadow-lg active:border-b-0 active:translate-y-1'
                 }`}
               >
                 <div className="flex items-center justify-between">
                   <span>{opt.text}</span>
                   {quizSelected === opt.id && (opt.correct ? <CheckCircle size={20} /> : <X size={20} />)}
                 </div>
               </button>
             ))}
           </div>
           {quizSelected && (
             <div className="mt-4 animate-in fade-in">
               <Button
                 onClick={onCompleteDay}
                 className={`w-full ${isQuizCorrect ? "bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_8px_30px_rgba(34,197,94,0.4)]" : "bg-gradient-to-b from-gray-300 to-gray-500 border-gray-600"}`}
                 disabled={!isQuizCorrect}
               >
                 {isQuizCorrect ? "Finalizar" : "Tente de novo"}
               </Button>
             </div>
           )}
        </div>
      )}
    </div>
  );
});

CheckInScreen.displayName = 'CheckInScreen';

export default CheckInScreen;
