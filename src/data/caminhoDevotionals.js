export const CAMINHO_DEVOS = {
  1: {
    title: "O começo da viagem",
    message: "Hoje lembramos que Deus caminha com você em cada passo.",
    question: "O que você quer levar no coração hoje?",
    options: ["Coragem", "Gratidão", "Alegria"],
  },
  2: {
    title: "Um coração agradecido",
    message: "Agradecer faz o nosso dia brilhar mais forte!",
    question: "Pelo que você é grato hoje?",
    options: ["Minha família", "Meus amigos", "Meu lar"],
  },
  3: {
    title: "Amizade verdadeira",
    message: "Jesus é nosso melhor amigo e está sempre por perto.",
    question: "Como você pode ser um bom amigo hoje?",
    options: ["Ouvindo", "Ajudando", "Sorrindo"],
  },
  4: {
    title: "Criando o mundo",
    message: "Deus fez tudo com muito amor, inclusive você!",
    question: "Qual a sua criação favorita de Deus?",
    options: ["O mar", "Os animais", "O céu"],
  },
  5: {
    title: "Sendo gentil",
    message: "Um gesto de carinho pode mudar o dia de alguém.",
    question: "O que você pode fazer por alguém hoje?",
    options: ["Dar um abraço", "Elogiar", "Dividir brinquedo"],
  },
  6: {
    title: "Coragem de Davi",
    message: "Mesmo pequeno, Davi enfrentou o gigante com fé.",
    question: "O que te dá coragem?",
    options: ["Orar", "Cantar", "Ler a Bíblia"],
  },
  7: {
    title: "A alegria do perdão",
    message: "Perdoar nos deixa leves como uma pena.",
    question: "Como você se sente quando perdoa?",
    options: ["Feliz", "Leve", "Em paz"],
  },
  8: {
    title: "A luz do mundo",
    message: "Você é como uma estrelinha que brilha no mundo.",
    question: "Como você pode brilhar hoje?",
    options: ["Sendo obediente", "Sendo gentil", "Sendo honesto"],
  },
  9: {
    title: "O amor de Deus",
    message: "O amor de Deus é maior que o mar e mais alto que o céu.",
    question: "Quem mais ama você?",
    options: ["Papai/Mamãe", "Avós", "Jesus"],
  },
  10: {
    title: "Falando com Deus",
    message: "Orar é conversar com Deus como conversamos com um amigo.",
    question: "Sobre o que você quer falar com Deus?",
    options: ["Meu dia", "Meus sonhos", "Meus medos"],
  }
};

export const getCaminhoDevotional = (dayNumber) => {
  if (CAMINHO_DEVOS[dayNumber]) {
    return CAMINHO_DEVOS[dayNumber];
  }

  // Fallback genérico para dias sem entrada específica
  return {
    title: "Caminho da Luz",
    message: "Hoje é mais um passo especial. Deus ama muito você.",
    question: "Qual dessas coisas você quer praticar hoje?",
    options: ["Gentileza", "Perdão", "Gratidão"]
  };
};
