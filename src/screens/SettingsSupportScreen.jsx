import React, { useState, useEffect } from 'react';
import { Settings, Bell, MessageCircle, HelpCircle, Star, Send, Mail, Phone, Users, BookOpen, Shield, Volume2, Sun, Moon, Palette, Zap, Accessibility } from 'lucide-react';

const SettingsSupportScreen = () => {
  const [activeTab, setActiveTab] = useState('visual');
  const [toast, setToast] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
  });
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const [settings, setSettings] = useState({
    visual: {
      theme: 'dark',
      accentColor: 'indigo',
      brightness: 75,
      contrast: 50,
      particles: true,
      animations: true,
      colorblindMode: false,
      quality: 'high',
    },
    notifications: {
      events: true,
      rewards: true,
      energy: false,
      friends: true,
      achievements: true,
      tips: false,
      system: true,
      sound: true,
      alertVolume: 60,
    },
    feedback: {
      type: 'suggestion',
      rating: 4,
    },
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Erro ao carregar gameSettings', e);
      }
    }
  }, []);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
    return () => clearTimeout(t);
  }, [toast.visible]);

  const showToast = (title, message, type = 'success') => {
    setToast({ visible: true, title, message, type });
  };

  const handleSaveSettings = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    showToast('Configurações Salvas!', 'Suas preferências foram atualizadas.', 'success');
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      visual: {
        theme: 'dark',
        accentColor: 'indigo',
        brightness: 75,
        contrast: 50,
        particles: true,
        animations: true,
        colorblindMode: false,
        quality: 'high',
      },
      notifications: {
        events: true,
        rewards: true,
        energy: false,
        friends: true,
        achievements: true,
        tips: false,
        system: true,
        sound: true,
        alertVolume: 60,
      },
      feedback: {
        type: 'suggestion',
        rating: 4,
      },
    };
    setSettings(defaultSettings);
    if (typeof window === 'undefined') return;
    localStorage.setItem('gameSettings', JSON.stringify(defaultSettings));
    showToast('Configurações Restauradas!', 'As configurações padrão foram restauradas.', 'info');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) {
      showToast('Campos Obrigatórios', 'Preencha o assunto e a mensagem.', 'error');
      return;
    }

    const feedbackData = {
      type: settings.feedback.type,
      rating: settings.feedback.rating,
      subject: feedbackSubject,
      message: feedbackMessage,
      timestamp: new Date().toISOString(),
    };

    console.log('Feedback enviado', feedbackData);
    
    // Clear form
    setFeedbackSubject('');
    setFeedbackMessage('');
    
    showToast('Feedback Enviado!', 'Obrigado por ajudar a melhorar o jogo!', 'success');
  };

  const faqItems = [
    {
      question: "Como faço para completar o devocional diário?",
      answer: "Toque em 'HOJE' na navegação inferior e siga as etapas: Oração da Manhã, Agradecimentos e Boas Ações. Complete todas para ganhar recompensas!"
    },
    {
      question: "O que é o Caminho da Vida?",
      answer: "É a jornada anual onde você pode explorar os meses do ano, completar missões e desbloquear histórias especiais. Cada dia completado adiciona uma etapa ao seu caminho."
    },
    {
      question: "Como ganho moedas no jogo?",
      answer: "Você ganha moedas completando o devocional diário, jogando missões mensais, ajudando o personagem virtual e participando de atividades espirituais."
    },
    {
      question: "Como cuido do meu animal de estimação?",
      answer: "No menu 'LAR', você pode alimentar, brincar e cuidar do seu animalzinho. Complete atividades para ganhar moedas e itens para o cuidado."
    },
    {
      question: "O que são as missões especiais?",
      answer: "São atividades temáticas que aparecem em datas especiais ou eventos sazonais. Complete-as para ganhar recompensas exclusivas."
    }
  ];

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const ratingEmojis = ['🙁', '😞', '😐', '🙂', '😍'];

  return (
    <div className="h-full bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white overflow-y-auto">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-sm animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 
          toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          <div className="font-bold">{toast.title}</div>
          <div className="text-sm">{toast.message}</div>
        </div>
      )}

      <div className="p-4 pt-14 sm:pt-16 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Configurações & Suporte
            </h1>
            <p className="text-gray-400 mt-2">Personalize sua experiência e encontre ajuda</p>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              onClick={() => setActiveTab('visual')}
              className={`p-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'visual' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Palette size={16} />
                Visual
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('notifications')}
              className={`p-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Bell size={16} />
                Notificações
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('support')}
              className={`p-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'support' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                Suporte
              </div>
            </button>
          </div>

          {/* Visual Settings */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Palette className="text-indigo-400" />
                  Aparência
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Tema</label>
                    <select
                      value={settings.visual.theme}
                      onChange={(e) => updateSetting('visual', 'theme', e.target.value)}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">Cor de Destaque</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['indigo', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green'].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSetting('visual', 'accentColor', color)}
                          className={`h-10 rounded-lg border-2 transition-all ${
                            settings.visual.accentColor === color 
                              ? 'border-white scale-110' 
                              : 'border-gray-600 hover:border-gray-400'
                          } bg-${color}-500`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Brilho: {settings.visual.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.visual.brightness}
                      onChange={(e) => updateSetting('visual', 'brightness', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Contraste: {settings.visual.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.visual.contrast}
                      onChange={(e) => updateSetting('visual', 'contrast', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="text-indigo-400" />
                  Efeitos
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                    <input
                      type="checkbox"
                      checked={settings.visual.particles}
                      onChange={(e) => updateSetting('visual', 'particles', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-bold">Partículas Animadas</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                    <input
                      type="checkbox"
                      checked={settings.visual.animations}
                      onChange={(e) => updateSetting('visual', 'animations', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-bold">Animações</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                    <input
                      type="checkbox"
                      checked={settings.visual.colorblindMode}
                      onChange={(e) => updateSetting('visual', 'colorblindMode', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-bold">Modo para Daltônicos</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">Qualidade Visual</label>
                    <select
                      value={settings.visual.quality}
                      onChange={(e) => updateSetting('visual', 'quality', e.target.value)}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white"
                    >
                      <option value="low">Baixa (Desempenho)</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta (Qualidade)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Bell className="text-indigo-400" />
                  Tipos de Notificação
                </h3>
                
                <div className="space-y-3">
                  {[
                    { key: 'events', label: 'Eventos Especiais' },
                    { key: 'rewards', label: 'Recompensas' },
                    { key: 'energy', label: 'Energia' },
                    { key: 'friends', label: 'Amigos' },
                    { key: 'achievements', label: 'Conquistas' },
                    { key: 'tips', label: 'Dicas' },
                    { key: 'system', label: 'Sistema' }
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                      <input
                        type="checkbox"
                        checked={settings.notifications[item.key]}
                        onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="font-bold">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Volume2 className="text-indigo-400" />
                  Som & Víbora
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sound}
                      onChange={(e) => updateSetting('notifications', 'sound', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="font-bold">Notificações com Som</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Volume de Alerta: {settings.notifications.alertVolume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.notifications.alertVolume}
                      onChange={(e) => updateSetting('notifications', 'alertVolume', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support Section */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <HelpCircle className="text-indigo-400" />
                  Perguntas Frequentes
                </h3>
                
                <div className="space-y-3">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border border-gray-600 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full p-4 text-left font-bold bg-gray-700/30 hover:bg-gray-600/30 transition-colors flex justify-between items-center"
                      >
                        <span>{item.question}</span>
                        <div className={`transform transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {openFaqIndex === index && (
                        <div className="p-4 bg-gray-800/20 border-t border-gray-600">
                          <p className="text-gray-300">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="text-indigo-400" />
                  Feedback
                </h3>
                
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Tipo de Feedback</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'suggestion', label: 'Sugestão' },
                        { value: 'bug', label: 'Bug' },
                        { value: 'other', label: 'Outro' }
                      ].map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateSetting('feedback', 'type', type.value)}
                          className={`p-2 rounded-lg border transition-colors ${
                            settings.feedback.type === type.value
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-gray-600/30'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">Classificação</label>
                    <div className="flex justify-center gap-2">
                      {ratingEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => updateSetting('feedback', 'rating', index + 1)}
                          className={`text-3xl p-2 rounded-lg transition-transform ${
                            settings.feedback.rating === index + 1
                              ? 'bg-indigo-600 scale-110'
                              : 'hover:scale-110'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <div className="text-center text-sm text-gray-400 mt-1">
                      {settings.feedback.rating}/5
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">Assunto</label>
                    <input
                      type="text"
                      value={feedbackSubject}
                      onChange={(e) => setFeedbackSubject(e.target.value)}
                      placeholder="Descreva o assunto do seu feedback..."
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">Mensagem</label>
                    <textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Descreva seu feedback ou problema em detalhes..."
                      rows="4"
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send size={18} className="inline mr-2" />
                    Enviar Feedback
                  </button>
                </form>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield className="text-indigo-400" />
                  Contato de Suporte
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="p-4 bg-gray-700/30 rounded-xl border border-gray-600 hover:bg-gray-600/30 transition-colors flex items-center gap-3">
                    <Mail className="text-indigo-400" />
                    <div className="text-left">
                      <div className="font-bold">E-mail</div>
                      <div className="text-sm text-gray-400">suporte@checkinnoceu.com</div>
                    </div>
                  </button>
                  
                  <button className="p-4 bg-gray-700/30 rounded-xl border border-gray-600 hover:bg-gray-600/30 transition-colors flex items-center gap-3">
                    <Phone className="text-indigo-400" />
                    <div className="text-left">
                      <div className="font-bold">Telefone</div>
                      <div className="text-sm text-gray-400">+55 (11) 99999-9999</div>
                    </div>
                  </button>
                  
                  <button className="p-4 bg-gray-700/30 rounded-xl border border-gray-600 hover:bg-gray-600/30 transition-colors flex items-center gap-3">
                    <Users className="text-indigo-400" />
                    <div className="text-left">
                      <div className="font-bold">Comunidade</div>
                      <div className="text-sm text-gray-400">Grupo no WhatsApp</div>
                    </div>
                  </button>
                  
                  <button className="p-4 bg-gray-700/30 rounded-xl border border-gray-600 hover:bg-gray-600/30 transition-colors flex items-center gap-3">
                    <BookOpen className="text-indigo-400" />
                    <div className="text-left">
                      <div className="font-bold">Documentação</div>
                      <div className="text-sm text-gray-400">Central de Ajuda</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={handleResetSettings}
              className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl font-bold text-white transition-colors border border-gray-600"
            >
              Restaurar Padrões
            </button>
            <button
              onClick={handleSaveSettings}
              className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-bold text-white transition-all shadow-lg"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSupportScreen;