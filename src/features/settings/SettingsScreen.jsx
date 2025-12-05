import React, { memo, useState } from 'react';
import { Settings, Volume2, VolumeX, Bell, BellOff, HelpCircle, Mail, ChevronRight, Lock, User } from 'lucide-react';
import Button from '../../components/ui/Button';

const SettingsScreen = memo(() => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-y-auto pb-24">
      {/* Header Richer */}
      <div className="bg-white px-6 pt-12 pb-8 shadow-sm rounded-b-3xl mb-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-600 shadow-inner">
               <Settings size={28} strokeWidth={2.5} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-800 leading-tight">Ajustes</h1>
               <p className="text-sm text-slate-500 font-medium">Configure seu app</p>
            </div>
         </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Support Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
             <HelpCircle size={18} className="text-blue-500" />
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Suporte</h2>
          </div>

          <div className="grid gap-3">
            <Button
                variant="primary"
                size="lg"
                className="w-full justify-between group"
                onClick={() => {}}
            >
                <span className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-white/80" />
                    <span>Central de Ajuda</span>
                </span>
                <ChevronRight size={20} className="text-white/60 group-active:translate-x-1 transition-transform" />
            </Button>

            <Button
                variant="success"
                size="lg"
                className="w-full justify-between group"
                onClick={() => {}}
            >
                <span className="flex items-center gap-3">
                    <Mail size={20} className="text-white/80" />
                    <span>Fale Conosco</span>
                </span>
                <ChevronRight size={20} className="text-white/60 group-active:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* App Settings Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
             <Settings size={18} className="text-orange-500" />
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Preferências</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sound Toggle */}
            <div className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSoundEnabled(!soundEnabled)}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${soundEnabled ? 'bg-indigo-100 text-indigo-600 shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                {soundEnabled ? <Volume2 size={24} strokeWidth={2.5} /> : <VolumeX size={24} strokeWidth={2.5} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700 text-lg">Efeitos Sonoros</h3>
                <p className="text-xs text-slate-500 font-medium">Sons e música</p>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all relative shadow-inner ${soundEnabled ? 'bg-green-500' : 'bg-slate-200'}`}>
                <div className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all ${soundEnabled ? 'left-7' : 'left-1'}`}></div>
              </div>
            </div>

            <div className="h-px bg-gray-100 mx-5"></div>

            {/* Notifications Toggle */}
            <div className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${notificationsEnabled ? 'bg-amber-100 text-amber-600 shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                {notificationsEnabled ? <Bell size={24} strokeWidth={2.5} /> : <BellOff size={24} strokeWidth={2.5} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700 text-lg">Notificações</h3>
                <p className="text-xs text-slate-500 font-medium">Lembretes diários</p>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all relative shadow-inner ${notificationsEnabled ? 'bg-green-500' : 'bg-slate-200'}`}>
                <div className={`w-6 h-6 bg-white rounded-full shadow-md absolute top-1 transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Section (Placeholder for future features) */}
        <section>
             <div className="flex items-center gap-2 mb-4 px-1">
                 <User size={18} className="text-purple-500" />
                 <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider">Conta</h2>
             </div>
             <div className="bg-white rounded-3xl p-6 border border-gray-100 text-center opacity-70">
                 <Lock size={32} className="mx-auto text-slate-300 mb-2" />
                 <p className="text-sm font-bold text-slate-500">Conta dos Pais</p>
                 <p className="text-xs text-slate-400 mt-1">Em breve você poderá acompanhar o progresso!</p>
             </div>
        </section>

        {/* Version Info */}
        <div className="text-center py-8">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Versão 1.0.2</p>
          <p className="text-[10px] text-slate-300 mt-2 font-medium">Feito com muito ❤️ para Deus</p>
        </div>
      </div>
    </div>
  );
});

SettingsScreen.displayName = 'SettingsScreen';

export default SettingsScreen;
