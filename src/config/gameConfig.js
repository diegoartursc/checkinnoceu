import {
    Anchor, Sprout, Book, Heart, Smile, Flame, Sun, Crown, Music, Gift, Shield, Star,
    Leaf, Snowflake, Flower, ThermometerSun, Cross, Users
} from 'lucide-react';

export const GAME_TYPES = {
    MEMORY: 'memory',
    CATCHER: 'catcher',
    QUIZ: 'quiz',
    HARVEST: 'harvest',
    WARMUP: 'warmup',
    SEQUENCE: 'sequence',
    REVEAL: 'reveal'
};

export const MONTHS_CONFIG = [
    {
        name: 'Janeiro', days: 31, icon: Anchor, label: "O Início", color: "text-blue-500", bg: "bg-blue-100",
        desc: "A grande viagem da Arca!",
        specialDates: [
            { day: 6, label: "Dia de Reis", color: "shadow-[0_0_15px_#fbbf24] border-yellow-300 bg-yellow-100 text-yellow-700", icon: Star, message: "Os Reis Magos seguiram a estrela até encontrar o menino Jesus!" }
        ],
        gameType: GAME_TYPES.MEMORY,
        gameData: { title: "Pares da Arca", items: ["🦁", "🦁", "🐘", "🐘", "🦒", "🦒", "🕊️", "🕊️"] }
    },
    {
        name: 'Fevereiro', days: 28, icon: Sprout, label: "Crescimento", color: "text-green-500", bg: "bg-green-100",
        desc: "Semeando o bem.",
        specialDates: [],
        gameType: GAME_TYPES.CATCHER,
        gameData: { title: "Chuva de Sementes", target: "🌱", avoid: "🪨" }
    },
    {
        name: 'Março', days: 31, icon: Book, label: "Sabedoria", color: "text-indigo-500", bg: "bg-indigo-100",
        desc: "Aprenda com Salomão.",
        specialDates: [],
        gameType: GAME_TYPES.QUIZ,
        gameData: { title: "Quiz Sábio", question: "Quem foi o rei mais sábio?", options: ["Davi", "Salomão", "Saul"], answer: 1 },
        seasonEvent: {
            id: "autumn_season", name: "Chegada do Outono", icon: Leaf, color: "text-orange-900", bg: "bg-orange-100", desc: "Colha os frutos bons!",
            gameType: GAME_TYPES.HARVEST, gameData: { title: "Grande Colheita", target: "🍎", bad: "🐛" }
        }
    },
    {
        name: 'Abril', days: 30, icon: Heart, label: "Páscoa", color: "text-red-500", bg: "bg-red-100",
        desc: "O amor vivo!",
        specialDates: [
            { day: 9, label: "Páscoa", color: "shadow-[0_0_20px_#e9d5ff] border-purple-200 bg-white text-purple-600 animate-pulse", icon: Cross, message: "A vida venceu! O túmulo está vazio e Jesus está vivo!" }
        ],
        gameType: GAME_TYPES.CATCHER,
        gameData: { title: "Colheita de Amor", target: "❤️", avoid: "🌵" }
    },
    {
        name: 'Maio', days: 31, icon: Smile, label: "Família", color: "text-pink-500", bg: "bg-pink-100",
        desc: "Honra teu lar.",
        specialDates: [
            { day: 28, label: "Pentecostes", color: "shadow-[0_0_20px_#ef4444] border-red-400 bg-orange-500 text-white animate-pulse", icon: Flame, message: "O Espírito Santo desceu como línguas de fogo para nos encher de coragem!" }
        ],
        gameType: GAME_TYPES.MEMORY,
        gameData: { title: "Memória da Família", items: ["👨‍👩‍👧", "👨‍👩‍👧", "🏠", "🏠", "🐕", "🐕", "👵", "👵"] }
    },
    {
        name: 'Junho', days: 30, icon: Flame, label: "Coragem", color: "text-orange-500", bg: "bg-orange-100",
        desc: "Daniel e os Leões.",
        specialDates: [],
        gameType: GAME_TYPES.QUIZ,
        gameData: { title: "Teste de Coragem", question: "Onde Daniel foi jogado?", options: ["No fogo", "Nos leões", "No mar"], answer: 1 },
        seasonEvent: {
            id: "winter_season", name: "Chegada do Inverno", icon: Snowflake, color: "text-sky-700", bg: "bg-sky-100", desc: "Não deixe o fogo apagar!",
            gameType: GAME_TYPES.WARMUP, gameData: { title: "Mantenha o Calor", icon: "🔥" }
        }
    },
    {
        name: 'Julho', days: 31, icon: Sun, label: "Férias", color: "text-yellow-500", bg: "bg-yellow-100",
        desc: "Luz do Mundo.",
        specialDates: [],
        gameType: GAME_TYPES.CATCHER,
        gameData: { title: "Pegue a Luz", target: "☀️", avoid: "☁️" }
    },
    {
        name: 'Agosto', days: 31, icon: Crown, label: "Reis", color: "text-purple-500", bg: "bg-purple-100",
        desc: "Davi e Golias.",
        specialDates: [],
        gameType: GAME_TYPES.QUIZ,
        gameData: { title: "Davi vs Golias", question: "O que Davi usou?", options: ["Espada", "Pedra", "Lança"], answer: 1 }
    },
    {
        name: 'Setembro', days: 30, icon: Music, label: "Louvor", color: "text-teal-500", bg: "bg-teal-100",
        desc: "Cante ao Senhor.",
        specialDates: [],
        gameType: GAME_TYPES.MEMORY,
        gameData: { title: "Sons do Céu", items: ["🎺", "🎺", "🎸", "🎸", "🥁", "🥁", "🎵", "🎵"] },
        seasonEvent: {
            id: "spring_season", name: "Chegada da Primavera", icon: Flower, color: "text-pink-600", bg: "bg-pink-100", desc: "Repita a canção!",
            gameType: GAME_TYPES.SEQUENCE, gameData: { title: "Jardim Cantante", items: ["🌸", "🌹", "🌻", "🌷"] }
        }
    },
    {
        name: 'Outubro', days: 31, icon: Gift, label: "Crianças", color: "text-cyan-500", bg: "bg-cyan-100",
        desc: "Pequeninos.",
        specialDates: [],
        gameType: GAME_TYPES.CATCHER,
        gameData: { title: "Chuva de Presentes", target: "🎁", avoid: "🕷️" }
    },
    {
        name: 'Novembro', days: 30, icon: Shield, label: "Gratidão", color: "text-amber-600", bg: "bg-amber-100",
        desc: "Agradeça sempre.",
        specialDates: [
            { day: 1, label: "Todos os Santos", color: "shadow-[0_0_15px_#60a5fa] border-blue-300 bg-blue-100 text-blue-700", icon: Users, message: "Lembramos de todos os amigos de Deus que já estão brilhando no céu!" }
        ],
        gameType: GAME_TYPES.QUIZ,
        gameData: { title: "Gratidão", question: "Quantos leprosos voltaram?", options: ["10", "1", "5"], answer: 1 }
    },
    {
        name: 'Dezembro', days: 31, icon: Star, label: "Natal", color: "text-yellow-400", bg: "bg-yellow-100",
        desc: "Nasceu Jesus!",
        specialDates: [
            { day: 25, label: "NATAL", color: "shadow-[0_0_30px_#facc15] border-yellow-300 bg-yellow-100 text-yellow-800 animate-bounce", icon: Star, message: "Nasceu o Salvador! Hoje é dia de alegria para todo o mundo!" }
        ],
        gameType: GAME_TYPES.MEMORY,
        gameData: { title: "Noite de Natal", items: ["👶", "👶", "⭐", "⭐", "🐪", "🐪", "🎁", "🎁"] },
        seasonEvent: {
            id: "summer_season", name: "Chegada do Verão", icon: ThermometerSun, color: "text-amber-600", bg: "bg-amber-100", desc: "Limpe as nuvens!",
            gameType: GAME_TYPES.REVEAL, gameData: { title: "Céu Limpo", icon: "☀️" }
        }
    }
];
