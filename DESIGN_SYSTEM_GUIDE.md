# Design System Guide

## Visão Geral
O Design System do "CheckInNoCeu" foca em uma estética lúdica, vibrante e acessível para crianças ("Fazendinha Premium" / "Candy Crush Style").

## Cores Principais

### Primárias (Ações)
-   **Azul (Primary)**: `from-blue-400 to-blue-600` (Botões padrão, navegação)
-   **Verde (Success)**: `from-green-400 to-green-600` (Concluir, confirmar, positivo)
-   **Laranja (Warning)**: `from-orange-400 to-orange-600` (Destaque, atenção, jogar)
-   **Vermelho (Danger)**: `from-red-400 to-red-600` (Cancelar, erro)

### Especiais
-   **Dourado (Gold)**: `from-yellow-300 to-yellow-500` (Recompensas, VIP, Especial)
-   **Rosa (Love)**: `from-pink-400 to-pink-600` (Afeto, Pet, Família)

## Tipografia
-   **Fonte Principal**: `Nunito` (ou sans-serif arredondada do sistema).
-   **Títulos**: Bold/Black, Uppercase, Tracking-widest.
-   **Corpo**: Medium/Bold para legibilidade infantil.

## Componentes

### Botão 3D (`Button.jsx`)
O botão principal do sistema. Possui profundidade visual (borda inferior espessa) e feedback de clique (animação de "apertar").

**Variantes:**
-   `primary`, `success`, `warning`, `danger`, `secondary`, `gold`.

**Tamanhos:**
-   `sm` (Pequeno), `md` (Médio - Padrão), `lg` (Grande), `xl` (Extra Grande).

**Exemplo de Uso:**
```jsx
<Button variant="success" size="lg" icon={Play} onClick={handlePlay}>
  JOGAR
</Button>
```

### Card / Containers
-   **Bordas**: `rounded-2xl` ou `rounded-3xl` (Cantos muito arredondados).
-   **Sombras**: `shadow-xl`, `shadow-2xl` para efeito flutuante.
-   **Bordas**: `border-4` com cores claras/brancas para efeito de "adesivo" ou "carta".

### Animações
-   **Bounce**: Para chamar atenção (`animate-bounce`).
-   **Pulse**: Para elementos aguardando ação (`animate-pulse`).
-   **Spin Slow**: Para elementos de fundo (Sol, raios).

## Layout
-   **Mobile First**: Todo o design é pensado primeiro para telas verticais.
-   **Safe Area**: O conteúdo principal deve evitar as bordas extremas (padding `p-4` ou `p-6`).
-   **Scroll**: O container principal deve ter `overflow-y-auto` e `min-h-full`.
