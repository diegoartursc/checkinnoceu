# Guia de Arquitetura

Este projeto segue uma arquitetura modular baseada em funcionalidades (Feature-based), facilitando a escalabilidade e manutenção.

## Estrutura de Diretórios

### `src/features/`
Contém a lógica de negócio e componentes específicos de cada "grande área" do aplicativo.
-   **`checkin/`**: Tela principal do dia, lógica de mensagem diária e jogos rápidos.
-   **`map/`**: O caminho de progresso (mapa de fases), nós dos dias, decorações.
-   **`pet/`**: O sistema de Tamagotchi/Lar, alimentação e interação com o pet.
-   **`devotional/`**: O fluxo de oração, gratidão e boa ação.

### `src/components/`
Componentes compartilhados e agnósticos à funcionalidade específica.
-   **`ui/`**: Componentes visuais puros (Button, Card, Badge, Loading). Não dependem de estado global.
-   **`modals/`**: Modais que podem ser chamados de vários lugares (VictoryModal, DailyModal).
-   **`games/`**: A lógica dos mini-games (Memory, Quiz, etc.). Eles recebem props e devolvem eventos (`onWin`), sem saber quem os chamou.

### `src/contexts/`
Gerenciamento de estado global.
-   **`UserContext`**: "Fonte da Verdade". Guarda Moedas, Progresso (dia atual), Streak, Pet e Dados persistidos.
-   **`NavigationContext`**: Gerencia qual "tela" (Feature) está visível, permitindo transições animadas.

### `src/services/`
-   **`storage.js`**: Camada de isolamento para o `localStorage`. Nenhuma outra parte do app deve chamar `localStorage` diretamente. Inclui validação de dados para evitar crashes com dados corrompidos.

### `src/lib/` & `src/utils/`
-   **`utils.js`**: Utilitários de UI (`cn` para classes Tailwind).
-   **`dateUtils.js`**: Manipulação de datas.
-   **`contentGenerator.js`**: Lógica para determinar o conteúdo (versículo, mensagem) do dia de forma determinística.

## Fluxo de Dados
1.  O `UserContext` carrega dados do `storage.js` ao iniciar.
2.  Componentes (`features`) consomem dados via `useUser()`.
3.  Ações (completar dia, ganhar moedas) chamam funções do contexto (`completeDay()`, `addCoins()`).
4.  O contexto atualiza o estado React e salva no `storage.js` automaticamente.

## Convenções
-   **Componentes**: PascalCase (`Button.jsx`).
-   **Hooks**: camelCase com prefixo use (`useUser.js`).
-   **Estilos**: Tailwind CSS utility-first. Evite CSS puro a menos que seja para animações complexas.
-   **Mobile**: Sempre teste pensando em telas pequenas (width 100%, overflow hidden no body, auto no content).
