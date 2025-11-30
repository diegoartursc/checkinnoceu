// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { Volume2, VolumeX, RefreshCw, Lock, ShieldCheck } from 'lucide-react';

const SettingsPage = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [parentGateOpen, setParentGateOpen] = useState(false);
    const [gateAnswer, setGateAnswer] = useState('');
    const [challenge, setChallenge] = useState({ q: '3 + 5 = ?', a: '8' });

    const handleReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleGateCheck = () => {
        if (gateAnswer === challenge.a) {
            setParentGateOpen(true);
        } else {
            alert('Resposta incorreta.');
            setGateAnswer('');
            // Generate new simple challenge
            const a = Math.floor(Math.random() * 10);
            const b = Math.floor(Math.random() * 10);
            setChallenge({ q: `${a} + ${b} = ?`, a: `${a + b}` });
        }
    };

    return (
        <div className="h-full bg-slate-50 p-6 pt-24 overflow-y-auto">
             <h1 className="text-3xl font-black text-slate-800 mb-8 text-center">Configurações</h1>

             <div className="space-y-6 max-w-sm mx-auto">
                 {/* Sound Toggle */}
                 <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-full ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                             {soundEnabled ? <Volume2 /> : <VolumeX />}
                         </div>
                         <span className="font-bold text-gray-700">Sons e Música</span>
                     </div>
                     <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                     >
                         <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${soundEnabled ? 'translate-x-6' : ''}`} />
                     </button>
                 </div>

                 {/* Parent Gate Area */}
                 <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-slate-200">
                     <div className="flex items-center gap-2 mb-4">
                         <ShieldCheck className="text-indigo-500" />
                         <h2 className="text-xl font-black text-slate-800">Área dos Pais</h2>
                     </div>

                     {!parentGateOpen ? (
                         <div className="space-y-4">
                             <p className="text-sm text-gray-600">Para acessar opções avançadas, resolva:</p>
                             <div className="bg-slate-100 p-3 rounded-xl text-center font-bold text-xl">
                                 {challenge.q}
                             </div>
                             <div className="flex gap-2">
                                 <input
                                    type="number"
                                    value={gateAnswer}
                                    onChange={(e) => setGateAnswer(e.target.value)}
                                    className="flex-1 p-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 outline-none text-center font-bold"
                                    placeholder="?"
                                 />
                                 <button
                                    onClick={handleGateCheck}
                                    className="bg-indigo-500 text-white p-3 rounded-xl font-bold"
                                 >
                                     <Lock size={20} />
                                 </button>
                             </div>
                         </div>
                     ) : (
                         <div className="space-y-4 animate-in fade-in">
                             <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                 <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                     <RefreshCw size={18} /> Resetar Progresso
                                 </h3>
                                 <p className="text-xs text-red-600 mb-4">
                                     Apaga todo o progresso, moedas e itens desbloqueados. Esta ação não pode ser desfeita.
                                 </p>
                                 {!showResetConfirm ? (
                                     <button
                                        onClick={() => setShowResetConfirm(true)}
                                        className="w-full bg-red-100 text-red-600 font-bold py-2 rounded-lg hover:bg-red-200 transition-colors"
                                     >
                                         Resetar Tudo
                                     </button>
                                 ) : (
                                     <div className="flex gap-2">
                                         <button
                                            onClick={() => setShowResetConfirm(false)}
                                            className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg"
                                         >
                                             Cancelar
                                         </button>
                                         <button
                                            onClick={handleReset}
                                            className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg"
                                         >
                                             Confirmar
                                         </button>
                                     </div>
                                 )}
                             </div>
                             <div className="text-center">
                                 <button
                                    onClick={() => {
                                        setParentGateOpen(false);
                                        setGateAnswer('');
                                    }}
                                    className="text-indigo-500 text-sm font-bold underline"
                                 >
                                     Bloquear novamente
                                 </button>
                             </div>
                         </div>
                     )}
                 </div>

                 {/* Credits / Info */}
                 <div className="text-center text-gray-400 text-xs mt-8">
                     <p>Versão 1.0.0</p>
                     <p>Feito com ❤️ para as crianças</p>
                 </div>
             </div>
        </div>
    );
};

export default SettingsPage;
