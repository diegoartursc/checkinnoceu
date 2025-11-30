import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback, memo } from 'react';
import {
  Play, Map, Home, Star, CheckCircle, ArrowRight, Smile,
  Sun, Cloud, X, ArrowUp, Gift, Heart, Music, Anchor,
  Book, Crown, Sprout, Flame, Zap, Shield, Trophy, Lock, BookOpen,
  Snowflake, Leaf, Flower, ThermometerSun, AlertCircle, Lightbulb,
  CloudRain, Hammer, Users, Wind, Cross, Clock, Gamepad2,
  Sparkles, PartyPopper, Repeat2
} from 'lucide-react';

/* ========================================
   CONSTANTS & CONFIGURATION
   ======================================== */

const GAME_TYPES = {
  MEMORY: 'memory',
  CATCHER: 'catcher',
  QUIZ: 'quiz',
  HARVEST: 'harvest',
  WARMUP: 'warmup',
  SEQUENCE: 'sequence',
  REVEAL: 'reveal'
};

// Optimized: Extracted to avoid recreation on every render
const MONTHS_CONFIG = [
  {
    name: 'Janeiro', days: 31, icon: Anchor, label: "O Início", color: "text-blue-500", bg: "bg-blue-100",
    desc: "A grande viagem da Arca!",
    specialDates: [
        { day: 6, label: "Dia de Reis", color: "shadow-[0_0_15px_#fbbf24] border-yellow-300 bg-yellow-100 text-yellow-700", icon: Star, message: "Os Reis Magos seguiram a estrela até encontrar o menino Jesus!" }
    ],
    story: {
        id: "jan_story", title: "A Arca de Noé", musicTheme: "Sons de Chuva e Violino",
        slides: [
            { text: "Noé era um homem bom. Deus pediu para ele construir um barco gigante!", icon: Hammer },
            { text: "A chuva caiu forte por 40 dias, mas a arca flutuava segura.", icon: CloudRain },
            { text: "Lição: Deus é nosso abrigo seguro se confiarmos Nele.", icon: Anchor }
        ]
    },
    gameType: GAME_TYPES.MEMORY,
    gameData: { title: "Pares da Arca", items: ["🦁", "🦁", "🐘", "🐘", "🦒", "🦒", "🕊️", "🕊️"] },
    extraGame: {
        title: "Pesca Maravilhosa", gameType: GAME_TYPES.CATCHER, bg: "bg-sky-100", color: "text-sky-600",
        gameData: { title: "Pegue os Peixes", target: "🐟", avoid: "🥾" }
    }
  },
  {
    name: 'Fevereiro', days: 28, icon: Sprout, label: "Crescimento", color: "text-green-500", bg: "bg-green-100",
    desc: "Semeando o bem.",
    specialDates: [],
    story: {
        id: "feb_story", title: "A Semente da Mostarda", musicTheme: "Piano Suave",
        slides: [
            { text: "Jesus mostrou uma sementinha minúscula de mostarda.", icon: Sprout },
            { text: "Ao ser plantada, ela vira uma árvore gigante!", icon: ArrowUp },
            { text: "Lição: Sua fé pode começar pequena e se tornar gigante.", icon: Heart }
        ]
    },
    gameType: GAME_TYPES.CATCHER,
    gameData: { title: "Chuva de Sementes", target: "🌱", avoid: "🪨" },
    extraGame: {
        title: "Jesus no Templo", gameType: GAME_TYPES.QUIZ, bg: "bg-emerald-100", color: "text-emerald-600",
        gameData: { title: "Mestre Jesus", question: "Onde Jesus foi encontrado ensinando?", options: ["No Templo", "Na Praia", "Em Casa"], answer: 0 }
    }
  },
  {
    name: 'Março', days: 31, icon: Book, label: "Sabedoria", color: "text-indigo-500", bg: "bg-indigo-100",
    desc: "Aprenda com Salomão.",
    specialDates: [],
    story: {
        id: "mar_story", title: "O Rei Sábio", musicTheme: "Harpa Real",
        slides: [
            { text: "Salomão podia pedir ouro, mas pediu SABEDORIA.", icon: Lightbulb },
            { text: "Deus ficou tão feliz que deu sabedoria E riquezas.", icon: Crown },
            { text: "Lição: Ser sábio vale mais do que tesouros.", icon: Book }
        ]
    },
    gameType: GAME_TYPES.QUIZ,
    gameData: { title: "Quiz Sábio", question: "Quem foi o rei mais sábio?", options: ["Davi", "Salomão", "Saul"], answer: 1 },
    extraGame: {
        title: "Rainha Ester", gameType: GAME_TYPES.REVEAL, bg: "bg-purple-100", color: "text-purple-600",
        gameData: { title: "Coragem de Ester", icon: "👑" }
    },
    seasonEvent: {
        id: "autumn_season", name: "Chegada do Outono", icon: Leaf, color: "text-orange-900", bg: "bg-orange-100", desc: "Colha os frutos bons!",
        gameType: GAME_TYPES.HARVEST, gameData: { title: "Grande Colheita", target: "🍎", bad: "🐛" },
        story: { id: "autumn_tale", title: "Tempo de Colheita", musicTheme: "Violão", slides: [{text: "Há tempo de plantar e colher.", icon: Leaf}] }
    }
  },
  {
    name: 'Abril', days: 30, icon: Heart, label: "Páscoa", color: "text-red-500", bg: "bg-red-100",
    desc: "O amor vivo!",
    specialDates: [
        { day: 9, label: "Páscoa", color: "shadow-[0_0_20px_#e9d5ff] border-purple-200 bg-white text-purple-600 animate-pulse", icon: Cross, message: "A vida venceu! O túmulo está vazio e Jesus está vivo!" }
    ],
    story: {
        id: "apr_story", title: "Ele Vive!", musicTheme: "Orquestra Triunfante",
        slides: [
            { text: "Jesus se entregou por amor a nós.", icon: Cloud },
            { text: "Mas no terceiro dia... A pedra rolou! Ele vive!", icon: Sun },
            { text: "Lição: Porque Ele vive, temos esperança.", icon: Heart }
        ]
    },
    gameType: GAME_TYPES.CATCHER,
    gameData: { title: "Colheita de Amor", target: "❤️", avoid: "🌵" },
    extraGame: {
        title: "Santa Ceia", gameType: GAME_TYPES.MEMORY, bg: "bg-red-50", color: "text-red-700",
        gameData: { title: "Pão e Vinho", items: ["🍷", "🍷", "🍞", "🍞", "🍇", "🍇", "🥖", "🥖"] }
    }
  },
  {
    name: 'Maio', days: 31, icon: Smile, label: "Família", color: "text-pink-500", bg: "bg-pink-100",
    desc: "Honra teu lar.",
    specialDates: [
        { day: 28, label: "Pentecostes", color: "shadow-[0_0_20px_#ef4444] border-red-400 bg-orange-500 text-white animate-pulse", icon: Flame, message: "O Espírito Santo desceu como línguas de fogo para nos encher de coragem!" }
    ],
    story: {
        id: "may_story", title: "Honrar Pai e Mãe", musicTheme: "Canção de Ninar",
        slides: [
            { text: "Deus disse: 'Honra teu pai e tua mãe'.", icon: BookOpen },
            { text: "Isso significa cuidar e obedecer com carinho.", icon: Users },
            { text: "Lição: Obedecer traz alegria e benção.", icon: Smile }
        ]
    },
    gameType: GAME_TYPES.MEMORY,
    gameData: { title: "Memória da Família", items: ["👨‍👩‍👧", "👨‍👩‍👧", "🏠", "🏠", "🐕", "🐕", "👵", "👵"] },
    extraGame: {
        title: "O Bebê de Ana", gameType: GAME_TYPES.WARMUP, bg: "bg-pink-200", color: "text-pink-700",
        gameData: { title: "Cuidar do Bebê", icon: "👶" }
    }
  },
  {
    name: 'Junho', days: 30, icon: Flame, label: "Coragem", color: "text-orange-500", bg: "bg-orange-100",
    desc: "Daniel e os Leões.",
    specialDates: [],
    story: {
        id: "jun_story", title: "Na Cova dos Leões", musicTheme: "Tambores",
        slides: [
            { text: "Jogaram Daniel numa cova de leões!", icon: AlertCircle },
            { text: "Deus enviou um anjo que FECHOU a boca deles.", icon: Shield },
            { text: "Lição: Deus protege quem é fiel a Ele.", icon: Flame }
        ]
    },
    gameType: GAME_TYPES.QUIZ,
    gameData: { title: "Teste de Coragem", question: "Onde Daniel foi jogado?", options: ["No fogo", "Nos leões", "No mar"], answer: 1 },
    extraGame: {
        title: "Força de Sansão", gameType: GAME_TYPES.HARVEST, bg: "bg-orange-200", color: "text-orange-800",
        gameData: { title: "Derrube os Pilares", target: "🏛️", bad: "🐍" }
    },
    seasonEvent: {
        id: "winter_season", name: "Chegada do Inverno", icon: Snowflake, color: "text-sky-700", bg: "bg-sky-100", desc: "Não deixe o fogo apagar!",
        gameType: GAME_TYPES.WARMUP, gameData: { title: "Mantenha o Calor", icon: "🔥" },
        story: { id: "winter_tale", title: "O Calor do Amor", musicTheme: "Vento", slides: [{text: "O amor de Deus aquece no frio.", icon: Heart}] }
    }
  },
  {
    name: 'Julho', days: 31, icon: Sun, label: "Férias", color: "text-yellow-500", bg: "bg-yellow-100",
    desc: "Luz do Mundo.",
    specialDates: [],
    story: {
        id: "jul_story", title: "Sermão da Montanha", musicTheme: "Flauta",
        slides: [
            { text: "Jesus ensinou: 'Vocês são a luz do mundo!'.", icon: Sun },
            { text: "A luz serve para iluminar a casa toda.", icon: Lightbulb },
            { text: "Lição: Não esconda seu brilho, ilumine alguém hoje.", icon: Star }
        ]
    },
    gameType: GAME_TYPES.CATCHER,
    gameData: { title: "Pegue a Luz", target: "☀️", avoid: "☁️" },
    extraGame: {
        title: "Elias e os Corvos", gameType: GAME_TYPES.CATCHER, bg: "bg-yellow-50", color: "text-yellow-800",
        gameData: { title: "Pão do Céu", target: "🍞", avoid: "🦅" }
    }
  },
  {
    name: 'Agosto', days: 31, icon: Crown, label: "Reis", color: "text-purple-500", bg: "bg-purple-100",
    desc: "Davi e Golias.",
    specialDates: [],
    story: {
        id: "aug_story", title: "O Pequeno Gigante", musicTheme: "Trombetas",
        slides: [
            { text: "O gigante Golias assustava todo mundo.", icon: AlertCircle },
            { text: "Davi usou fé e uma pedrinha! VRUM! O gigante caiu!", icon: Trophy },
            { text: "Lição: Com Deus, você vence qualquer gigante.", icon: Crown }
        ]
    },
    gameType: GAME_TYPES.QUIZ,
    gameData: { title: "Davi vs Golias", question: "O que Davi usou?", options: ["Espada", "Pedra", "Lança"], answer: 1 },
    extraGame: {
        title: "Filho Pródigo", gameType: GAME_TYPES.REVEAL, bg: "bg-purple-200", color: "text-purple-800",
        gameData: { title: "Volta pra Casa", icon: "🏡" }
    }
  },
  {
    name: 'Setembro', days: 30, icon: Music, label: "Louvor", color: "text-teal-500", bg: "bg-teal-100",
    desc: "Cante ao Senhor.",
    specialDates: [],
    story: {
        id: "sep_story", title: "Muralhas de Jericó", musicTheme: "Coral",
        slides: [
            { text: "Deus disse para tocarem trombetas.", icon: Music },
            { text: "Eles gritaram e as muralhas caíram!", icon: Zap },
            { text: "Lição: O louvor tem poder!", icon: Music }
        ]
    },
    gameType: GAME_TYPES.MEMORY,
    gameData: { title: "Sons do Céu", items: ["🎺", "🎺", "🎸", "🎸", "🥁", "🥁", "🎵", "🎵"] },
    extraGame: {
        title: "Pequeno Zaqueu", gameType: GAME_TYPES.CATCHER, bg: "bg-teal-50", color: "text-teal-700",
        gameData: { title: "Suba na Árvore", target: "🌳", avoid: "💰" }
    },
    seasonEvent: {
        id: "spring_season", name: "Chegada da Primavera", icon: Flower, color: "text-pink-600", bg: "bg-pink-100", desc: "Repita a canção!",
        gameType: GAME_TYPES.SEQUENCE, gameData: { title: "Jardim Cantante", items: ["🌸", "🌹", "🌻", "🌷"] },
        story: { id: "spring_tale", title: "A Criação Renasce", musicTheme: "Pássaros", slides: [{text: "Tudo floresce com Deus.", icon: Flower}] }
    }
  },
  {
    name: 'Outubro', days: 31, icon: Gift, label: "Crianças", color: "text-cyan-500", bg: "bg-cyan-100",
    desc: "Pequeninos.",
    specialDates: [],
    story: {
        id: "oct_story", title: "Jesus e as Crianças", musicTheme: "Risadas",
        slides: [
            { text: "Os adultos tentaram impedir as crianças.", icon: Users },
            { text: "Jesus disse: 'Deixem vir a mim as crianças!'.", icon: Heart },
            { text: "Lição: O Reino do Céu é das crianças.", icon: Star }
        ]
    },
    gameType: GAME_TYPES.CATCHER,
    gameData: { title: "Chuva de Presentes", target: "🎁", avoid: "🕷️" },
    extraGame: {
        title: "Fala Senhor!", gameType: GAME_TYPES.SEQUENCE, bg: "bg-cyan-200", color: "text-cyan-800",
        gameData: { title: "Ouça a Voz", items: ["👂", "🙏", "🕯️", "💤"] }
    }
  },
  {
    name: 'Novembro', days: 30, icon: Shield, label: "Gratidão", color: "text-amber-600", bg: "bg-amber-100",
    desc: "Agradeça sempre.",
    specialDates: [
        { day: 1, label: "Todos os Santos", color: "shadow-[0_0_15px_#60a5fa] border-blue-300 bg-blue-100 text-blue-700", icon: Users, message: "Lembramos de todos os amigos de Deus que já estão brilhando no céu!" }
    ],
    story: {
        id: "nov_story", title: "Os Dez Leprosos", musicTheme: "Hino",
        slides: [
            { text: "Jesus curou dez homens doentes.", icon: Star },
            { text: "Só UM voltou para dizer 'Obrigado'.", icon: AlertCircle },
            { text: "Lição: Não se esqueça de agradecer.", icon: CheckCircle }
        ]
    },
    gameType: GAME_TYPES.QUIZ,
    gameData: { title: "Gratidão", question: "Quantos leprosos voltaram?", options: ["10", "1", "5"], answer: 1 },
    extraGame: {
        title: "Vem para Fora!", gameType: GAME_TYPES.REVEAL, bg: "bg-amber-200", color: "text-amber-800",
        gameData: { title: "Lázaro Vive", icon: "🤕" }
    }
  },
  {
    name: 'Dezembro', days: 31, icon: Star, label: "Natal", color: "text-yellow-400", bg: "bg-yellow-100",
    desc: "Nasceu Jesus!",
    specialDates: [
        { day: 25, label: "NATAL", color: "shadow-[0_0_30px_#facc15] border-yellow-300 bg-yellow-100 text-yellow-800 animate-bounce", icon: Star, message: "Nasceu o Salvador! Hoje é dia de alegria para todo o mundo!" }
    ],
    story: {
        id: "dec_story", title: "Noite Feliz", musicTheme: "Noite Feliz",
        slides: [
            { text: "Jesus nasceu num lugar simples.", icon: Home },
            { text: "Uma estrela guiou reis até o bebê.", icon: Star },
            { text: "Lição: O maior presente é Jesus.", icon: Gift }
        ]
    },
    gameType: GAME_TYPES.MEMORY,
    gameData: { title: "Noite de Natal", items: ["👶", "👶", "⭐", "⭐", "🐪", "🐪", "🎁", "🎁"] },
    extraGame: {
        title: "Fuga Segura", gameType: GAME_TYPES.CATCHER, bg: "bg-yellow-200", color: "text-yellow-800",
        gameData: { title: "Proteja o Bebê", target: "🐪", avoid: "⚔️" }
    },
    seasonEvent: {
        id: "summer_season", name: "Chegada do Verão", icon: ThermometerSun, color: "text-amber-600", bg: "bg-amber-100", desc: "Limpe as nuvens!",
        gameType: GAME_TYPES.REVEAL, gameData: { title: "Céu Limpo", icon: "☀️" },
        story: { id: "summer_tale", title: "A Luz do Mundo", musicTheme: "Sol", slides: [{text: "Jesus é a luz que afasta o medo.", icon: Sun}] }
    }
  }
];

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const getDailyContent = (dayNumber) => {
  return {
    day: dayNumber,
    message: "Jesus te ama e cuida de você em todos os momentos.",
    verse: "João 3:16",
    quiz: {
      question: "O que devemos fazer todos os dias?",
      options: [
        { id: 'a', text: "Reclamar", correct: false },
        { id: 'b', text: "Agradecer e Orar", correct: true },
        { id: 'c', text: "Ficar bravo", correct: false }
      ]
    }
  };
};

