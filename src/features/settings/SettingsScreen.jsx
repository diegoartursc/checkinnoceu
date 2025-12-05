import React, { memo } from 'react';
import { User, Volume2, Bell, HelpCircle, Info, ChevronRight, RefreshCw } from 'lucide-react';

const SettingsScreen = memo(() => {
  const handleReset = () => {
    if (confirm('Tem certeza que deseja apagar todo o progresso? Essa ação não pode ser desfeita.')) {
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 pb-24">
      <div className="pt-16 px-6 pb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Configurações & Suporte</h1>

        {/* Section: Conta */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">Conta</h2>
          <div className="flex items-center gap-4 py-2">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
              <User size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-700">Viajante</p>
              <p className="text-xs text-slate-400">Perfil Local</p>
            </div>
          </div>
        </div>

        {/* Section: Preferências */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
           <h2 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">Preferências</h2>

           <div className="flex items-center justify-between py-3 border-b border-slate-50">
             <div className="flex items-center gap-3 text-slate-600">
               <Volume2 size={20} />
               <span className="font-medium">Sons e Música</span>
             </div>
             <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
             </div>
           </div>

           <div className="flex items-center justify-between py-3">
             <div className="flex items-center gap-3 text-slate-600">
               <Bell size={20} />
               <span className="font-medium">Notificações</span>
             </div>
             <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
             </div>
           </div>
        </div>

        {/* Section: Suporte */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
           <h2 className="text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">Suporte</h2>

           <button className="w-full flex items-center justify-between py-3 border-b border-slate-50 text-slate-600 hover:bg-slate-50 transition-colors rounded-lg px-2 -mx-2">
             <div className="flex items-center gap-3">
               <HelpCircle size={20} />
               <span className="font-medium">Fale Conosco</span>
             </div>
             <ChevronRight size={16} className="text-slate-300" />
           </button>

           <button className="w-full flex items-center justify-between py-3 text-slate-600 hover:bg-slate-50 transition-colors rounded-lg px-2 -mx-2">
             <div className="flex items-center gap-3">
               <Info size={20} />
               <span className="font-medium">Sobre o App</span>
             </div>
             <ChevronRight size={16} className="text-slate-300" />
           </button>
        </div>

         {/* Section: Debug / Danger Zone */}
         <div className="mt-8">
            <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
                <RefreshCw size={18} />
                Reiniciar Progresso
            </button>
            <p className="text-center text-[10px] text-slate-300 mt-4">Versão 1.0.0 (Build 2024)</p>
         </div>

      </div>
    </div>
  );
});

SettingsScreen.displayName = 'SettingsScreen';

export default SettingsScreen;
