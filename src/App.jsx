import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback, memo } from 'react';
import {
  Play, Map, Home, Star, CheckCircle, ArrowRight, Smile,
  Sun, Cloud, X, ArrowUp, Gift, Heart, Music, Anchor,
  Book, Crown, Sprout, Flame, Zap, Shield, Trophy, Lock, BookOpen,
  Snowflake, Leaf, Flower, ThermometerSun, AlertCircle, Lightbulb,
  CloudRain, Hammer, Users, Wind, Cross, Clock, Gamepad2
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

const Button = memo(({ children, onClick, color = "bg-blue-500", className = "", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} ${className} text-white font-bold py-3 px-6 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all transform hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
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
            <button onClick={onClick} className={`relative w-40 sm:w-48 py-3 sm:py-4 rounded-2xl shadow-2xl border-4 flex items-center justify-center gap-2 sm:gap-3 transition-all transform active:scale-95 hover:scale-105 hover:-translate-y-1 ${buttonStyle}`}>
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

  // Feed pet with fruit
  const feedPet = useCallback((fruit) => {
    if (coins < fruit.cost) {
      addFloatingText('⭐ Insuficiente!', 'text-red-500');
      return;
    }

    onSpendCoins(fruit.cost);
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + fruit.hunger),
      lastUpdate: Date.now()
    }));

    addFloatingText(`-${fruit.cost} ⭐`, 'text-yellow-500');
    setTimeout(() => addFloatingText(`+${fruit.hunger} 🍽️`, 'text-green-500'), 200);
  }, [coins, onSpendCoins, addFloatingText]);

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

    onSpendCoins(10);
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      energy: Math.max(0, prev.energy - 10),
      lastUpdate: Date.now()
    }));

    addFloatingText('-10 ⭐', 'text-yellow-500');
    setTimeout(() => addFloatingText('+30 😊', 'text-pink-500'), 200);
  }, [coins, pet.energy, onSpendCoins, addFloatingText]);

  // Pet sleep (free action)
  const petSleep = useCallback(() => {
    setPet(prev => ({
      ...prev,
      energy: 100,
      lastUpdate: Date.now()
    }));

    addFloatingText('+100 ⚡', 'text-blue-500');
  }, [addFloatingText]);

  // Determine pet mood
  const getPetMood = useCallback(() => {
    const avg = (pet.hunger + pet.happiness + pet.energy) / 3;
    if (avg > 70) return { emoji: '😊', mood: 'Muito Feliz!', color: 'text-green-500' };
    if (avg > 40) return { emoji: '😐', mood: 'Ok', color: 'text-yellow-600' };
    return { emoji: '😢', mood: 'Precisa de cuidados!', color: 'text-red-500' };
  }, [pet.hunger, pet.happiness, pet.energy]);

  const mood = getPetMood();

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-b from-amber-100 via-green-50 to-sky-100">
      <CloudBackground />

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

        {/* Pet Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border-2 border-pink-200 relative overflow-hidden">
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
          <div className="text-center mb-4">
            <div className="text-8xl mb-2 animate-bounce">
              {pet.type === 'ovelhinha' ? '🐑' : pet.type === 'leao' ? '🦁' : '🕊️'}
            </div>
            <div className="text-4xl mb-1">{mood.emoji}</div>
            <p className="font-bold text-gray-700 text-lg">{pet.name}</p>
            <p className={`text-sm font-bold ${mood.color}`}>{mood.mood}</p>
          </div>

          {/* Status Bars */}
          <div className="space-y-3">
            {/* Hunger */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>🍽️ Fome</span>
                <span>{pet.hunger}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                  style={{ width: `${pet.hunger}%` }}
                />
              </div>
            </div>

            {/* Happiness */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>😊 Alegria</span>
                <span>{pet.happiness}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
                  style={{ width: `${pet.happiness}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>⚡ Energia</span>
                <span>{pet.energy}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500"
                  style={{ width: `${pet.energy}%` }}
                />
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
                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-green-200 transition-all ${
                  coins < fruit.cost
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105 active:scale-95 hover:shadow-xl'
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
              className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-pink-200 transition-all ${
                coins < 10 || pet.energy < 10
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95 hover:shadow-xl'
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
              className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-2 border-blue-200 transition-all ${
                pet.energy === 100
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95 hover:shadow-xl'
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
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_0_8px_rgba(74,222,128,0.3)] animate-bounce">
          <CheckCircle size={64} className="text-white sm:w-20 sm:h-20" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-md">Dia Completado!</h2>
        <p className="text-white/90 text-base sm:text-lg mb-8">Volte amanhã para mais luz!</p>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-md border border-white/30 text-white shadow-lg">
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
          <Button onClick={() => setStep(1)} color="bg-orange-500 w-full text-lg sm:text-xl shadow-orange-700">
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
          <Button onClick={() => setStep(2)} color="bg-green-500 w-full shadow-green-700">
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
                 className={`w-full p-3 sm:p-4 rounded-xl font-bold text-left transition-all border-b-4 text-sm sm:text-base ${
                   quizSelected === opt.id
                     ? (opt.correct ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700')
                     : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
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
                 color={isQuizCorrect ? "bg-green-500 w-full shadow-green-700" : "bg-gray-400 w-full cursor-not-allowed"}
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

// Optimized: Memoize individual day component
const DayNode = memo(({ dayNum, month, isCurrentDay, specialDate, onSpecialClick, monthIndex }) => {
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
    <div className="relative flex justify-center z-10">
      <div
        onClick={() => specialDate && !isPast && onSpecialClick(specialDate)}
        className={`
            w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 border-2
            ${isCurrentDay
                ? 'bg-yellow-400 border-white scale-125 sm:scale-150 shadow-[0_0_25px_#facc15] z-20 animate-pulse'
                : isPast
                    ? 'bg-slate-700/60 border-slate-600 text-slate-500 opacity-40 scale-90 grayscale'
                    : specialDate
                        ? `${neonStyle} cursor-pointer hover:scale-125 shadow-lg`
                        : 'bg-blue-500 border-blue-300 text-white shadow-lg hover:scale-110'
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

              <div className="grid grid-cols-5 gap-y-2 gap-x-2 sm:gap-y-3 sm:gap-x-3 max-w-[200px] sm:max-w-[240px] mx-auto relative">
                <div className="absolute inset-0 border-l-2 border-r-2 border-dashed border-white/10 rounded-3xl pointer-events-none"></div>
                {daysInThisMonth.map((dayNum) => {
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
                      />
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
  }, []);

  const handleDayComplete = useCallback(() => {
    const newDay = lastCompletedDay + 1;
    setLastCompletedDay(newDay);
    setIsCompletedToday(true);
    localStorage.setItem('checkin_day', newDay.toString());

    const newCoins = coins + 10;
    setCoins(newCoins);
    localStorage.setItem('checkin_coins', newCoins.toString());

    setTimeout(() => setScreen('map'), 2000);
  }, [lastCompletedDay, coins]);

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
    addCoins(50);

    const storyIdToUnlock = currentGameConfig?.story?.id || currentGameConfig?.seasonEvent?.story?.id;

    if (storyIdToUnlock && !unlockedStories.includes(storyIdToUnlock)) {
        setUnlockedStories(prev => {
          const newStories = [...prev, storyIdToUnlock];
          localStorage.setItem('checkin_stories', JSON.stringify(newStories));
          return newStories;
        });
        setTimeout(() => alert(`Nova História Desbloqueada!`), 500);
    }

    setTimeout(() => setCurrentGameConfig(null), 1000);
  }, [addCoins, currentGameConfig, unlockedStories]);

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
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/10 shadow-lg">
           <Star className="fill-yellow-400 text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
           <span className="text-white font-bold text-xs">{coins}</span>
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

      {/* NAVIGATION */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 h-14 sm:h-16 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-around z-40 px-2 border border-white/50">
        <button
          onClick={() => setScreen('checkin')}
          className={`flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 ${
            screen === 'checkin'
              ? 'bg-sky-100 text-sky-600 -translate-y-2 sm:-translate-y-3 shadow-lg scale-110'
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
           <Home size={20} strokeWidth={screen === 'checkin' ? 3 : 2.5} className="sm:w-5 sm:h-5" />
           <span className="text-[9px] font-black mt-1 uppercase">Hoje</span>
        </button>
        <div className="w-px h-6 bg-gray-200"></div>
        <button
          onClick={() => setScreen('map')}
          className={`flex flex-col items-center justify-center min-w-10 sm:min-w-12 h-10 sm:h-12 px-2 rounded-xl transition-all duration-300 ${
            screen === 'map'
              ? 'bg-indigo-100 text-indigo-600 -translate-y-2 sm:-translate-y-3 shadow-lg scale-110'
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
           <Map size={20} strokeWidth={screen === 'map' ? 3 : 2.5} className="sm:w-5 sm:h-5" />
           <span className="text-[9px] font-black mt-1 uppercase whitespace-nowrap">Caminho</span>
        </button>
        <div className="w-px h-6 bg-gray-200"></div>
        <button
          onClick={() => setScreen('lar')}
          className={`flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 ${
            screen === 'lar'
              ? 'bg-pink-100 text-pink-600 -translate-y-2 sm:-translate-y-3 shadow-lg scale-110'
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
           <Heart size={20} strokeWidth={screen === 'lar' ? 3 : 2.5} className="sm:w-5 sm:h-5" fill={screen === 'lar' ? 'currentColor' : 'none'} />
           <span className="text-[9px] font-black mt-1 uppercase">Lar</span>
        </button>
      </div>
    </div>
  );
}
