# Resumo do Projeto

## Onboarding Inicial

O projeto conta com um fluxo de Onboarding executado na primeira vez que o usuário abre o aplicativo.

### Fluxo

1.  **WelcomeScreen**: Boas-vindas com mensagem introdutória sobre o Caminho da Luz.
2.  **ChooseMascotScreen**: Seleção do mascote inicial.
    *   Opções: Cordeirinho da Luz (🐑) e Anjinho Guardião (😇).
    *   Ao selecionar, o estado do pet é inicializado no `UserContext` com valores altos de felicidade/energia.
3.  **OnboardingSummaryScreen**: Confirmação e explicação breve da rotina diária (Oração, Gratidão, Ação).

### Controle de Estado

*   **Flag**: `hasCompletedOnboarding` (boolean) no `UserContext`.
*   **Persistência**: Salvo no LocalStorage com a chave `onboarding_complete`.
*   **Lógica de Exibição**:
    *   Ao iniciar o app (`AppContent`), verificamos `hasCompletedOnboarding`.
    *   Se `false` → Exibe o fluxo de Onboarding.
    *   Se `true` → Segue para o fluxo normal (Devocional diário ou Mapa).

### Mascotes

Os mascotes disponíveis no onboarding são limitados para simplificar a escolha inicial, mas o sistema suporta outros tipos (como Leão e Pomba) para uso futuro. A definição dos tipos de pets agora reside em `src/constants/pets.js`.
