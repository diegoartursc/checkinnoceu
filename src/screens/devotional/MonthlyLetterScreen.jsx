import React, { memo, useState, useMemo } from 'react';
import { Music, Heart } from 'lucide-react';
import Button from '../../components/ui/Button';

// Cartinha de Jesus - Mensal
const MonthlyLetterScreen = memo(({ monthNumber, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const letters = useMemo(() => [
    {
      month: 1,
      title: "Janeiro - Novos Começos",
      emoji: "🌱",
      message: "Querida criança, que alegria começar este ano novo com você! Assim como plantamos sementes no jardim, você está plantando sementes de amor e bondade em seu coração. Continue sendo luz para o mundo! Eu estou sempre com você. Com carinho, Jesus 💚"
    },
    {
      month: 2,
      title: "Fevereiro - Amor",
      emoji: "❤️",
      message: "Criança especial, neste mês do amor, quero que saiba que você é muito amada! Cada sorriso seu alegra o céu. Continue espalhando amor por onde passar, ajudando seus amigos e sendo gentil. Você faz o mundo melhor! Com muito amor, Jesus 💖"
    },
    {
      month: 3,
      title: "Março - Coragem",
      emoji: "🦁",
      message: "Minha criança corajosa, você tem sido tão valente! Mesmo quando as coisas parecem difíceis, você não desiste. Lembre-se: eu dei a você um coração forte e cheio de luz. Continue firme, pequeno guerreiro da luz! Com orgulho, Jesus 💪"
    },
    {
      month: 4,
      title: "Abril - Gratidão",
      emoji: "🙏",
      message: "Querida criança, tenho visto como você agradece pelas pequenas coisas. Que coração grato o seu! A gratidão faz nossa vida brilhar como o sol. Continue sendo grato e verá como tudo fica mais bonito. Muito obrigado por ser você! Com gratidão, Jesus 🌻"
    },
    {
      month: 5,
      title: "Maio - Generosidade",
      emoji: "🎁",
      message: "Criança generosa, como é lindo ver você compartilhando! Quando dividimos o que temos, multiplicamos a alegria. Você tem um coração tão grande quanto o céu! Continue sendo generoso, que isso traz muita luz para sua vida. Com admiração, Jesus 💝"
    },
    {
      month: 6,
      title: "Junho - Alegria",
      emoji: "😊",
      message: "Minha criança alegre, seu sorriso ilumina o mundo! A alegria que está em você é um presente especial. Continue rindo, brincando e fazendo outros sorrirem também. Sua felicidade é música para meus ouvidos! Com alegria, Jesus 🎵"
    },
    {
      month: 7,
      title: "Julho - Perdão",
      emoji: "🕊️",
      message: "Querida criança, que coração bondoso você tem! Perdoar não é fácil, mas você tem feito isso com muito amor. Quando perdoamos, nossa alma fica leve como uma pena. Continue sendo essa criança do bem! Com ternura, Jesus 🤍"
    },
    {
      month: 8,
      title: "Agosto - Paciência",
      emoji: "🌸",
      message: "Criança paciente, você está aprendendo a esperar com calma! Assim como a flor leva tempo para crescer, você também está crescendo em sabedoria. Continue sendo paciente, que as melhores coisas valem a espera. Com paciência, Jesus 🌺"
    },
    {
      month: 9,
      title: "Setembro - Sabedoria",
      emoji: "📖",
      message: "Minha criança sábia, como você tem aprendido tanto! Cada dia você fica mais inteligente e bondoso. A verdadeira sabedoria vem do coração. Continue aprendendo e crescendo! Com sabedoria, Jesus 🦉"
    },
    {
      month: 10,
      title: "Outubro - Fé",
      emoji: "⭐",
      message: "Querida criança, sua fé ilumina como uma estrela! Mesmo quando não pode me ver, você acredita em mim. Isso é tão especial! Continue confiando, que eu nunca deixo você sozinho. Com fé, Jesus ✨"
    },
    {
      month: 11,
      title: "Novembro - Amizade",
      emoji: "👫",
      message: "Criança amiga, você tem sido um(a) amigo(a) maravilhoso(a)! Cuidar dos amigos, brincar junto, ajudar quando precisam... você faz tudo com amor! Continue sendo essa luz para seus amigos. Com amizade, Jesus 🤗"
    },
    {
      month: 12,
      title: "Dezembro - Esperança",
      emoji: "🎄",
      message: "Minha criança querida, que ano incrível você teve! Cresceu tanto em amor, bondade e fé! Este mês celebramos a esperança e a luz que você trouxe ao mundo. Estou muito orgulhoso de você! Continue brilhando sempre! Com todo meu amor, Jesus 🌟"
    }
  ], []);

  const currentLetter = letters[monthNumber - 1] || letters[0];

  const handlePlayAudio = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl max-w-lg w-full p-8 shadow-2xl border-4 border-yellow-300 relative animate-in zoom-in slide-in-from-bottom-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
        >
          ✕
        </button>

        {/* Letter content */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-4 animate-bounce-slow">
            {currentLetter.emoji}
          </div>
          <h2 className="text-2xl font-black text-orange-900 mb-2">
            Cartinha de Jesus 💌
          </h2>
          <h3 className="text-lg font-bold text-orange-700">
            {currentLetter.title}
          </h3>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto rounded-full mt-2" />
        </div>

        {/* Letter paper */}
        <div className="bg-white rounded-2xl p-6 shadow-inner border-2 border-yellow-200 mb-6 relative">
          {/* Paper lines decoration */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border-b border-gray-300" style={{ marginTop: `${i * 40}px` }} />
            ))}
          </div>

          <p className="text-gray-800 text-base leading-relaxed font-medium relative z-10 text-left">
            {currentLetter.message}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="warning"
            size="md"
            onClick={handlePlayAudio}
            icon={Music}
            disabled={isPlaying}
            className="w-full"
          >
            {isPlaying ? 'Tocando...' : 'Ouvir Cartinha 🎵'}
          </Button>

          <Button
            variant="success"
            size="md"
            onClick={onClose}
            icon={Heart}
            className="w-full"
          >
            Guardar no Coração 💝
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 text-4xl opacity-20 pointer-events-none">✨</div>
        <div className="absolute top-0 right-0 text-4xl opacity-20 pointer-events-none">✨</div>
        <div className="absolute bottom-0 left-0 text-4xl opacity-20 pointer-events-none">💛</div>
        <div className="absolute bottom-0 right-0 text-4xl opacity-20 pointer-events-none">💛</div>
      </div>
    </div>
  );
});

MonthlyLetterScreen.displayName = 'MonthlyLetterScreen';

export default MonthlyLetterScreen;
