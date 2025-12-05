import React, { memo, useState } from 'react';
import { Settings, Volume2, VolumeX, Bell, BellOff, HelpCircle, Mail, ChevronRight } from 'lucide-react';

const SettingsScreen = memo(() => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <Settings size={20} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Ajustes</h1>
        </div>
        <p className="text-sm text-slate-500">Configurações e Suporte</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Support Section */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suporte</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <HelpCircle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700">Central de Ajuda</h3>
                <p className="text-xs text-slate-500">Dúvidas frequentes e tutoriais</p>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
            <div className="h-px bg-gray-50 mx-4"></div>
            <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700">Fale Conosco</h3>
                <p className="text-xs text-slate-500">suporte@exemplo.com</p>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
          </div>
        </section>

        {/* App Settings Section */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preferências</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sound Toggle */}
            <div className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${soundEnabled ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700">Efeitos Sonoros</h3>
                <p className="text-xs text-slate-500">Sons de interação e ambiente</p>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${soundEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${soundEnabled ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="h-px bg-gray-50 mx-4"></div>

            {/* Notifications Toggle */}
            <div className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${notificationsEnabled ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-700">Notificações</h3>
                <p className="text-xs text-slate-500">Lembretes diários</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${notificationsEnabled ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Version Info */}
        <div className="text-center py-6">
          <p className="text-xs text-slate-400 font-medium">Versão 1.0.2</p>
          <p className="text-[10px] text-slate-300 mt-1">Feito com ❤️ para as crianças</p>
        </div>
      </div>
    </div>
  );
});

SettingsScreen.displayName = 'SettingsScreen';

export default SettingsScreen;