/* ========================================
   BASIC UI COMPONENTS (Memoized)
   ======================================== */

const CloudBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[5%] left-[10%] text-white/40 animate-pulse delay-700 gpu-accelerate"><Cloud size={80} fill="currentColor" /></div>
    <div className="absolute top-[30%] right-[15%] text-white/30 animate-pulse delay-1000 gpu-accelerate"><Cloud size={60} fill="currentColor" /></div>
    <div className="absolute top-[60%] left-[5%] text-white/20 animate-pulse gpu-accelerate"><Cloud size={100} fill="currentColor" /></div>
    <div className="absolute bottom-[10%] right-[10%] text-white/10 gpu-accelerate"><Cloud size={120} fill="currentColor" /></div>
  </div>
));

CloudBackground.displayName = 'CloudBackground';

const Button = memo(({ children, onClick, color = "bg-gradient-to-b from-blue-400 to-blue-600", className = "", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} ${className} text-white font-black py-4 px-8 rounded-3xl border-b-6 border-opacity-50 shadow-xl active:border-b-0 active:translate-y-2 transition-all transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
  >
    {children}
  </button>
));

Button.displayName = 'Button';

const SeasonButton = memo(({ season, onClick }) => {
    const { buttonStyle, decor } = useMemo(() => {
        let buttonStyle = "";
        let decor = null;

        if (season.id.includes("autumn")) {
            buttonStyle = "bg-gradient-to-br from-orange-400 to-red-600 border-orange-200 text-white shadow-orange-500/50";
            decor = <><Leaf size={20} className="absolute -top-3 -right-2 text-yellow-300 rotate-12 drop-shadow-sm animate-bounce" /><Leaf size={16} className="absolute -bottom-2 -left-2 text-orange-200 -rotate-45 drop-shadow-sm" /></>;
        } else if (season.id.includes("winter")) {
            buttonStyle = "bg-gradient-to-br from-sky-400 to-blue-700 border-sky-200 text-white shadow-sky-500/50";
            decor = <><Snowflake size={20} className="absolute -top-3 -left-2 text-white animate-spin-slow" /><div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse"></div></>;
        } else if (season.id.includes("spring")) {
            buttonStyle = "bg-gradient-to-br from-pink-400 to-rose-600 border-pink-200 text-white shadow-pink-500/50";
            decor = <><Flower size={20} className="absolute -top-4 -right-1 text-yellow-200 animate-bounce" /><Leaf size={14} className="absolute -bottom-1 left-2 text-green-300 rotate-45" /></>;
        } else if (season.id.includes("summer")) {
            buttonStyle = "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-100 text-orange-900 shadow-yellow-500/50";
            decor = <><Sun size={24} className="absolute -top-4 -left-2 text-yellow-100 animate-spin-slow" /></>;
        }

        return { buttonStyle, decor };
    }, [season.id]);

    const Icon = season.icon;

    return (
        <div className="relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 rounded-full blur-xl -z-10 group-hover:bg-white/40 transition-all"></div>
            <button onClick={onClick} className={`relative w-40 sm:w-48 py-3 sm:py-4 rounded-3xl shadow-2xl border-4 border-b-6 flex items-center justify-center gap-2 sm:gap-3 transition-all transform active:border-b-0 active:translate-y-2 hover:scale-105 hover:-translate-y-1 ${buttonStyle}`}>
                <Icon size={24} className="drop-shadow-md" />
                <span className="text-xs font-black uppercase tracking-widest drop-shadow-sm">{season.name}</span>
                {decor}
            </button>
        </div>
    );
});

SeasonButton.displayName = 'SeasonButton';

/* ========================================
   GAME COMPONENTS (Memoized for performance)
   ======================================== */

