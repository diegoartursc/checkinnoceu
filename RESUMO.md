# Resumo da Reestruturação de Arquitetura (Fase 1)

O projeto passou por uma reestruturação arquitetural significativa para melhorar a modularidade, escalabilidade e manutenção. A antiga estrutura baseada em `features` e múltiplos contextos foi substituída por uma arquitetura mais limpa e centralizada.

## 📁 Nova Estrutura de Diretórios

A estrutura de pastas foi simplificada para refletir melhor as camadas da aplicação:

*   **`src/app/`**: Contém o componente principal da aplicação.
    *   `CheckInApp.jsx`: Orquestrador principal das telas, transições e lógica global (antigo `AppContent.jsx`).
*   **`src/context/`**: Gerenciamento de estado global.
    *   `AppStateContext.jsx`: Único contexto centralizado que substitui `UserContext` e `NavigationContext`.
*   **`src/screens/`**: Contém as telas principais da aplicação.
    *   `CheckInScreen.jsx`: Tela de check-in diário.
    *   `MapScreen.jsx`: Tela do mapa de progresso.
    *   `LarScreen.jsx`: Tela do pet/lar.
    *   `devotional/`: Subpasta para as telas do fluxo devocional.
*   **`src/components/`**: Componentes reutilizáveis.
    *   `ui/`: Componentes genéricos de UI (Botões, etc.).
    *   `map/`: Componentes específicos da tela de Mapa (DayNode, DynamicRoadPath, etc.).
*   **`src/hooks/`**: Custom hooks.
    *   `useNavigation.js`: Helper hook para facilitar a navegação.
*   **`src/services/`**: Lógica de negócios e serviços externos (Storage).

## 🧠 AppStateContext

O novo `AppStateContext` consolida todo o estado da aplicação que antes estava disperso. Ele gerencia:

1.  **Navegação**: Estado da tela atual (`screen`).
2.  **Progresso do Usuário**: `coins`, `streak`, `lastCompletedDay`, `completedDays`, `pet`.
3.  **Estado de UI Global**: Modais (`dailyModal`, `showVictoryModal`), configurações de jogo (`currentGameConfig`), e estado de desbloqueio de histórias.
4.  **Devocional**: Estado de conclusão e passos do devocional diário.

Isso elimina a necessidade de `UserContext` e `NavigationContext` separados, simplificando a árvore de componentes e o fluxo de dados.

## 🧭 Navegação

A navegação agora é feita através do hook `useNavigation()`, que abstrai o acesso ao `AppStateContext`.

**Como usar:**

```javascript
import { useNavigation } from '../hooks/useNavigation';

const MyComponent = () => {
  const { screen, navigate, goToCheckIn, goToMap, goToLar } = useNavigation();

  return (
    <button onClick={goToMap}>Ir para o Mapa</button>
  );
};
```

## 🔄 Fluxo de Execução

1.  **`src/App.jsx`**: Ponto de entrada. Envolve a aplicação com `AppStateProvider` e renderiza `CheckInApp`.
2.  **`src/app/CheckInApp.jsx`**:
    *   Consome `useAppState` para obter dados e estados.
    *   Gerencia a lógica de renderização condicional das telas (`CheckInScreen`, `MapScreen`, `LarScreen`) com transições.
    *   Gerencia a exibição de modais globais e overlays.
3.  **Telas**: Cada tela foca apenas em sua apresentação e interação local, delegando ações globais (como completar dia ou ganhar moedas) para as funções disponibilizadas pelo contexto.
