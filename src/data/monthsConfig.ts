// src/data/monthsConfig.ts
import {
  Anchor, Star, Hammer, CloudRain,
  Sprout, ArrowUp, Heart, Book, Lightbulb, Crown,
  Leaf, Cross, Sun, Cloud, BookOpen, Users, Smile,
  AlertCircle, Shield, Flame, Snowflake, Trophy, Music, Zap,
  Flower, Gift, CheckCircle, ThermometerSun, Home
} from 'lucide-react';
import { GAME_TYPES } from './gameTypes';

export const MONTHS_CONFIG = [
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