const MemoryGame = memo(({ data, onWin }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const shuffled = [...data.items]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, content: emoji }));
    setCards(shuffled);
  }, [data.items]);

  const handleCardClick = useCallback((id) => {
    if (flipped.length === 2 || matched.includes(id) || flipped.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = cards.find(c => c.id === newFlipped[1]);

      if (firstCard.content === secondCard.content) {
        setMatched(prev => [...prev, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  }, [flipped, matched, cards]);

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setTimeout(onWin, 500);
    }
  }, [matched, cards, onWin]);

  return (
    <div className="grid grid-cols-4 gap-2 h-full content-center p-2">
      {cards.map(card => {
        const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
        return (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 transform ${isFlipped ? 'bg-white shadow-md rotate-0' : 'bg-sky-200 rotate-180'}`}
          >
            {isFlipped ? card.content : ''}
          </button>
        );
      })}
    </div>
  );
});

MemoryGame.displayName = 'MemoryGame';

const CatcherGame = memo(({ data, onWin }) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState([]);
  const hasWonRef = useRef(false);

  useEffect(() => {
    if (score >= 5 && !hasWonRef.current) {
      hasWonRef.current = true;
      onWin();
    }
  }, [score, onWin]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (score >= 5) return;
      const newItem = {
        id: Date.now(),
        left: Math.random() * 70 + 10,
        type: Math.random() > 0.3 ? 'good' : 'bad',
        emoji: Math.random() > 0.3 ? data.target : data.avoid
      };
      setItems(prev => [...prev, newItem]);
    }, 800);
    return () => clearInterval(interval);
  }, [data, score]);

  const handleItemClick = useCallback((id, type) => {
    if (type === 'good') {
      setScore(prev => prev + 1);
    } else {
      setScore(prev => Math.max(0, prev - 1));
    }
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  return (
    <div className="h-full relative overflow-hidden bg-sky-50 rounded-xl border-2 border-sky-100">
      <div className="absolute top-2 right-2 font-bold text-sky-600 bg-white px-3 py-1 rounded-full shadow-sm z-10">
        {score} / 5
      </div>
      <p className="text-center text-gray-400 text-xs mt-2 pointer-events-none">
        Toque em {data.target}!
      </p>
      {items.map(item => (
        <button
          key={item.id}
          onAnimationEnd={() => setItems(prev => prev.filter(i => i.id !== item.id))}
          onClick={() => handleItemClick(item.id, item.type)}
          className="absolute text-3xl sm:text-4xl animate-fall cursor-pointer active:scale-90 transition-transform"
          style={{ left: `${item.left}%`, animationDuration: '3s' }}
        >
          {item.emoji}
        </button>
      ))}
    </div>
  );
});

CatcherGame.displayName = 'CatcherGame';

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

const HarvestGame = memo(({ data, onWin }) => {
    const [grid, setGrid] = useState(Array(9).fill(null));
    const [score, setScore] = useState(0);
    const hasWonRef = useRef(false);

    useEffect(() => {
        if (score >= 5 && !hasWonRef.current) {
            hasWonRef.current = true;
            onWin();
        }
    }, [score, onWin]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (score >= 5) return;
            const index = Math.floor(Math.random() * 9);
            const type = Math.random() > 0.3 ? 'target' : 'bad';
            setGrid(prev => {
                const newGrid = [...prev];
                newGrid[index] = type;
                return newGrid;
            });
            setTimeout(() => {
                setGrid(prev => {
                    const newGrid = [...prev];
                    if (newGrid[index] === type) newGrid[index] = null;
                    return newGrid;
                });
            }, 1000);
        }, 800);
        return () => clearInterval(interval);
    }, [score]);

    const handleTap = useCallback((index) => {
        if (grid[index] === 'target') {
            setScore(s => s + 1);
            setGrid(prev => {
                const n = [...prev];
                n[index] = 'pop';
                return n;
            });
        } else if (grid[index] === 'bad') {
            setScore(s => Math.max(0, s - 1));
        }
    }, [grid]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-orange-50 rounded-xl p-2">
            <h4 className="mb-2 font-bold text-orange-800 text-sm sm:text-base">Colha 5 {data.target}!</h4>
            <div className="grid grid-cols-3 gap-2 w-full max-w-[250px]">
                {grid.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => handleTap(i)}
                        className="aspect-square bg-orange-200 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-inner active:scale-95 transition-all"
                    >
                        {item === 'target' && <span className="animate-bounce">{data.target}</span>}
                        {item === 'bad' && <span>{data.bad}</span>}
                        {item === 'pop' && <span className="scale-150 opacity-50">✨</span>}
                    </button>
                ))}
            </div>
            <div className="mt-4 font-black text-xl sm:text-2xl text-orange-600">{score}/5</div>
        </div>
    );
});

HarvestGame.displayName = 'HarvestGame';

const WarmupGame = memo(({ data, onWin }) => {
    const [temp, setTemp] = useState(50);
    const [timeLeft, setTimeLeft] = useState(10);
    const hasWonRef = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (hasWonRef.current) return;
            setTimeLeft(t => {
                if (t <= 1 && temp > 0) {
                    hasWonRef.current = true;
                    onWin();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        const cooler = setInterval(() => {
            if (hasWonRef.current) return;
            setTemp(t => Math.max(0, t - 2));
        }, 100);

        return () => {
            clearInterval(timer);
            clearInterval(cooler);
        };
    }, [temp, onWin]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-blue-50 rounded-xl p-4">
            <div className="w-full h-48 sm:h-64 bg-slate-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-end pb-4 border-4 border-slate-600">
                <div className="text-4xl sm:text-6xl transition-all duration-100" style={{ transform: `scale(${temp/50})`, opacity: temp/100 }}>
                    {data.icon}
                </div>
                <div className="absolute right-2 top-2 bottom-2 w-4 bg-gray-700 rounded-full overflow-hidden border border-gray-500">
                    <div className={`absolute bottom-0 w-full transition-all duration-200 ${temp > 50 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${temp}%` }} />
                </div>
                {temp < 30 && <div className="absolute top-2 text-2xl animate-bounce">❄️</div>}
            </div>
            <div className="w-full mt-4 flex items-center gap-2 sm:gap-4">
                <div className="font-bold text-gray-500 w-12 sm:w-16 text-sm sm:text-base">{timeLeft}s</div>
                <button
                    onClick={() => setTemp(t => Math.min(100, t + 10))}
                    className="flex-1 bg-red-500 text-white font-black py-3 sm:py-4 rounded-xl shadow-lg active:scale-95 active:bg-red-600 text-xs sm:text-base"
                >
                    TAP! TAP! AQUECER!
                </button>
            </div>
        </div>
    );
});

WarmupGame.displayName = 'WarmupGame';

const SequenceGame = memo(({ data, onWin }) => {
    const [sequence, setSequence] = useState([]);
    const [playerSeq, setPlayerSeq] = useState([]);
    const [playingIdx, setPlayingIdx] = useState(null);
    const [round, setRound] = useState(1);
    const [status, setStatus] = useState('watch');
    const hasWonRef = useRef(false);

    useEffect(() => {
        if (status === 'watch' && !hasWonRef.current) {
            const newStep = Math.floor(Math.random() * 4);
            const newSeq = [...sequence, newStep];
            setSequence(newSeq);
            playSequence(newSeq);
        }
    }, [round, status]);

    const playSequence = async (seq) => {
        setPlayerSeq([]);
        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setPlayingIdx(seq[i]);
            await new Promise(r => setTimeout(r, 500));
            setPlayingIdx(null);
        }
        setStatus('play');
    };

    const handleTap = useCallback((index) => {
        if (status !== 'play') return;
        setPlayingIdx(index);
        setTimeout(() => setPlayingIdx(null), 200);

        const newPlayerSeq = [...playerSeq, index];
        setPlayerSeq(newPlayerSeq);

        if (sequence[newPlayerSeq.length - 1] !== index) {
            alert("Ops! Tente de novo.");
            setSequence([]);
            setRound(1);
            setStatus('watch');
            return;
        }

        if (newPlayerSeq.length === sequence.length) {
            if (round >= 3) {
                if (!hasWonRef.current) {
                    hasWonRef.current = true;
                    onWin();
                }
            } else {
                setRound(r => r + 1);
                setStatus('watch');
            }
        }
    }, [status, playerSeq, sequence, round, onWin]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-pink-50 rounded-xl p-4">
            <h4 className="font-bold text-pink-700 mb-4 text-sm sm:text-base">
                {status === 'watch' ? 'Observe...' : 'Repita!'} (Fase {round}/3)
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-48 h-48 sm:w-64 sm:h-64">
                {data.items.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => handleTap(i)}
                        className={`rounded-2xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-200 border-4 border-white shadow-md ${
                            playingIdx === i ? 'bg-white scale-105 brightness-125' : 'bg-pink-200 opacity-80'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
});

SequenceGame.displayName = 'SequenceGame';

const RevealGame = memo(({ data, onWin }) => {
    const [tiles, setTiles] = useState(Array(16).fill(true));
    const hasWonRef = useRef(false);

    const handleHover = useCallback((index) => {
        setTiles(prev => {
            const n = [...prev];
            n[index] = false;
            const cleared = n.filter(x => !x).length;
            if (cleared >= 14 && !hasWonRef.current) {
                hasWonRef.current = true;
                onWin();
            }
            return n;
        });
    }, [onWin]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-yellow-50 rounded-xl p-4">
            <h4 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">Limpe o céu!</h4>
            <div className="w-48 h-48 sm:w-64 sm:h-64 relative bg-sky-300 rounded-xl overflow-hidden flex items-center justify-center shadow-inner border-4 border-yellow-300">
                <div className="text-6xl sm:text-8xl animate-spin-slow">{data.icon}</div>
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                    {tiles.map((covered, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => handleHover(i)}
                            onTouchMove={() => handleHover(i)}
                            onClick={() => handleHover(i)}
                            className={`transition-opacity duration-500 bg-gray-200 border border-gray-300 flex items-center justify-center ${
                                covered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            <Cloud size={20} className="text-gray-400" />
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Passe o dedo para limpar</p>
        </div>
    );
});

RevealGame.displayName = 'RevealGame';

/* ========================================
   GAME & STORY OVERLAYS (Optimized)
   ======================================== */

const GameOverlay = memo(({ config, onClose, onWin }) => {
  const GameComponent = useMemo(() => {
    switch(config.gameType) {
      case GAME_TYPES.MEMORY: return MemoryGame;
      case GAME_TYPES.CATCHER: return CatcherGame;
      case GAME_TYPES.QUIZ: return QuizGame;
      case GAME_TYPES.HARVEST: return HarvestGame;
      case GAME_TYPES.WARMUP: return WarmupGame;
      case GAME_TYPES.SEQUENCE: return SequenceGame;
      case GAME_TYPES.REVEAL: return RevealGame;
      default: return null;
    }
  }, [config.gameType]);

  return (
    <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 ${config.bg} flex justify-between items-center`}>
          <h3 className={`font-black text-lg sm:text-xl uppercase ${config.color}`}>
            {config.gameData.title}
          </h3>
          <button
            onClick={onClose}
            className="bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors"
          >
            <X size={20} className="text-gray-600"/>
          </button>
        </div>
        <div className="p-2 sm:p-4 h-80 sm:h-96 relative bg-slate-50 overflow-hidden">
           {GameComponent && <GameComponent data={config.gameData} onWin={onWin} />}
        </div>
      </div>
    </div>
  );
});

GameOverlay.displayName = 'GameOverlay';

const StoryOverlay = memo(({ story, onClose }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const slides = useMemo(() => story.slides || [{ text: "Erro", icon: BookOpen }], [story.slides]);
    const totalSlides = slides.length;
    const CurrentIcon = slides[slideIndex].icon;

    const handleNext = useCallback(() => {
        if (slideIndex < totalSlides - 1) {
            setSlideIndex(prev => prev + 1);
        } else {
            onClose();
        }
    }, [slideIndex, totalSlides, onClose]);

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-700"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,0,0.3)] border-4 border-yellow-400 relative flex flex-col h-[500px] sm:h-[550px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-48 sm:h-56 bg-gradient-to-b from-sky-100 to-white flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-yellow-400/10 rotate-12 scale-150 transform origin-bottom-left"></div>
                    <div key={slideIndex} className="relative z-10 transition-all duration-700 transform animate-in zoom-in slide-in-from-bottom-10">
                        <CurrentIcon size={80} className="text-yellow-600 drop-shadow-lg sm:w-24 sm:h-24" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col items-center text-center bg-white relative">
                    <h3 className="font-black text-xl sm:text-2xl text-gray-800 mb-1">{story.title}</h3>
                    <div className="flex-1 flex items-center">
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-500" key={`txt-${slideIndex}`}>
                            "{slides[slideIndex].text}"
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-6 w-full">
                        <Button onClick={handleNext} color="bg-yellow-500 w-full shadow-yellow-700 text-base sm:text-lg py-3 sm:py-4">
                            {slideIndex < totalSlides - 1 ? (
                                <span className="flex items-center gap-2">Continuar <ArrowRight size={20}/></span>
                            ) : (
                                <span className="flex items-center gap-2">Amém! <Heart fill="white" size={20}/></span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

StoryOverlay.displayName = 'StoryOverlay';

/* ========================================
   FLYING STAR ANIMATION (Juicy UI)
   ======================================== */

const FlyingStar = memo(({ startPos, endPos, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const deltaX = endPos.x - startPos.x;
  const deltaY = endPos.y - startPos.y;

  return (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: `${startPos.x}px`,
        top: `${startPos.y}px`,
        '--target-x': `${deltaX}px`,
        '--target-y': `${deltaY}px`,
        animation: 'flyToHUD 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
      }}
    >
      <Star size={32} className="fill-yellow-400 text-yellow-400 drop-shadow-lg" />
    </div>
  );
});

FlyingStar.displayName = 'FlyingStar';

/* ========================================
   VICTORY MODAL (Juicy UI)
   ======================================== */

const VictoryModal = memo(({ coins, onClaim, storyUnlocked }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    // Generate confetti
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
    }));
    setConfettiPieces(pieces);
  }, []);

  const handleClaim = () => {
    setClaimed(true);
    setTimeout(onClaim, 100);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Rotating sun rays background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="w-[200%] h-[200%] bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20"
          style={{ animation: 'rotateRays 4s linear infinite' }}
        />
      </div>

      {/* Confetti */}
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-sm`}
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `confetti 3s ease-out ${piece.delay}s infinite`
          }}
        />
      ))}

      {/* Victory Card */}
      <div className="bg-gradient-to-b from-yellow-50 to-white rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(250,204,21,0.8)] border-4 border-yellow-400 max-w-sm w-full relative animate-in zoom-in duration-500">
        {/* Sparkles */}
        <div className="absolute -top-4 -left-4 text-yellow-400 animate-pulse">
          <Sparkles size={32} fill="currentColor" />
        </div>
        <div className="absolute -top-4 -right-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -left-4 text-blue-400 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <Sparkles size={24} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -right-4 text-purple-400 animate-pulse" style={{ animationDelay: '0.9s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>

        {/* Trophy icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-40 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-500 p-6 rounded-full shadow-2xl inline-block animate-bounce">
            <Trophy size={64} className="text-white drop-shadow-lg" strokeWidth={2.5} />
          </div>
        </div>

        {/* Victory text */}
        <div className="mb-6">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 mb-2 animate-pulse">
            VITÓRIA!
          </h2>
          <p className="text-gray-600 font-bold text-lg mb-4">
            Parabéns! 🎉
          </p>

          {/* Coins display */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Você ganhou:</p>
            <div className="flex items-center justify-center gap-2">
              <Star size={40} className="fill-yellow-400 text-yellow-400 animate-bounce" />
              <span className="text-5xl font-black text-yellow-600">+{coins}</span>
            </div>
            <p className="text-xs font-bold text-gray-500 mt-2">Estrelas da Virtude</p>
          </div>

          {/* Story Unlocked Notification */}
          {storyUnlocked && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-300 mb-4 animate-in zoom-in duration-500">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full animate-bounce">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-black text-purple-700 uppercase">📖 Bônus Desbloqueado!</p>
                  <p className="text-xs font-bold text-gray-600">Nova história disponível!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Claim button */}
        <button
          onClick={handleClaim}
          disabled={claimed}
          className="victory-claim-button w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claimed ? '✨ Recebido!' : '🎁 Receber Recompensa'}
        </button>
      </div>
    </div>
  );
});

VictoryModal.displayName = 'VictoryModal';

/* ========================================
   STREAK BONUS MODAL
   ======================================== */

const StreakBonusModal = memo(({ streak, bonusAmount, onClose }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    // Generate fire-colored confetti
    const pieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['bg-orange-400', 'bg-red-400', 'bg-yellow-400', 'bg-amber-400'][Math.floor(Math.random() * 4)]
    }));
    setConfettiPieces(pieces);
  }, []);

  const getMilestoneMessage = () => {
    if (streak === 7) return 'Uma semana completa!';
    if (streak === 30) return 'Um mês inteiro!';
    if (streak === 90) return 'Três meses seguidos!';
    return 'Continue assim!';
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Rotating fire rays background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="w-[200%] h-[200%] bg-gradient-to-r from-orange-400/20 via-transparent to-red-400/20"
          style={{ animation: 'rotateRays 3s linear infinite' }}
        />
      </div>

      {/* Fire Confetti */}
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-sm`}
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `confetti 3s ease-out ${piece.delay}s infinite`
          }}
        />
      ))}

      {/* Streak Card */}
      <div className="bg-gradient-to-b from-orange-50 to-white rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(251,146,60,0.8)] border-4 border-orange-400 max-w-md w-full relative animate-in zoom-in duration-500">
        {/* Sparkles */}
        <div className="absolute -top-4 -left-4 text-orange-400 animate-pulse">
          <Sparkles size={32} fill="currentColor" />
        </div>
        <div className="absolute -top-4 -right-4 text-red-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -left-4 text-amber-400 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <Sparkles size={24} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -right-4 text-orange-400 animate-pulse" style={{ animationDelay: '0.9s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>

        {/* Fire icon with streak count */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-orange-400 blur-3xl opacity-40 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-orange-400 via-red-500 to-orange-500 p-6 rounded-full shadow-2xl inline-block">
            <div className="text-7xl animate-bounce">🔥</div>
          </div>
        </div>

        {/* Streak text */}
        <div className="mb-6">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 mb-2">
            {streak} DIAS
          </h2>
          <p className="text-gray-600 font-bold text-lg mb-2">
            Sequência Incrível! 🎉
          </p>
          <p className="text-orange-600 font-black text-sm uppercase">
            {getMilestoneMessage()}
          </p>
        </div>

        {/* Calendar visualization - last 7 days */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 border-2 border-orange-300 mb-4">
          <p className="text-xs font-bold text-gray-600 mb-3">Últimos 7 dias:</p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Check size={20} className="text-white" strokeWidth={3} />
              </div>
            ))}
          </div>
        </div>

        {/* Bonus stars display */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 mb-6">
          <p className="text-sm font-bold text-gray-600 mb-2">🎁 Bônus Especial:</p>
          <div className="flex items-center justify-center gap-2">
            <Star size={40} className="fill-yellow-400 text-yellow-400 animate-bounce" />
            <span className="text-5xl font-black text-yellow-600">+{bonusAmount}</span>
          </div>
          <p className="text-xs font-bold text-gray-500 mt-2">Estrelas da Virtude</p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
        >
          🎯 Continuar Jogando
        </button>
      </div>
    </div>
  );
});

StreakBonusModal.displayName = 'StreakBonusModal';

/* ========================================
   FLOATING AVATAR (Match-3 Style Hero)
   ======================================== */

const FloatingAvatar = memo(() => {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ animation: 'hoverFloat 2s ease-in-out infinite' }}
    >
      <div className="relative">
        {/* Sombra Projetada Realista sobre a Estrada de Pedras */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-14 h-4 bg-black/50 rounded-full blur-md"></div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/35 rounded-full blur-sm"></div>

        {/* Avatar frame */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-1 rounded-2xl shadow-[0_10px_30px_rgba(14,165,233,0.5)] border-4 border-sky-200">
          <div className="bg-white rounded-xl p-2">
            <div className="text-4xl">😇</div>
          </div>
        </div>
      </div>
    </div>
  );
});

FloatingAvatar.displayName = 'FloatingAvatar';

/* ========================================
   PARALLAX DECORATIONS (Match-3 Style)
   ======================================== */

const ParallaxDecorations = memo(({ position }) => {
  const decorations = useMemo(() => {
    const random = (min, max) => Math.random() * (max - min) + min;

    return [
      // Islands
      { type: 'island', emoji: '🏝️', left: random(5, 15), top: position * 0.3, size: 40, delay: 0 },
      { type: 'island', emoji: '🏝️', left: random(70, 85), top: position * 0.5, size: 35, delay: 0.5 },

      // Rainbows
      { type: 'rainbow', emoji: '🌈', left: random(10, 20), top: position * 0.4, size: 50, delay: 1 },
      { type: 'rainbow', emoji: '🌈', left: random(75, 85), top: position * 0.6, size: 45, delay: 1.5 },

      // Stars
      { type: 'star', emoji: '✨', left: random(15, 25), top: position * 0.2, size: 25, delay: 0.8 },
      { type: 'star', emoji: '⭐', left: random(75, 85), top: position * 0.35, size: 30, delay: 1.2 },
    ];
  }, [position]);

  return (
    <>
      {decorations.map((deco, i) => (
        <div
          key={i}
          className="absolute pointer-events-none opacity-40 animate-pulse"
          style={{
            left: `${deco.left}%`,
            top: `${deco.top}px`,
            fontSize: `${deco.size}px`,
            animationDelay: `${deco.delay}s`,
            zIndex: deco.type === 'star' ? 5 : 1
          }}
        >
          {deco.emoji}
        </div>
      ))}
    </>
  );
});

ParallaxDecorations.displayName = 'ParallaxDecorations';

/* ========================================
   LAR SCREEN (Pet Home - Tamagotchi System)
   ======================================== */

const LarScreen = memo(({ coins, onSpendCoins }) => {
  // Pet state with localStorage persistence
  const [pet, setPet] = useState(() => {
    const saved = localStorage.getItem('checkin_pet');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      type: 'ovelhinha',
      name: 'Ovelhinha',
      hunger: 100,
      happiness: 100,
      energy: 100,
      lastUpdate: Date.now()
    };
  });

  // Floating feedback texts
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Pet animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(null);

  // Pet selector modal
  const [showPetSelector, setShowPetSelector] = useState(false);

  // Available pets
  const petTypes = useMemo(() => [
    { type: 'ovelhinha', name: 'Ovelhinha', emoji: '🐑', emojiAlt: '🐏' },
    { type: 'leao', name: 'Leãozinho', emoji: '🦁', emojiAlt: '🐯' },
    { type: 'pomba', name: 'Pombinha', emoji: '🕊️', emojiAlt: '🦅' }
  ], []);

  // Get habitat decoration based on pet type
  const getHabitatDecoration = useCallback(() => {
    switch (pet.type) {
      case 'ovelhinha':
        // Campo/Fazenda
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none">
            <div className="text-6xl absolute top-2 left-4">🌾</div>
            <div className="text-5xl absolute top-8 right-6">🌻</div>
            <div className="text-4xl absolute bottom-4 left-8">🌾</div>
            <div className="text-5xl absolute bottom-2 right-4">🌾</div>
            <div className="text-3xl absolute top-1/2 left-2">🌻</div>
            <div className="text-3xl absolute top-1/3 right-2">🌼</div>
          </div>
        );
      case 'leao':
        // Savana
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none">
            <div className="text-6xl absolute top-4 left-6">🌴</div>
            <div className="text-5xl absolute top-2 right-8">☀️</div>
            <div className="text-4xl absolute bottom-6 left-4">🌿</div>
            <div className="text-5xl absolute bottom-2 right-6">🌴</div>
            <div className="text-3xl absolute top-1/2 left-12">🍃</div>
            <div className="text-4xl absolute top-1/3 right-4">🌿</div>
          </div>
        );
      case 'pomba':
        // Céu
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none">
            <div className="text-6xl absolute top-4 left-8">☁️</div>
            <div className="text-5xl absolute top-12 right-6">☁️</div>
            <div className="text-4xl absolute bottom-8 left-6">☁️</div>
            <div className="text-5xl absolute bottom-4 right-8">☁️</div>
            <div className="text-6xl absolute top-1/2 left-4">⭐</div>
            <div className="text-4xl absolute top-1/3 right-12">✨</div>
          </div>
        );
      default:
        return null;
    }
  }, [pet.type]);

  // Calculate decay based on time passed (runs once on mount)
  useEffect(() => {
    const now = Date.now();
    const hoursPassed = (now - pet.lastUpdate) / (1000 * 60 * 60);

    // Decay if more than 0.1 hours passed (6 minutes - for testing)
    if (hoursPassed > 0.1) {
      const hungerDecay = Math.floor(hoursPassed * 5);
      const happinessDecay = Math.floor(hoursPassed * 3);
      const energyDecay = Math.floor(hoursPassed * 4);

      setPet(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - hungerDecay),
        happiness: Math.max(0, prev.happiness - happinessDecay),
        energy: Math.max(0, prev.energy - energyDecay),
        lastUpdate: now
      }));
    }
  }, []);

  // Save to localStorage whenever pet state changes
  useEffect(() => {
    localStorage.setItem('checkin_pet', JSON.stringify(pet));
  }, [pet]);

  // Frutos do Espírito (Gálatas 5:22-23)
  const fruits = useMemo(() => [
    { id: 1, name: 'Maçã do Amor', emoji: '🍎', cost: 15, hunger: 30, verse: 'Amor' },
    { id: 2, name: 'Uva da Alegria', emoji: '🍇', cost: 12, hunger: 25, verse: 'Alegria' },
    { id: 3, name: 'Pêra da Paz', emoji: '🍐', cost: 10, hunger: 20, verse: 'Paz' },
    { id: 4, name: 'Pêssego da Paciência', emoji: '🍑', cost: 18, hunger: 35, verse: 'Paciência' },
    { id: 5, name: 'Mel da Amabilidade', emoji: '🍯', cost: 15, hunger: 30, verse: 'Amabilidade' },
    { id: 6, name: 'Pão da Bondade', emoji: '🍞', cost: 20, hunger: 40, verse: 'Bondade' },
  ], []);

  // Add floating text animation
  const addFloatingText = useCallback((text, color) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  // Animate action (2-frame sprite animation)
  const animateAction = useCallback((type) => {
    setIsAnimating(true);
    setAnimationType(type);
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType(null);
    }, 1500);
  }, []);

  // Change pet type
  const changePet = useCallback((newType, newName) => {
    setPet(prev => ({
      ...prev,
      type: newType,
      name: newName
    }));
  }, []);

  // Feed pet with fruit
  const feedPet = useCallback((fruit) => {
    if (coins < fruit.cost) {
      addFloatingText('⭐ Insuficiente!', 'text-red-500');
      return;
    }

    // Check if hunger is already full
    if (pet.hunger >= 100) {
      addFloatingText('🍽️ Já está cheio!', 'text-orange-500');
      return;
    }

    onSpendCoins(fruit.cost);
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + fruit.hunger),
      lastUpdate: Date.now()
    }));

    animateAction('eating');
    addFloatingText(`-${fruit.cost} ⭐`, 'text-yellow-500');
    setTimeout(() => addFloatingText(`+${fruit.hunger} 🍽️`, 'text-green-500'), 200);
  }, [coins, pet.hunger, onSpendCoins, addFloatingText, animateAction]);

  // Play with pet
  const playWithPet = useCallback(() => {
    if (coins < 10) {
      addFloatingText('⭐ Insuficiente!', 'text-red-500');
      return;
    }

    if (pet.energy < 10) {
      addFloatingText('Sem energia!', 'text-orange-500');
      return;
    }

    // Check if happiness is already full
    if (pet.happiness >= 100) {
      addFloatingText('😊 Já está feliz!', 'text-pink-500');
      return;
    }

    onSpendCoins(10);
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      energy: Math.max(0, prev.energy - 10),
      lastUpdate: Date.now()
    }));

    animateAction('playing');
    addFloatingText('-10 ⭐', 'text-yellow-500');
    setTimeout(() => addFloatingText('+30 😊', 'text-pink-500'), 200);
  }, [coins, pet.energy, pet.happiness, onSpendCoins, addFloatingText, animateAction]);

  // Pet sleep (free action)
  const petSleep = useCallback(() => {
    // Check if energy is already full
    if (pet.energy >= 100) {
      addFloatingText('⚡ Energia cheia!', 'text-blue-500');
      return;
    }

    setPet(prev => ({
      ...prev,
      energy: 100,
      lastUpdate: Date.now()
    }));

    animateAction('sleeping');
    addFloatingText('+100 ⚡', 'text-blue-500');
  }, [pet.energy, addFloatingText, animateAction]);

  // Determine pet mood
  const getPetMood = useCallback(() => {
    const avg = (pet.hunger + pet.happiness + pet.energy) / 3;
    if (avg > 70) return { emoji: '😊', mood: 'Muito Feliz!', color: 'text-green-500' };
    if (avg > 40) return { emoji: '😐', mood: 'Ok', color: 'text-yellow-600' };
    return { emoji: '😢', mood: 'Precisa de cuidados!', color: 'text-red-500' };
  }, [pet.hunger, pet.happiness, pet.energy]);

  const mood = getPetMood();

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* CAMADA 1: Céu (Fundo) */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-sky-200"></div>

      {/* CAMADA 2: Nuvens (Meio) */}
      <CloudBackground />

      {/* CAMADA 3: Chão de Grama (Frente) */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-green-300 to-green-600 rounded-t-[50%] shadow-[0_-15px_40px_rgba(34,197,94,0.3)] z-[5]"></div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Lar do Amiguinho
          </h1>
          <p className="text-sm font-bold text-gray-600 mt-1">
            Use suas Estrelas da Virtude! ⭐
          </p>
        </div>

        {/* Pet Display com Habitat */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border-2 border-pink-200 relative overflow-hidden">
          {/* Decoração de Habitat Natural */}
          {getHabitatDecoration()}

          {/* Botão de Trocar Pet */}
          <button
            onClick={() => setShowPetSelector(true)}
            className="absolute top-3 right-3 bg-gradient-to-b from-purple-400 to-purple-600 text-white p-2 rounded-full shadow-lg border-b-4 border-purple-700 hover:scale-110 active:border-b-0 active:translate-y-1 transition-all z-30"
            title="Trocar amiguinho"
          >
            <Repeat2 size={20} strokeWidth={3} />
          </button>
          {/* Floating texts */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
            {floatingTexts.map((ft, index) => (
              <div
                key={ft.id}
                className={`absolute font-black text-2xl ${ft.color}`}
                style={{
                  animation: 'floatUp 2s ease-out forwards',
                  left: `${(index % 3 - 1) * 30}px`
                }}
              >
                {ft.text}
              </div>
            ))}
          </div>

          {/* Pet */}
          <div className="text-center mb-4 relative">
            <div
              className={`text-8xl mb-2 relative z-10 ${isAnimating ? '' : 'animate-bounce'}`}
              style={{
                animation: isAnimating ? 'petBounce 0.3s ease-in-out infinite' : undefined
              }}
            >
              {(() => {
                const currentPetType = petTypes.find(p => p.type === pet.type);
                if (!currentPetType) return '🐑';

                // Sprite animation: alternate between main and alt emoji
                if (isAnimating && animationType === 'eating') {
                  return <span className="inline-block">{currentPetType.emojiAlt}</span>;
                }
                if (isAnimating && animationType === 'playing') {
                  return <span className="inline-block transform rotate-12">{currentPetType.emoji}</span>;
                }
                if (isAnimating && animationType === 'sleeping') {
                  return '😴';
                }
                return currentPetType.emoji;
              })()}
            </div>
            {/* Sombra oval embaixo do pet */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/20 rounded-full blur-md"></div>

            <div className="text-4xl mb-1">{mood.emoji}</div>
            <p className="font-bold text-gray-700 text-lg">{pet.name}</p>
            <p className={`text-sm font-bold ${mood.color}`}>{mood.mood}</p>
          </div>

          {/* Status Bars - HUD 3D Vibrante */}
          <div className="space-y-3">
            {/* Hunger */}
            <div className="bg-white/50 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-full shadow-md">
                  <span className="text-white text-sm">🍽️</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-orange-600">Fome</span>
                    <span className="text-orange-500">{pet.hunger}%</span>
                  </div>
                  <div className="h-4 bg-orange-100 rounded-full overflow-hidden border border-orange-200">
                    <div
                      className="h-full bg-gradient-to-r from-orange-300 to-orange-500 transition-all duration-500 shadow-inner"
                      style={{ width: `${pet.hunger}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Happiness */}
            <div className="bg-white/50 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-yellow-400 to-pink-500 p-2 rounded-full shadow-md">
                  <span className="text-white text-sm">😊</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-yellow-600">Alegria</span>
                    <span className="text-yellow-500">{pet.happiness}%</span>
                  </div>
                  <div className="h-4 bg-yellow-100 rounded-full overflow-hidden border border-yellow-200">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-500 shadow-inner"
                      style={{ width: `${pet.happiness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white/50 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 rounded-full shadow-md">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-blue-600">Energia</span>
                    <span className="text-blue-500">{pet.energy}%</span>
                  </div>
                  <div className="h-4 bg-blue-100 rounded-full overflow-hidden border border-blue-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-300 to-blue-500 transition-all duration-500 shadow-inner"
                      style={{ width: `${pet.energy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frutos do Espírito Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-lg text-gray-700">🍎 Frutos do Espírito</h2>
            <p className="text-[10px] text-gray-500 font-bold">Gálatas 5:22</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fruits.map(fruit => (
              <button
                key={fruit.id}
                onClick={() => feedPet(fruit)}
                disabled={coins < fruit.cost}
                className={`bg-gradient-to-b from-white to-green-50 backdrop-blur-sm rounded-3xl p-4 shadow-lg border-b-4 transition-all ${
                  coins < fruit.cost
                    ? 'opacity-50 cursor-not-allowed border-gray-300'
                    : 'border-green-400 hover:scale-105 hover:shadow-[0_8px_30px_rgba(34,197,94,0.3)] active:border-b-0 active:translate-y-1'
                }`}
              >
                <div className="text-4xl mb-2">{fruit.emoji}</div>
                <p className="font-bold text-xs text-gray-700 mb-1">{fruit.name}</p>
                <div className="flex items-center justify-center gap-1 text-xs mb-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{fruit.cost}</span>
                </div>
                <p className="text-[10px] text-green-600 font-bold">+{fruit.hunger} Fome</p>
              </button>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="mb-6">
          <h2 className="font-black text-lg text-gray-700 mb-3">🎯 Atividades</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Play */}
            <button
              onClick={playWithPet}
              disabled={coins < 10 || pet.energy < 10}
              className={`bg-gradient-to-b from-white to-pink-50 backdrop-blur-sm rounded-3xl p-4 shadow-lg border-b-4 transition-all ${
                coins < 10 || pet.energy < 10
                  ? 'opacity-50 cursor-not-allowed border-gray-300'
                  : 'border-pink-400 hover:scale-105 hover:shadow-[0_8px_30px_rgba(244,114,182,0.3)] active:border-b-0 active:translate-y-1'
              }`}
            >
              <div className="text-4xl mb-2">🎾</div>
              <p className="font-bold text-xs text-gray-700 mb-1">Brincar</p>
              <div className="flex items-center justify-center gap-1 text-xs mb-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold">10</span>
              </div>
              <p className="text-[10px] text-pink-600 font-bold">+30 Alegria | -10 Energia</p>
            </button>

            {/* Sleep */}
            <button
              onClick={petSleep}
              disabled={pet.energy === 100}
              className={`bg-gradient-to-b from-white to-blue-50 backdrop-blur-sm rounded-3xl p-4 shadow-lg border-b-4 transition-all ${
                pet.energy === 100
                  ? 'opacity-50 cursor-not-allowed border-gray-300'
                  : 'border-blue-400 hover:scale-105 hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)] active:border-b-0 active:translate-y-1'
              }`}
            >
              <div className="text-4xl mb-2">😴</div>
              <p className="font-bold text-xs text-gray-700 mb-1">Dormir</p>
              <div className="flex items-center justify-center gap-1 text-xs mb-1">
                <span className="font-bold text-green-600">Grátis!</span>
              </div>
              <p className="text-[10px] text-blue-600 font-bold">Restaura Energia</p>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-200">
          <p className="text-xs text-gray-700 text-center font-medium leading-relaxed">
            💡 <strong>Dica Espiritual:</strong> Pratique as virtudes nos jogos para ganhar Estrelas e cultivar os Frutos do Espírito no seu amiguinho!
          </p>
        </div>
      </div>

      {/* Modal de Seleção de Pet */}
      {showPetSelector && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setShowPetSelector(false)}
        >
          <div
            className="bg-gradient-to-b from-white to-purple-50 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(168,85,247,0.8)] border-4 border-purple-400 max-w-sm w-full relative animate-in zoom-in duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkles */}
            <div className="absolute -top-4 -left-4 text-purple-400 animate-pulse">
              <Sparkles size={32} fill="currentColor" />
            </div>
            <div className="absolute -top-4 -right-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
              <Sparkles size={28} fill="currentColor" />
            </div>

            {/* Header */}
            <div className="mb-6">
              <Repeat2 size={48} className="mx-auto mb-3 text-purple-600" strokeWidth={2.5} />
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                Trocar Amiguinho
              </h2>
              <p className="text-sm font-bold text-gray-600 mt-2">Escolha seu companheiro espiritual:</p>
            </div>

            {/* Pet Options */}
            <div className="flex gap-4 justify-center mb-6">
              {petTypes.map(petOption => (
                <button
                  key={petOption.type}
                  onClick={() => {
                    changePet(petOption.type, petOption.name);
                    setShowPetSelector(false);
                  }}
                  className={`p-4 rounded-3xl border-b-4 transition-all ${
                    pet.type === petOption.type
                      ? 'bg-gradient-to-br from-purple-300 to-pink-300 border-purple-600 scale-110 shadow-[0_8px_30px_rgba(168,85,247,0.5)]'
                      : 'bg-gradient-to-b from-white to-gray-50 border-gray-300 hover:scale-110 hover:shadow-lg active:border-b-0 active:translate-y-1'
                  }`}
                >
                  <div className="text-5xl mb-2">{petOption.emoji}</div>
                  <p className="text-xs font-black text-gray-700">{petOption.name}</p>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPetSelector(false)}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-black text-sm py-3 rounded-2xl shadow-lg border-b-4 border-gray-700 hover:scale-105 active:border-b-0 active:translate-y-1 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

LarScreen.displayName = 'LarScreen';

/* ========================================
   CHECK-IN SCREEN (Optimized)
   ======================================== */

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
          style={{ width: `${(step / 3) * 100}%` }}
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
          <Button onClick={() => setStep(1)} color="bg-gradient-to-b from-orange-400 to-orange-600 border-orange-700 shadow-[0_8px_30px_rgba(251,146,60,0.4)]" className="w-full text-lg sm:text-xl">
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
          <Button onClick={() => setStep(2)} color="bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_8px_30px_rgba(34,197,94,0.4)]" className="w-full">
            Próximo <ArrowRight />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right">
          <h2 className="text-xl sm:text-2xl font-black text-white text-center mb-4 drop-shadow-md">
            Estoure o Medo!
          </h2>
          <CatcherGame
            data={{ target: '☁️', avoid: '⚡' }}
            onWin={() => setTimeout(() => setStep(3), 1000)}
          />
        </div>
      )}

      {step === 3 && (
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
                 color={isQuizCorrect ? "bg-gradient-to-b from-green-400 to-green-600 border-green-700 shadow-[0_8px_30px_rgba(34,197,94,0.4)]" : "bg-gradient-to-b from-gray-300 to-gray-500 border-gray-600"}
                 className="w-full"
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

/* ========================================
   MAP SCREEN (Highly Optimized)
   ======================================== */

// Calculate sinuous path position (Match-3 style)
const calculatePathPosition = (dayIndex, totalDays) => {
  // Vertical spacing between days
  const verticalSpacing = 55;
  const top = dayIndex * verticalSpacing;

  // S-curve using sine wave
  // Frequency: completes wave every ~12 days
  const waveFrequency = (Math.PI * 2) / 12;
  const waveAmplitude = 25; // Amplitude in %
  const centerPosition = 50; // Center position in %

  // Create smooth S-curve
  const left = centerPosition + (Math.sin(dayIndex * waveFrequency) * waveAmplitude);

  return {
    left: `${left}%`,
    top: `${top}px`
  };
};

/* ========================================
   ROAD & SCENERY COMPONENTS
   ======================================== */

// Dynamic Road Path - Conecta Pontos Exatos dos Nodes (King/Zynga Professional Style)
const DynamicRoadPath = memo(({ nodePositions, containerHeight }) => {
  // Gera SVG path que conecta EXATAMENTE os centros dos nodes
  const generateConnectedPath = useCallback(() => {
    if (!nodePositions || nodePositions.length === 0) return '';

    let pathData = '';

    // Move to primeiro node
    pathData += `M ${nodePositions[0].x} ${nodePositions[0].y} `;

    // Conecta todos os nodes com curvas suaves
    for (let i = 1; i < nodePositions.length; i++) {
      const prev = nodePositions[i - 1];
      const curr = nodePositions[i];

      // Quadratic Bezier para curva suave
      const controlX = (prev.x + curr.x) / 2;
      const controlY = (prev.y + curr.y) / 2;

      pathData += `Q ${controlX} ${controlY}, ${curr.x} ${curr.y} `;
    }

    return pathData;
  }, [nodePositions]);

  const pathData = useMemo(() => generateConnectedPath(), [generateConnectedPath]);

  if (!pathData) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-[1]"
      width="100%"
      height={containerHeight}
      style={{ minHeight: '100%' }}
    >
      <defs>
        {/* Cobblestone Texture Pattern */}
        <pattern id="roadTexture" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="18" height="18" fill="#6b7280" rx="3" opacity="0.9" />
          <rect x="20" y="0" width="18" height="18" fill="#78716c" rx="3" opacity="0.85" />
          <rect x="0" y="20" width="18" height="18" fill="#737373" rx="3" opacity="0.88" />
          <rect x="20" y="20" width="18" height="18" fill="#71717a" rx="3" opacity="0.92" />

          <line x1="19" y1="0" x2="19" y2="40" stroke="#3f3f46" strokeWidth="1.5" opacity="0.7" />
          <line x1="0" y1="19" x2="40" y2="19" stroke="#3f3f46" strokeWidth="1.5" opacity="0.7" />

          <circle cx="5" cy="5" r="1.5" fill="#84cc16" opacity="0.3" />
          <circle cx="25" cy="28" r="1" fill="#84cc16" opacity="0.4" />
          <circle cx="12" cy="32" r="1.5" fill="#65a30d" opacity="0.25" />
        </pattern>

        <filter id="roadRelief">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#d4d4d8" surfaceScale="1.5" result="diffLight">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feComposite in="diffLight" in2="SourceGraphic" operator="multiply" />
        </filter>

        <linearGradient id="depthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#57534e" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#78716c" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6b7280" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* CAMADA 1: Sombra (Profundidade 3D) */}
      <path
        d={pathData}
        fill="none"
        stroke="#27272a"
        strokeWidth="76"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        transform="translate(0, 4)"
      />

      {/* CAMADA 2: Borda Grama Escura */}
      <path
        d={pathData}
        fill="none"
        stroke="#4d7c0f"
        strokeWidth="88"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* CAMADA 3: Borda Grama Clara */}
      <path
        d={pathData}
        fill="none"
        stroke="#65a30d"
        strokeWidth="80"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />

      {/* CAMADA 4: Estrada Cobblestone */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#roadTexture)"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#roadRelief)"
      />

      {/* CAMADA 5: Overlay Profundidade */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#depthGradient)"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />

      {/* CAMADA 6: Highlight */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5,10"
        opacity="0.6"
      />
    </svg>
  );
});

DynamicRoadPath.displayName = 'DynamicRoadPath';

// Campo Gramado + Decorações de Bioma 3D com Parallax
const BiomeDecorations = memo(({ monthName, monthIndex }) => {
  const getSeasonDecorations = () => {
    const month = monthIndex; // 0=Jan, 11=Dez

    // Verão (Dez-Mar): Flores vibrantes e palmeiras
    if (month >= 11 || month <= 2) {
      return (
        <>
          {/* Elementos ATRÁS da estrada (z-[0]) */}
          <div className="absolute left-[-10px] top-[8%] text-7xl opacity-50 z-[0]">🌴</div>
          <div className="absolute right-[-5px] top-[25%] text-6xl opacity-45 z-[0]">🌴</div>
          <div className="absolute left-2 top-[50%] text-5xl opacity-40 z-[0]">🌿</div>
          <div className="absolute right-3 top-[68%] text-7xl opacity-50 z-[0]">🌴</div>

          {/* Elementos NO MEIO (z-[2] - ao lado da estrada) */}
          <div className="absolute left-4 top-[12%] text-6xl opacity-55 z-[2] drop-shadow-lg">🌺</div>
          <div className="absolute right-6 top-[20%] text-5xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>🌻</div>
          <div className="absolute left-6 top-[38%] text-4xl opacity-50 z-[2]">🪨</div>
          <div className="absolute right-4 top-[55%] text-6xl opacity-55 z-[2] drop-shadow-lg">🌺</div>
          <div className="absolute left-5 top-[75%] text-5xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3.5s' }}>🌻</div>
          <div className="absolute right-5 top-[88%] text-4xl opacity-50 z-[2]">🪨</div>

          {/* Elementos NA FRENTE da estrada (z-[15] - profundidade) */}
          <div className="absolute left-[-5px] top-[32%] text-8xl opacity-70 z-[15] drop-shadow-2xl">🌿</div>
          <div className="absolute right-[-8px] top-[78%] text-7xl opacity-65 z-[15] drop-shadow-2xl">🌺</div>
        </>
      );
    }

    // Outono (Abr-Jun): Folhas caindo e cogumelos
    if (month >= 3 && month <= 5) {
      return (
        <>
          {/* Elementos ATRÁS */}
          <div className="absolute left-[-8px] top-[10%] text-6xl opacity-45 z-[0]">🌳</div>
          <div className="absolute right-[-6px] top-[28%] text-7xl opacity-40 z-[0]">🌳</div>
          <div className="absolute left-2 top-[55%] text-6xl opacity-45 z-[0]">🌳</div>

          {/* Elementos NO MEIO */}
          <div className="absolute left-5 top-[15%] text-6xl opacity-55 z-[2] drop-shadow-lg animate-pulse" style={{ animationDuration: '4s' }}>🍂</div>
          <div className="absolute right-4 top-[22%] text-7xl opacity-60 z-[2] drop-shadow-lg">🍁</div>
          <div className="absolute left-6 top-[40%] text-5xl opacity-50 z-[2]">🍄</div>
          <div className="absolute right-6 top-[58%] text-6xl opacity-55 z-[2] drop-shadow-lg animate-pulse" style={{ animationDuration: '5s' }}>🍂</div>
          <div className="absolute left-4 top-[72%] text-5xl opacity-50 z-[2]">🍄</div>
          <div className="absolute right-3 top-[85%] text-4xl opacity-45 z-[2]">🪨</div>

          {/* Elementos NA FRENTE */}
          <div className="absolute left-[-6px] top-[35%] text-8xl opacity-65 z-[15] drop-shadow-2xl animate-pulse" style={{ animationDuration: '6s' }}>🍁</div>
          <div className="absolute right-[-10px] top-[68%] text-7xl opacity-70 z-[15] drop-shadow-2xl">🍂</div>
        </>
      );
    }

    // Inverno (Jul-Set): Neve e pinheiros
    if (month >= 6 && month <= 8) {
      return (
        <>
          {/* Elementos ATRÁS */}
          <div className="absolute left-[-12px] top-[12%] text-8xl opacity-50 z-[0]">🌲</div>
          <div className="absolute right-[-10px] top-[30%] text-7xl opacity-45 z-[0]">🌲</div>
          <div className="absolute left-[-8px] top-[60%] text-8xl opacity-50 z-[0]">🌲</div>

          {/* Elementos NO MEIO */}
          <div className="absolute left-4 top-[18%] text-4xl opacity-60 z-[2] animate-pulse" style={{ animationDuration: '3s' }}>❄️</div>
          <div className="absolute right-5 top-[25%] text-5xl opacity-55 z-[2] animate-pulse" style={{ animationDuration: '4s' }}>❄️</div>
          <div className="absolute left-6 top-[45%] text-6xl opacity-60 z-[2] animate-pulse" style={{ animationDuration: '5s' }}>❄️</div>
          <div className="absolute right-4 top-[65%] text-4xl opacity-55 z-[2] animate-pulse" style={{ animationDuration: '3.5s' }}>❄️</div>
          <div className="absolute left-5 top-[82%] text-5xl opacity-60 z-[2] animate-pulse" style={{ animationDuration: '4.5s' }}>❄️</div>

          {/* Elementos NA FRENTE */}
          <div className="absolute left-[-5px] top-[38%] text-9xl opacity-70 z-[15] drop-shadow-2xl">🌲</div>
          <div className="absolute right-[-8px] top-[75%] text-8xl opacity-65 z-[15] drop-shadow-2xl">🌲</div>
        </>
      );
    }

    // Primavera (Out-Nov): Flores coloridas e borboletas
    return (
      <>
        {/* Elementos ATRÁS */}
        <div className="absolute left-[-6px] top-[8%] text-6xl opacity-45 z-[0]">🌳</div>
        <div className="absolute right-[-8px] top-[26%] text-7xl opacity-40 z-[0]">🌳</div>
        <div className="absolute left-2 top-[52%] text-6xl opacity-45 z-[0]">🌳</div>

        {/* Elementos NO MEIO */}
        <div className="absolute left-5 top-[14%] text-6xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>🌸</div>
        <div className="absolute right-4 top-[20%] text-7xl opacity-65 z-[2] drop-shadow-lg">🌺</div>
        <div className="absolute left-6 top-[36%] text-5xl opacity-55 z-[2]">🦋</div>
        <div className="absolute right-6 top-[48%] text-6xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>🌼</div>
        <div className="absolute left-4 top-[66%] text-7xl opacity-65 z-[2] drop-shadow-lg">🌻</div>
        <div className="absolute right-5 top-[78%] text-5xl opacity-55 z-[2]">🦋</div>
        <div className="absolute left-6 top-[90%] text-6xl opacity-60 z-[2] drop-shadow-lg animate-bounce" style={{ animationDuration: '3.5s' }}>🌸</div>

        {/* Elementos NA FRENTE */}
        <div className="absolute left-[-7px] top-[42%] text-8xl opacity-70 z-[15] drop-shadow-2xl">🌺</div>
        <div className="absolute right-[-10px] top-[84%] text-7xl opacity-65 z-[15] drop-shadow-2xl">🌻</div>
      </>
    );
  };

  return (
    <>
      {/* Props 3D do Bioma com Parallax (sem fundo verde - mantém céu azul) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getSeasonDecorations()}
      </div>
    </>
  );
});

BiomeDecorations.displayName = 'BiomeDecorations';

// Itens decorativos no caminho (entre níveis)
const PathItems = memo(({ dayIndex }) => {
  const items = useMemo(() => {
    const decorations = [];
    const types = ['💰', '💛', '👣', '✨'];

    // Adiciona 1-2 itens aleatórios entre alguns dias
    if (dayIndex % 3 === 0 && Math.random() > 0.5) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomOffset = (Math.random() - 0.5) * 30;

      decorations.push({
        emoji: randomType,
        offset: randomOffset,
        delay: Math.random() * 2
      });
    }

    return decorations;
  }, [dayIndex]);

  if (items.length === 0) return null;

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-30 animate-pulse pointer-events-none"
          style={{
            left: `calc(50% + ${item.offset}px)`,
            top: '25px',
            animationDelay: `${item.delay}s`,
            animationDuration: '3s'
          }}
        >
          {item.emoji}
        </div>
      ))}
    </>
  );
});

PathItems.displayName = 'PathItems';

// Optimized: Memoize individual day component with base/shadow
const DayNode = memo(({ dayNum, month, isCurrentDay, specialDate, onSpecialClick, monthIndex, style }) => {
  // Calculate if this day is in the past
  const isPast = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentDay = today.getDate();

    // monthIndex: 0=Janeiro, 1=Fevereiro, ..., 11=Dezembro
    if (monthIndex < currentMonth) return true; // Mês já passou
    if (monthIndex > currentMonth) return false; // Mês futuro
    return dayNum < currentDay; // Mesmo mês: compara dia
  }, [dayNum, monthIndex]);

  const neonStyle = specialDate ? `${specialDate.color}` : '';
  const SpecialIcon = specialDate?.icon;

  return (
    <div className="absolute flex flex-col items-center z-10" style={style}>
      {/* Sombra Projetada Realista (projetada sobre a estrada) */}
      <div className="absolute top-[32px] sm:top-[42px] w-12 h-3 bg-black/40 rounded-full blur-[3px] opacity-60"></div>

      {/* Base Circular de Pedra (ancora o nó na estrada) */}
      <div className={`absolute top-[28px] sm:top-[36px] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-stone-400 via-stone-500 to-stone-600 border-2 border-stone-700 opacity-80 shadow-inner ${
        isCurrentDay ? 'scale-110' : ''
      }`}>
        {/* Textura de pedra na base */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%)]"></div>
      </div>

      {/* Botão do Dia (Level Node) */}
      <div
        onClick={() => specialDate && !isPast && onSpecialClick(specialDate)}
        className={`
            relative w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 border-[3px]
            ${isCurrentDay
                ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600 scale-125 sm:scale-150 shadow-[0_0_25px_rgba(250,204,21,0.8)] z-20 animate-pulse'
                : isPast
                    ? 'bg-gradient-to-b from-slate-700/60 to-slate-800/60 border-slate-600 text-slate-500 opacity-40 scale-90 grayscale'
                    : specialDate
                        ? `${neonStyle} cursor-pointer hover:scale-125 shadow-lg border-white/50`
                        : 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 text-white shadow-[0_4px_15px_rgba(59,130,246,0.5)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)]'
            }
        `}
      >
        {isCurrentDay ? (
          <Sun size={18} className="text-yellow-900 animate-spin-slow sm:w-6 sm:h-6" strokeWidth={2.5} />
        ) : (
          specialDate ? <SpecialIcon size={10} className={!isPast && "animate-spin-slow"}/> : dayNum
        )}
      </div>
    </div>
  );
});

DayNode.displayName = 'DayNode';

const MapScreen = memo(({ lastCompletedDay, onOpenGame, onOpenStory, unlockedStories, readStories }) => {
  const containerRef = useRef(null);
  const currentDayRef = useRef(null);
  const [activeDecoration, setActiveDecoration] = useState(null);
  const [selectedSpecialDate, setSelectedSpecialDate] = useState(null);

  const reversedMonths = useMemo(() => [...MONTHS_CONFIG].reverse(), []);

  // Optimized: Scroll animation only runs once on mount
  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });

      const scrollUpTimer = setTimeout(() => {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);

      const scrollBackTimer = setTimeout(() => {
        if (currentDayRef.current) {
            currentDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 2500);

      return () => {
        clearTimeout(scrollUpTimer);
        clearTimeout(scrollBackTimer);
      };
    }
  }, []);

  const handleCloseDecoration = useCallback(() => {
    setActiveDecoration(null);
  }, []);

  const handleSpecialDateClick = useCallback((date) => {
    setSelectedSpecialDate(date);
  }, []);

  return (
    <div
        ref={containerRef}
        className="h-full overflow-y-auto pb-24 relative scroll-smooth optimize-scroll custom-scrollbar bg-gradient-to-t from-sky-200 via-indigo-300 to-indigo-950"
        onClick={handleCloseDecoration}
    >
        {/* Parallax Decorations */}
        <ParallaxDecorations position={0} />

        <div className="pt-20 sm:pt-32 pb-10 text-center animate-pulse z-10 relative">
            <div className="inline-block relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 rounded-full"></div>
                <Star className="relative text-yellow-200 fill-white drop-shadow-lg w-16 h-16 sm:w-20 sm:h-20"/>
            </div>
            <h2 className="text-white font-black text-xl sm:text-2xl mt-4 drop-shadow-md tracking-widest uppercase">
              Caminho da Vida
            </h2>
        </div>

      {selectedSpecialDate && (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedSpecialDate(null)}
        >
            <div
                className="bg-gradient-to-b from-yellow-50 to-white rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(250,204,21,0.5)] border-4 border-yellow-400 max-w-xs w-full relative animate-in zoom-in duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sparkles decoration */}
                <div className="absolute -top-2 -left-2 text-yellow-400 animate-pulse">
                  <Star size={24} fill="currentColor" />
                </div>
                <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse delay-150">
                  <Star size={20} fill="currentColor" />
                </div>
                <div className="absolute -bottom-2 -left-2 text-yellow-400 animate-pulse delay-300">
                  <Star size={16} fill="currentColor" />
                </div>
                <div className="absolute -bottom-2 -right-2 text-yellow-400 animate-pulse delay-500">
                  <Star size={18} fill="currentColor" />
                </div>

                {/* Icon with glow effect */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-5 rounded-full shadow-2xl inline-block animate-bounce">
                    <selectedSpecialDate.icon size={48} className="text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Hype title with animation */}
                <div className="mb-3 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    <h3 className="text-2xl font-black uppercase tracking-tight animate-pulse">
                      🎉 Em Breve! 🎉
                    </h3>
                  </div>
                  <h4 className="text-xl font-black text-gray-800 mt-2">{selectedSpecialDate.label}</h4>
                </div>

                {/* Message with better styling */}
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl mb-6 border-2 border-yellow-200 shadow-inner animate-in fade-in duration-1000">
                  <p className="text-gray-700 font-bold leading-relaxed text-base">
                    "{selectedSpecialDate.message}"
                  </p>
                </div>

                {/* CTA Button with pulse effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 blur-md opacity-50 rounded-xl animate-pulse"></div>
                  <Button
                    onClick={() => setSelectedSpecialDate(null)}
                    color="bg-gradient-to-r from-sky-500 to-blue-600 w-full text-base shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <Clock size={20} className="animate-spin-slow"/>
                    Aguarde o dia da surpresa!
                  </Button>
                </div>
              </div>
        </div>
      )}

      <div className="flex flex-col items-center px-2">
        {reversedMonths.map((month, reverseIndex) => {
          // Calculate real month index (0-11) for date comparison
          const monthIndex = 11 - reverseIndex; // Dezembro=11, Janeiro=0
          const daysInThisMonth = useMemo(() => Array.from({ length: 31 }, (_, i) => 31 - i), []);
          const isDecorLeft = Math.random() > 0.5;
          const isStoryLeft = !isDecorLeft;
          const MonthIcon = month.icon;
          const isMonthStoryUnlocked = unlockedStories.includes(month.story.id);
          const isMonthStoryRead = readStories.includes(month.story.id);

          return (
            <div key={month.name} className="w-full mb-8 relative flex flex-col items-center">

              <div className="absolute top-10 left-[-20px] text-white/20 animate-pulse gpu-accelerate" style={{ animationDelay: '1s' }}>
                <Cloud size={40} fill="currentColor" className="sm:w-15 sm:h-15" />
              </div>
              <div className="absolute bottom-20 right-[-30px] text-white/10 animate-pulse gpu-accelerate" style={{ animationDelay: '3s' }}>
                <Cloud size={60} fill="currentColor" className="sm:w-22 sm:h-22" />
              </div>

              {month.seasonEvent && (() => {
                 const season = month.seasonEvent;
                 const isSeasonStoryUnlocked = unlockedStories.includes(season.story.id);
                 const isSeasonStoryRead = readStories.includes(season.story.id);

                 return (
                     <div className="relative z-30 w-full flex flex-col items-center justify-center mb-8 mt-4 animate-in zoom-in duration-500">
                        <div className="absolute h-full w-0.5 border-l-2 border-dashed border-white/20 -z-10"></div>

                        <SeasonButton
                            season={season}
                            onClick={(e) => {
                                e.stopPropagation();
                                if(isMonthStoryUnlocked) {
                                    setActiveDecoration(activeDecoration === season.id ? null : season.id);
                                } else {
                                    alert("Complete a jornada do mês primeiro!");
                                }
                            }}
                        />
                        {isSeasonStoryUnlocked && !isSeasonStoryRead && (
                             <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce whitespace-nowrap z-40">
                               HISTÓRIA DESBLOQUEADA!
                             </div>
                        )}

                        {!isMonthStoryUnlocked && (
                             <div className="absolute top-0 right-10 bg-gray-800/80 rounded-full p-2 z-40 shadow-lg">
                               <Lock size={16} className="text-white" />
                             </div>
                        )}

                         {activeDecoration === season.id && (
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-56 sm:w-64 bg-white p-4 rounded-2xl shadow-2xl z-50 border-4 border-yellow-200" onClick={(e) => e.stopPropagation()}>
                                <h4 className={`font-black uppercase text-sm ${season.color} mb-1 text-center`}>
                                  {season.name}
                                </h4>
                                <p className="text-gray-600 text-xs font-bold leading-tight mb-3 text-center">
                                  {season.desc}
                                </p>
                                {isSeasonStoryUnlocked ? (
                                    <button
                                      onClick={() => onOpenStory(season.story)}
                                      className="w-full py-2 bg-yellow-400 text-yellow-900 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2"
                                    >
                                      <BookOpen size={14} /> LER HISTÓRIA
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => isMonthStoryUnlocked ? onOpenGame(season) : alert("Jogue a missão do mês primeiro!")}
                                        className={`w-full py-2 rounded-xl text-xs font-black text-white shadow-md flex items-center justify-center gap-2
                                            ${isMonthStoryUnlocked ? season.color.replace('text', 'bg').replace('600', '500').replace('400', '500') : 'bg-gray-400 cursor-not-allowed'}`}
                                    >
                                        {isMonthStoryUnlocked ? <><Play size={14} /> JOGAR ESPECIAL</> : <><Lock size={14} /> BLOQUEADO</>}
                                    </button>
                                )}
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-yellow-200"></div>
                            </div>
                         )}
                     </div>
                 );
              })()}

              <div className={`absolute top-1/2 transform -translate-y-1/2 ${isDecorLeft ? 'left-2' : 'right-2'} z-20 flex flex-col items-center gap-2`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDecoration(activeDecoration === month.name ? null : month.name);
                    }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/50 backdrop-blur-md transition-all duration-300 ${
                      month.name === activeDecoration ? 'bg-white scale-110 rotate-3' : 'bg-white/20 hover:scale-105'
                    }`}
                  >
                      <MonthIcon size={24} className={`${month.color} drop-shadow-sm sm:w-8 sm:h-8`} />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-sm border-2 border-white">
                        {isMonthStoryUnlocked ? <CheckCircle size={10} /> : <Play size={10} fill="currentColor" />}
                      </div>
                  </button>

                  {month.extraGame && (
                      <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if(isMonthStoryUnlocked) {
                                setActiveDecoration(activeDecoration === month.extraGame.title ? null : month.extraGame.title);
                            }
                        }}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white/50 transition-all
                            ${isMonthStoryUnlocked ? month.extraGame.bg : 'bg-gray-200 grayscale cursor-not-allowed'}
                        `}
                      >
                          {isMonthStoryUnlocked ? (
                            <Gamepad2 size={16} className={month.extraGame.color + ' sm:w-4 sm:h-4'} />
                          ) : (
                            <Lock size={12} className="text-gray-400 sm:w-3 sm:h-3" />
                          )}
                      </button>
                  )}

                  {activeDecoration === month.name && (
                      <div className={`absolute top-0 ${isDecorLeft ? 'left-16 sm:left-20' : 'right-16 sm:right-20'} w-48 sm:w-56 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl z-50 animate-in zoom-in slide-in-from-${isDecorLeft ? 'left' : 'right'}-5 border-2 border-gray-100`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1.5 rounded-lg ${month.bg}`}>
                              <MonthIcon size={14} className={month.color + ' sm:w-4 sm:h-4'} />
                            </div>
                            <h4 className={`font-black uppercase text-xs sm:text-sm ${month.color}`}>
                              {month.label}
                            </h4>
                          </div>
                          <p className="text-gray-600 text-xs font-bold leading-tight mb-3">{month.desc}</p>
                          <button
                            onClick={() => onOpenGame(month)}
                            className={`w-full py-2 rounded-xl text-xs font-black text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 ${month.color.replace('text', 'bg')}`}
                          >
                            <Trophy size={14} /> {isMonthStoryUnlocked ? "JOGAR NOVAMENTE" : "JOGAR MISSÃO"}
                          </button>
                      </div>
                  )}

                  {month.extraGame && activeDecoration === month.extraGame.title && (
                      <div className={`absolute top-12 ${isDecorLeft ? 'left-12 sm:left-14' : 'right-12 sm:right-14'} w-40 sm:w-48 bg-white p-3 rounded-xl shadow-2xl z-50 animate-in zoom-in slide-in-from-${isDecorLeft ? 'left' : 'right'}-5 border-2 border-gray-100`} onClick={(e) => e.stopPropagation()}>
                          <h4 className={`font-black uppercase text-xs ${month.extraGame.color} mb-1`}>
                            {month.extraGame.title}
                          </h4>
                          <button
                            onClick={() => onOpenGame(month.extraGame)}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black text-white shadow-sm ${month.extraGame.color.replace('text', 'bg').replace('600', '500').replace('700', '500')}`}
                          >
                            JOGAR EXTRA
                          </button>
                      </div>
                  )}
              </div>

              <div className={`absolute top-1/2 transform -translate-y-1/2 ${isStoryLeft ? 'left-2' : 'right-2'} z-20`}>
                  <button
                    disabled={!isMonthStoryUnlocked}
                    onClick={() => onOpenStory(month.story)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-500 ${
                      isMonthStoryUnlocked
                        ? 'bg-yellow-400 border-yellow-200 text-yellow-900 animate-bounce cursor-pointer hover:scale-110'
                        : 'bg-black/20 border-white/10 text-white/40 grayscale cursor-not-allowed'
                    }`}
                  >
                      {isMonthStoryUnlocked ? (
                        <BookOpen size={20} className="sm:w-6 sm:h-6" />
                      ) : (
                        <Lock size={20} className="sm:w-6 sm:h-6" />
                      )}
                  </button>
                  {isMonthStoryUnlocked && !isMonthStoryRead && (
                       <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[7px] font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce whitespace-nowrap z-50">
                         HISTÓRIA DESBLOQUEADA!
                       </span>
                  )}
              </div>

              <div className="flex justify-center mb-4 relative z-10">
                <div className="bg-white/10 backdrop-blur px-3 sm:px-4 py-1 rounded-full border border-white/20">
                  <span className="text-white font-bold text-[10px] uppercase tracking-widest">
                    Fim de {month.name}
                  </span>
                </div>
              </div>

              {/* Sinuous Path Container (Match-3 Style) */}
              <div className="relative w-full" style={{ height: `${month.days * 55 + 100}px` }}>
                {/* Cloud borders for depth */}
                <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none overflow-hidden opacity-20">
                  <Cloud size={80} className="absolute left-[-20px] top-[10%] text-white fill-white" />
                  <Cloud size={60} className="absolute left-[-10px] top-[30%] text-white fill-white" />
                  <Cloud size={70} className="absolute left-[-15px] top-[60%] text-white fill-white" />
                  <Cloud size={50} className="absolute left-[-5px] top-[85%] text-white fill-white" />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none overflow-hidden opacity-20">
                  <Cloud size={70} className="absolute right-[-15px] top-[15%] text-white fill-white" />
                  <Cloud size={80} className="absolute right-[-20px] top-[40%] text-white fill-white" />
                  <Cloud size={60} className="absolute right-[-10px] top-[70%] text-white fill-white" />
                  <Cloud size={55} className="absolute right-[-8px] top-[90%] text-white fill-white" />
                </div>

                {/* Dynamic Road Path - Conecta os centros exatos dos nodes (King/Zynga Style) */}
                {(() => {
                  // COLETAR todas as coordenadas dos nodes ANTES de renderizar
                  const nodePositions = Array.from({ length: month.days }, (_, i) => {
                    const dayIndex = i;
                    const pathPosition = calculatePathPosition(dayIndex, month.days);

                    // Converter de porcentagem para pixels absolutos
                    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
                    const x = (parseFloat(pathPosition.left) / 100) * containerWidth;
                    const y = parseInt(pathPosition.top);

                    return { x, y };
                  });

                  return <DynamicRoadPath nodePositions={nodePositions} containerHeight={month.days * 55 + 100} />;
                })()}

                {/* BiomeDecorations - Decorações Sazonais */}
                <BiomeDecorations monthName={month.name} monthIndex={monthIndex} />

                {/* Sinuous path of days */}
                {Array.from({ length: month.days }, (_, i) => {
                  const dayNum = month.days - i; // Countdown from month.days to 1
                  const dayIndex = i; // Index for path calculation
                  const pathPosition = calculatePathPosition(dayIndex, month.days);
                  const specialDate = month.specialDates?.find(sd => sd.day === dayNum);
                  const isCurrentDay = month.name === 'Novembro' && dayNum === 27;

                  return (
                    <div key={dayNum} ref={isCurrentDay ? currentDayRef : null}>
                      <DayNode
                        dayNum={dayNum}
                        month={month}
                        monthIndex={monthIndex}
                        isCurrentDay={isCurrentDay}
                        specialDate={specialDate}
                        onSpecialClick={handleSpecialDateClick}
                        style={pathPosition}
                      />
                      {/* PathItems - Itens decorativos entre os dias */}
                      <div className="absolute" style={pathPosition}>
                        <PathItems dayIndex={dayIndex} />
                      </div>
                      {isCurrentDay && (
                        <div
                          className="absolute z-50"
                          style={{
                            left: pathPosition.left,
                            top: `${parseInt(pathPosition.top) - 60}px`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <FloatingAvatar />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <span className="text-white/40 font-black text-3xl sm:text-4xl uppercase tracking-tighter opacity-20 select-none">
                  {month.name.substring(0, 3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pb-32 pt-10 text-center relative z-10">
        <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Início</p>
      </div>
    </div>
  );
});

MapScreen.displayName = 'MapScreen';

/* ========================================
   MAIN APP COMPONENT (Optimized)
   ======================================== */

export default function CheckInApp() {
  const [screen, setScreen] = useState('checkin');
  const [lastCompletedDay, setLastCompletedDay] = useState(330);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [currentGameConfig, setCurrentGameConfig] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [coins, setCoins] = useState(0);
  const [unlockedStories, setUnlockedStories] = useState([]);
  const [readStories, setReadStories] = useState([]);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryCoins, setVictoryCoins] = useState(0);
  const [flyingStars, setFlyingStars] = useState([]);
  const [storyUnlocked, setStoryUnlocked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [streakBonusAmount, setStreakBonusAmount] = useState(0);

  // Load saved data from localStorage
  useEffect(() => {
    const savedDay = parseInt(localStorage.getItem('checkin_day') || '330');
    setLastCompletedDay(savedDay);
    const savedCoins = parseInt(localStorage.getItem('checkin_coins') || '0');
    setCoins(savedCoins);
    const savedStories = JSON.parse(localStorage.getItem('checkin_stories') || '[]');
    setUnlockedStories(savedStories);
    const savedRead = JSON.parse(localStorage.getItem('checkin_read_stories') || '[]');
    setReadStories(savedRead);

    // Load streak data
    const savedStreak = parseInt(localStorage.getItem('checkin_streak') || '0');
    setStreak(savedStreak);
    const savedLastCheckIn = localStorage.getItem('checkin_last_date');
    setLastCheckInDate(savedLastCheckIn);
  }, []);

  const handleDayComplete = useCallback(() => {
    const newDay = lastCompletedDay + 1;
    setLastCompletedDay(newDay);
    setIsCompletedToday(true);
    localStorage.setItem('checkin_day', newDay.toString());

    const newCoins = coins + 10;
    setCoins(newCoins);
    localStorage.setItem('checkin_coins', newCoins.toString());

    // Calculate streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let newStreak = 1;
    let bonusStars = 0;

    if (lastCheckInDate === yesterday) {
      // Consecutive day - increment streak
      newStreak = streak + 1;

      // Check for milestone bonuses
      if (newStreak === 7) bonusStars = 100;
      else if (newStreak === 30) bonusStars = 500;
      else if (newStreak === 90) bonusStars = 2000;
    } else if (lastCheckInDate !== today) {
      // Missed a day or first time - reset streak
      newStreak = 1;
    } else {
      // Already checked in today
      newStreak = streak;
    }

    setStreak(newStreak);
    setLastCheckInDate(today);
    localStorage.setItem('checkin_streak', newStreak.toString());
    localStorage.setItem('checkin_last_date', today);

    if (bonusStars > 0) {
      const totalCoinsWithBonus = newCoins + bonusStars;
      setCoins(totalCoinsWithBonus);
      localStorage.setItem('checkin_coins', totalCoinsWithBonus.toString());
      setStreakBonusAmount(bonusStars);
      setShowStreakBonus(true);
    }

    setTimeout(() => setScreen('map'), 2000);
  }, [lastCompletedDay, coins, streak, lastCheckInDate]);

  const addCoins = useCallback((amount) => {
    setCoins(prev => {
      const newTotal = prev + amount;
      localStorage.setItem('checkin_coins', newTotal.toString());
      return newTotal;
    });
  }, []);

  const spendCoins = useCallback((amount) => {
    setCoins(prev => {
      const newTotal = Math.max(0, prev - amount);
      localStorage.setItem('checkin_coins', newTotal.toString());
      return newTotal;
    });
  }, []);

  const handleWinGame = useCallback(() => {
    const coinsToAdd = 50;

    const storyIdToUnlock = currentGameConfig?.story?.id || currentGameConfig?.seasonEvent?.story?.id;
    let hasUnlockedStory = false;

    if (storyIdToUnlock && !unlockedStories.includes(storyIdToUnlock)) {
        setUnlockedStories(prev => {
          const newStories = [...prev, storyIdToUnlock];
          localStorage.setItem('checkin_stories', JSON.stringify(newStories));
          return newStories;
        });
        hasUnlockedStory = true;
    }

    // Close game and show victory modal
    setCurrentGameConfig(null);
    setVictoryCoins(coinsToAdd);
    setStoryUnlocked(hasUnlockedStory);
    setShowVictoryModal(true);
  }, [currentGameConfig, unlockedStories]);

  // Handle victory modal claim
  const handleClaimReward = useCallback(() => {
    // Get button position for flying star animation
    const modalButton = document.querySelector('.victory-claim-button');
    const hudStar = document.querySelector('.hud-star');

    if (modalButton && hudStar) {
      const buttonRect = modalButton.getBoundingClientRect();
      const hudRect = hudStar.getBoundingClientRect();

      const startPos = {
        x: buttonRect.left + buttonRect.width / 2 - 16,
        y: buttonRect.top + buttonRect.height / 2 - 16
      };

      const endPos = {
        x: hudRect.left + hudRect.width / 2 - 16,
        y: hudRect.top + hudRect.height / 2 - 16
      };

      // Add flying star
      const starId = Date.now();
      setFlyingStars(prev => [...prev, { id: starId, startPos, endPos }]);

      // Remove flying star after animation
      setTimeout(() => {
        setFlyingStars(prev => prev.filter(s => s.id !== starId));
        addCoins(victoryCoins);
      }, 1000);
    } else {
      // Fallback if elements not found
      addCoins(victoryCoins);
    }

    setShowVictoryModal(false);
  }, [victoryCoins, addCoins]);

  const handleCloseStreakBonus = useCallback(() => {
    setShowStreakBonus(false);
  }, []);

  const handleOpenStory = useCallback((story) => {
      setCurrentStory(story);
      if (!readStories.includes(story.id)) {
          setReadStories(prev => {
            const newRead = [...prev, story.id];
            localStorage.setItem('checkin_read_stories', JSON.stringify(newRead));
            return newRead;
          });
      }
  }, [readStories]);

  return (
    <div className="w-full h-screen max-w-md mx-auto bg-slate-900 overflow-hidden relative font-sans shadow-2xl">
      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 z-30 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2">
          {/* Stars */}
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/10 shadow-lg">
             <Star className="hud-star fill-yellow-400 text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
             <span className="text-white font-bold text-xs">{coins}</span>
          </div>
          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-orange-400/30 shadow-lg">
              <span className="text-sm">🔥</span>
              <span className="text-white font-bold text-xs">{streak}</span>
            </div>
          )}
        </div>
        <div className="bg-black/20 backdrop-blur-md px-3 sm:px-4 py-1 rounded-full border border-white/10">
             <span className="text-white font-[nunito] font-black text-xs sm:text-sm tracking-widest uppercase">
               {screen === 'checkin' ? 'Hoje' : screen === 'map' ? 'Caminho' : 'Lar'}
             </span>
        </div>
        <div className="w-8 sm:w-12"></div>
      </div>

      <div className="h-full z-10 relative bg-slate-900">
        {screen === 'checkin' && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 z-0">
             <CloudBackground />
             <div className="relative z-10 h-full pt-14 sm:pt-16 pb-20">
                <CheckInScreen
                    currentDay={lastCompletedDay + 1}
                    onCompleteDay={handleDayComplete}
                    isCompletedToday={isCompletedToday}
                />
             </div>
          </div>
        )}
        {screen === 'map' && (
          <MapScreen
            lastCompletedDay={lastCompletedDay}
            onOpenGame={setCurrentGameConfig}
            onOpenStory={handleOpenStory}
            unlockedStories={unlockedStories}
            readStories={readStories}
          />
        )}
        {screen === 'lar' && <LarScreen coins={coins} onSpendCoins={spendCoins} />}
      </div>

      {currentGameConfig && (
        <GameOverlay
          config={currentGameConfig}
          onClose={() => setCurrentGameConfig(null)}
          onWin={handleWinGame}
        />
      )}

      {currentStory && (
        <StoryOverlay
          story={currentStory}
          onClose={() => setCurrentStory(null)}
        />
      )}

      {/* Victory Modal */}
      {showVictoryModal && (
        <VictoryModal
          coins={victoryCoins}
          onClaim={handleClaimReward}
          storyUnlocked={storyUnlocked}
        />
      )}

      {/* Streak Bonus Modal */}
      {showStreakBonus && (
        <StreakBonusModal
          streak={streak}
          bonusAmount={streakBonusAmount}
          onClose={handleCloseStreakBonus}
        />
      )}

      {/* Flying Stars */}
      {flyingStars.map(star => (
        <FlyingStar
          key={star.id}
          startPos={star.startPos}
          endPos={star.endPos}
          onComplete={() => {}}
        />
      ))}

      {/* NAVIGATION - Game HUD Style */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex items-center justify-around z-40 px-4 py-3 border-t-4 border-gray-100">
        <button
          onClick={() => setScreen('checkin')}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            screen === 'checkin'
              ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_8px_25px_rgba(251,146,60,0.6)] scale-125 -translate-y-6 border-b-4 border-orange-700'
              : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
          }`}
        >
           <Home size={screen === 'checkin' ? 28 : 24} strokeWidth={3} />
           <span className={`text-[10px] font-black uppercase tracking-widest ${screen === 'checkin' ? 'text-white' : 'text-slate-500'}`}>HOJE</span>
        </button>

        <button
          onClick={() => setScreen('map')}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            screen === 'map'
              ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_8px_25px_rgba(59,130,246,0.6)] scale-125 -translate-y-6 border-b-4 border-blue-700'
              : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
          }`}
        >
           <Map size={screen === 'map' ? 28 : 24} strokeWidth={3} />
           <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${screen === 'map' ? 'text-white' : 'text-slate-500'}`}>MAPA</span>
        </button>

        <button
          onClick={() => setScreen('lar')}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            screen === 'lar'
              ? 'bg-gradient-to-b from-pink-400 to-pink-600 text-white shadow-[0_8px_25px_rgba(244,114,182,0.6)] scale-125 -translate-y-6 border-b-4 border-pink-700'
              : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
          }`}
        >
           <Heart size={screen === 'lar' ? 28 : 24} strokeWidth={3} fill={screen === 'lar' ? 'currentColor' : 'none'} />
           <span className={`text-[10px] font-black uppercase tracking-widest ${screen === 'lar' ? 'text-white' : 'text-slate-500'}`}>LAR</span>
        </button>
      </div>
    </div>
  );
}
