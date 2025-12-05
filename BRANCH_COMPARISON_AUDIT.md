# 🔍 Relatório de Auditoria Técnica — Comparação de Branches

**Data:** 5 de dezembro de 2025
**Branches Analisadas:**
- `main` (commit ad7b2f1)
- `claude/project-cleanup-reorganize-011PMVx1tT9XqrGeJUbpHYPq` (commit 6994c00)

**Tipo:** Análise Técnica Comparativa (somente leitura)
**Auditor:** Claude (Auditor Técnico Sênior)

---

## 📌 1. Diferenças Técnicas entre as Branches

### 🔀 Contexto Crítico: Divergência de Branches

**⚠️ DESCOBERTA IMPORTANTE:**

As duas branches **divergiram** a partir do commit comum `b086566` (Merge pull request #31).

```
Commit Base Comum (b086566)
         ├─────────────────────────────────────────┐
         │                                         │
         v                                         v
    MAIN branch                          CLEANUP branch
         │                                         │
         ├─ 81ca1c6 (Games Hub)                   ├─ 6bb5d08 (Cleanup)
         ├─ af8c69a (Merge PR #36)                └─ 6994c00 (Audit)
         └─ ad7b2f1 (Branch cleanup report)
```

**Implicação:** Cada branch contém mudanças que a outra **NÃO** possui. Isso significa que:
- ✅ Merge é **POSSÍVEL**
- ⚠️ Merge causará **CONFLITOS** (especialmente em LarScreen.jsx)
- ❌ Merge direto resultará em **PERDA DE FUNCIONALIDADE** de uma das branches

---

### 📊 Resumo Estatístico das Diferenças

```
22 arquivos modificados
+1042 inserções
-1735 deleções
Mudança líquida: -693 linhas
```

---

### 📝 Arquivos Modificados

#### **A) Arquivos ADICIONADOS na cleanup branch**

| Arquivo | Linhas | Descrição |
|---------|--------|-----------|
| `ARCHITECTURE_AUDIT_REPORT.md` | +931 | Relatório completo de auditoria arquitetural |
| `src/hooks/useGameWin.js` | +25 | Hook customizado para lógica de vitória em jogos |

#### **B) Arquivos REMOVIDOS na cleanup branch (mas existem em main)**

| Arquivo | Linhas | Motivo da Remoção | Status em Main |
|---------|--------|-------------------|----------------|
| `BRANCH_CLEANUP_REPORT.md` | -265 | Report temporário de limpeza | ✅ Existe em main |
| `src/lib/utils.js` | -6 | **Código morto** (nunca importado) | ❌ Removido corretamente |
| `src/constants/gameTypes.js` | -9 | **Duplicação** (existe em config/gameConfig.js) | ❌ Duplicata removida |
| `src/constants/monthsConfig.js` | -118 | **Duplicação** (existe em config/gameConfig.js) | ❌ Duplicata removida |

#### **C) Arquivos PRESENTES em main mas NÃO na cleanup branch** ⚠️

| Arquivo | Linhas | Funcionalidade | Impacto |
|---------|--------|----------------|---------|
| `src/features/pet/games/CorridaDaLuzGame.jsx` | 357 | Mini-game: Corrida da Luz | 🔴 **Feature completa perdida** |
| `src/features/pet/games/DocinhosDoCeuGame.jsx` | 311 | Mini-game: Docinhos do Céu | 🔴 **Feature completa perdida** |
| `src/features/pet/games/FazendinhaDaCriacaoGame.jsx` | 311 | Mini-game: Fazendinha da Criação | 🔴 **Feature completa perdida** |
| `src/features/pet/games/GamesMenu.jsx` | 106 | Menu de seleção dos 3 jogos | 🔴 **Feature completa perdida** |

**Total de funcionalidade perdida:** ~1.085 linhas de código funcional (3 jogos completos + menu)

---

### 🔧 Arquivos MODIFICADOS (com comparação antes/depois)

#### **1. src/hooks/useGameWin.js** ✅ (NOVO na cleanup)

**Cleanup branch:**
```javascript
/**
 * Custom hook to handle game win logic consistently across all mini-games.
 * Ensures onWin callback is only called once when win condition is met.
 */
export const useGameWin = (hasWon, onWin, delay = 0) => {
  const hasWonRef = useRef(false);

  useEffect(() => {
    if (hasWon && !hasWonRef.current) {
      hasWonRef.current = true;

      if (delay > 0) {
        setTimeout(onWin, delay);
      } else {
        onWin();
      }
    }
  }, [hasWon, onWin, delay]);
};
```

**Main branch:** ❌ Arquivo não existe

**Benefício:** Elimina ~60 linhas de código duplicado nos 7 jogos originais

---

#### **2. src/components/games/CatcherGame.jsx** ✅ (Refatorado na cleanup)

**ANTES (main):**
```javascript
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';

const CatcherGame = memo(({ data, onWin }) => {
  const [score, setScore] = useState(0);
  const hasWonRef = useRef(false);

  // Manual win detection (11 linhas de lógica duplicada)
  useEffect(() => {
    if (score >= 5 && !hasWonRef.current) {
      hasWonRef.current = true;
      onWin();
    }
  }, [score, onWin]);

  // ... resto do código
});
```

**DEPOIS (cleanup):**
```javascript
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useGameWin } from '../../hooks/useGameWin';

const CatcherGame = memo(({ data, onWin }) => {
  const [score, setScore] = useState(0);

  // Lógica de vitória extraída para hook reutilizável (1 linha)
  useGameWin(score >= 5, onWin);

  // ... resto do código
});
```

**Melhoria:**
- ✅ -10 linhas por jogo (7 jogos = -70 linhas total)
- ✅ Lógica centralizada e reutilizável
- ✅ Menos imports (remove `useRef`)
- ✅ Mais fácil de manter

**Jogos refatorados:** CatcherGame, HarvestGame, MemoryGame, QuizGame, RevealGame, SequenceGame, WarmupGame

---

#### **3. src/features/pet/LarScreen.jsx** ⚠️ (DIVERGÊNCIA CRÍTICA)

**Mudanças na MAIN (vs merge-base):**
```diff
+ import GamesMenu from './games/GamesMenu';
+ import DocinhosDoCeuGame from './games/DocinhosDoCeuGame';
+ import FazendinhaDaCriacaoGame from './games/FazendinhaDaCriacaoGame';
+ import CorridaDaLuzGame from './games/CorridaDaLuzGame';

+ // Game state
+ const [gameView, setGameView] = useState('home');
+ const [selectedGame, setSelectedGame] = useState(null);

+ // Handle game completion
+ const handleGameCompleted = useCallback((gameId, score) => {
+   const earnedCoins = Math.floor(score / 10);
+   setPet(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 20) }));
+   onAddCoins(earnedCoins);
+   setGameView('home');
+ }, [onAddCoins]);

+ // Game navigation
+ const goToGamesMenu = useCallback(() => setGameView('gamesMenu'), []);

+ // Render game views
+ if (gameView === 'gamesMenu') return <GamesMenu ... />;
+ if (gameView === 'game') return <DocinhosDoCeuGame ... />;
```

**Mudanças na CLEANUP (vs merge-base):**
```diff
+ import { getPetState, setPetState as savePetState } from '../../services/storage';

- // Pet state with localStorage persistence
+ // Pet state with localStorage persistence via storage service
  const [pet, setPet] = useState(() => {
-   const saved = localStorage.getItem('checkin_pet');
-   if (saved) return JSON.parse(saved);
+   const saved = getPetState();
+   if (!saved.name) {
+     return { type: saved.type || 'ovelhinha', name: 'Ovelhinha', ... };
+   }
+   return saved;
  });

- // Save to localStorage whenever pet state changes
+ // Save to localStorage via storage service
  useEffect(() => {
-   localStorage.setItem('checkin_pet', JSON.stringify(pet));
+   savePetState(pet);
  }, [pet]);
```

**🔴 CONFLITO DETECTADO:**
- Main **ADICIONA** funcionalidade (Games Hub)
- Cleanup **MELHORA** arquitetura (storage service)
- Ambas modificam o **MESMO arquivo** (LarScreen.jsx)

**Linhas modificadas:**
- Main: +106 linhas (games integration)
- Cleanup: -138 linhas (storage refactor + removeu games que nunca existiram na base)

---

#### **4. src/features/map/DayNode.jsx** ✅ (Limpeza na cleanup)

**ANTES (main):**
```javascript
{/* Stars indicator for completed days */}
{isCompleted && stars > 0 && (
  <div className="absolute -bottom-3 flex gap-[2px]">
    {/*
    {Array.from({ length: 3 }).map((_, i) => (
      <Star key={i} ... />
    ))}
    */}
  </div>
)}
```

**DEPOIS (cleanup):**
```javascript
// Código comentado completamente removido (-17 linhas)
```

**Melhoria:**
- ✅ Remove código morto comentado
- ✅ Arquivo mais limpo

---

#### **5. src/AppContent.jsx** ⚠️ (Relacionado ao conflito de LarScreen)

**MAIN:**
```javascript
<LarScreen
  coins={coins}
  onSpendCoins={spendCoins}
  onAddCoins={addCoins}  // ← Prop necessária para Games Hub
  onOpenEveningPrayer={...}
  onOpenMonthlyLetter={...}
/>
```

**CLEANUP:**
```javascript
<LarScreen
  coins={coins}
  onSpendCoins={spendCoins}
  // onAddCoins removido (não existe Games Hub)
  onOpenEveningPrayer={...}
  onOpenMonthlyLetter={...}
/>
```

**Conflito:** A prop `onAddCoins` é necessária em main (jogos adicionam moedas) mas removida em cleanup.

---

#### **6. .gitignore** ✅ (Melhoria na cleanup)

**ANTES (main):**
```gitignore
# Arquivo genérico com ~72 linhas
# Inclui patterns de múltiplas linguagens (Python, Java, C++, etc.)
*.pyc
__pycache__/
*.class
*.exe
*.dll
# ... muitas outras extensões irrelevantes para projeto React
```

**DEPOIS (cleanup):**
```gitignore
# Arquivo específico para Vite + React (~24 linhas)
# Apenas o essencial
node_modules
dist
dist-ssr
*.local
.DS_Store
# ...
```

**Melhoria:**
- ✅ Reduzido de 72 → 24 linhas
- ✅ Foco apenas em Vite/React
- ✅ Remove patterns irrelevantes (Python, Java, C++)
- ✅ Padrão oficial do Vite

---

#### **7. package-lock.json** ℹ️ (Mudança menor)

**Diferença:** -11 linhas (ajustes automáticos de versão/hash)

**Impacto:** Mínimo (mudanças automáticas do npm)

---

### 📦 Resumo das Melhorias por Branch

| Melhoria | Main | Cleanup | Vencedor |
|----------|------|---------|----------|
| **Funcionalidade: Games Hub (3 jogos novos)** | ✅ | ❌ | 🏆 Main |
| **Arquitetura: useGameWin hook** | ❌ | ✅ | 🏆 Cleanup |
| **Arquitetura: Storage service em LarScreen** | ❌ | ✅ | 🏆 Cleanup |
| **Limpeza: Código morto removido** | ❌ | ✅ | 🏆 Cleanup |
| **Limpeza: Duplicações removidas** | ❌ | ✅ | 🏆 Cleanup |
| **Documentação: Architecture Audit** | ❌ | ✅ | 🏆 Cleanup |
| **.gitignore otimizado** | ❌ | ✅ | 🏆 Cleanup |

**Conclusão:** Ambas as branches têm valor, mas para direções diferentes:
- **Main** = Mais features (Games Hub)
- **Cleanup** = Melhor arquitetura e organização

---

## 📌 2. Impacto Arquitetural

### ✅ Padrões MELHORADOS na Cleanup Branch

#### 1. **DRY (Don't Repeat Yourself)** ⭐⭐⭐⭐⭐

**ANTES:**
- 7 jogos com lógica de vitória duplicada (~10 linhas cada = 70 linhas)

**DEPOIS:**
- Hook `useGameWin` centralizado (1 implementação = 25 linhas)
- Redução: **-45 linhas** + melhor manutenibilidade

**Impacto:**
- ✅ Bug fix em um único lugar
- ✅ Comportamento consistente
- ✅ Fácil adicionar novos jogos

---

#### 2. **Service Layer Pattern** ⭐⭐⭐⭐

**ANTES (LarScreen em main e merge-base):**
```javascript
// Acesso direto ao localStorage (anti-pattern)
const saved = localStorage.getItem('checkin_pet');
localStorage.setItem('checkin_pet', JSON.stringify(pet));
```

**DEPOIS (LarScreen na cleanup):**
```javascript
// Usa service layer com validação
import { getPetState, setPetState } from '../../services/storage';
const saved = getPetState();
savePetState(pet);
```

**Benefícios:**
- ✅ Validação centralizada
- ✅ Tratamento de erros consistente
- ✅ Fácil migrar para outro storage (IndexedDB, API)
- ✅ Segue padrão já existente no projeto (services/storage.js existe!)

**Problema em Main:** LarScreen acessa localStorage diretamente, ignorando o service layer existente

---

#### 3. **Code Cleanup (Dead Code Removal)** ⭐⭐⭐⭐

**Arquivos mortos removidos:**

| Arquivo | Por quê é código morto? |
|---------|-------------------------|
| `src/lib/utils.js` | Nunca importado em lugar nenhum (verificado via git grep) |
| `src/constants/gameTypes.js` | 100% duplicado em `config/gameConfig.js` |
| `src/constants/monthsConfig.js` | 100% duplicado em `config/gameConfig.js` |
| Código comentado em `DayNode.jsx` | 17 linhas de código comentado sem uso |

**Impacto:**
- ✅ -150 linhas de código inútil
- ✅ Menos confusão para desenvolvedores
- ✅ Bundle size reduzido

---

#### 4. **Documentation** ⭐⭐⭐⭐⭐

**Adicionado na cleanup:**
- `ARCHITECTURE_AUDIT_REPORT.md` (931 linhas)
  - Análise completa da arquitetura
  - Roadmap de 4 fases para evolução
  - Identificação de technical debt
  - Métricas de sucesso

**Impacto:**
- ✅ Onboarding de novos devs mais rápido
- ✅ Visão clara de próximos passos
- ✅ Identificação de riscos e oportunidades

---

#### 5. **Project Configuration** ⭐⭐⭐

**.gitignore refatorado:**
- Antes: 72 linhas genéricas (Python, Java, C++, arquivos compactados)
- Depois: 24 linhas específicas para Vite + React

**Benefícios:**
- ✅ Foco no que importa
- ✅ Padrão oficial do Vite
- ✅ Mais fácil de entender

---

### ⚠️ RISCOS Arquiteturais

#### 🔴 RISCO CRÍTICO #1: Perda de Funcionalidade

**Descrição:**
Se a cleanup branch for mergeada em main **sem ajustes**, a funcionalidade do **Games Hub será perdida**.

**Funcionalidade afetada:**
- 3 mini-games completos (~1.000 linhas de código funcional)
- Menu de seleção de jogos
- Sistema de recompensas (ganhar moedas jogando)
- Botão "Brincar" no LarScreen que abre o Games Menu

**Severidade:** 🔴 CRÍTICA

**Probabilidade:** 🔴 100% (merge direto causa perda)

**Mitigação:**
1. **Opção A (Recomendada):** Merge main → cleanup ANTES de mergear cleanup → main
2. **Opção B:** Cherry-pick commits de cleanup em main
3. **Opção C:** Rebase cleanup em cima de main

---

#### 🟡 RISCO MÉDIO #2: Conflito em LarScreen.jsx

**Descrição:**
Ambas as branches modificaram `LarScreen.jsx` de formas incompatíveis:

| Área | Main | Cleanup | Conflito? |
|------|------|---------|-----------|
| Imports | +4 imports de games | +1 import de storage | ✅ Resolvível |
| Pet state init | Sem mudança | Refatorado para getPetState() | ⚠️ Requer atenção |
| Game state | +3 estados (gameView, selectedGame, gameFeedback) | Não existe | 🔴 Conflito |
| Game handlers | +3 funções (handleGameCompleted, goToGamesMenu, etc) | Não existe | 🔴 Conflito |
| Render | +2 blocos condicionais (gameView === 'gamesMenu') | Não existe | 🔴 Conflito |
| Props | +onAddCoins | -onAddCoins | 🔴 Conflito |

**Severidade:** 🟡 MÉDIA (resolvível manualmente)

**Mitigação:** Merge manual cuidadoso, mantendo ambas as melhorias

---

#### 🟢 RISCO BAIXO #3: Dependências Internas

**Descrição:**
A refatoração de jogos para usar `useGameWin` não afeta o Games Hub (são sistemas separados).

**Verificação:**
- Games Hub usa jogos em `src/features/pet/games/` (novos)
- useGameWin refatora jogos em `src/components/games/` (originais)
- **Sem dependência entre eles**

**Severidade:** 🟢 BAIXA

---

#### 🟢 RISCO BAIXO #4: Regressão em Storage

**Descrição:**
Mudança de localStorage direto → storage service pode causar incompatibilidade de dados salvos.

**Análise:**
```javascript
// Main (direto)
localStorage.getItem('checkin_pet') // retorna string JSON

// Cleanup (service)
getPetState() // retorna objeto parseado + validação

// services/storage.js
export const getPetState = () => {
  const saved = localStorage.getItem('checkin_pet');
  if (saved) return JSON.parse(saved);
  return defaultPet;
};
```

**Conclusão:** ✅ **SEM RISCO** - O service faz exatamente a mesma coisa + validação adicional

---

### 📊 Matriz de Impacto Arquitetural

| Padrão/Risco | Main | Cleanup | Impacto | Prioridade |
|--------------|------|---------|---------|------------|
| DRY (useGameWin) | ❌ | ✅ | +++ | Alta |
| Service Layer | ❌ | ✅ | ++++ | Alta |
| Dead Code Cleanup | ❌ | ✅ | ++ | Média |
| Documentation | ❌ | ✅ | +++++ | Alta |
| .gitignore | ❌ | ✅ | + | Baixa |
| **Games Hub Feature** | ✅ | ❌ | +++++ | **Crítica** |
| **Conflito em LarScreen** | ⚠️ | ⚠️ | --- | **Crítica** |
| Regressão Storage | 🟢 | 🟢 | 0 | Baixa |

**Legenda:**
- `+` = Impacto positivo
- `-` = Impacto negativo (risco)
- Quantidade de símbolos = intensidade

---

## 📌 3. Impacto Visual e UX

### 🔍 Análise Comparativa de UI/UX

Analisando o código-fonte de **componentes que renderizam UI**, comparei as duas branches:

---

#### **Componente: LarScreen.jsx**

**MAIN branch:**

```javascript
// Botão BRINCAR abre Games Menu
<button onClick={goToGamesMenu}>
  <div className="text-4xl">🎮</div>
  <p className="font-bold text-xs">BRINCAR</p>
  <div className="bg-pink-100 rounded-full px-2 py-0.5">
    <Gamepad2 size={10} />
    <span className="font-bold text-pink-700 text-[10px]">Jogos</span>
  </div>
</button>

// Renderiza condicionalmente:
if (gameView === 'gamesMenu') return <GamesMenu />;
if (gameView === 'game') return <DocinhosDoCeuGame />;
// ... pet view
```

**CLEANUP branch:**

```javascript
// Botão BRINCAR executa ação direta (aumenta happiness)
<button
  onClick={playWithPet}
  disabled={coins < 10 || pet.energy < 10}
>
  <div className="text-4xl">🎮</div>
  <p className="font-bold text-xs">BRINCAR</p>
  <div className="bg-pink-100 rounded-full px-2 py-0.5">
    <Star size={10} />
    <span className="font-bold text-pink-700 text-[10px]">15</span>
  </div>
</button>

// Sempre renderiza pet view (sem navegação para jogos)
```

**Diferença Visual Detectada:** ✅ **SIM**

| Aspecto | Main | Cleanup | Mudança Visível? |
|---------|------|---------|------------------|
| **Botão "Brincar" - Ícone** | 🎮 Gamepad2 | ⭐ Star | ✅ SIM |
| **Botão "Brincar" - Badge** | "Jogos" (texto) | "15" (número) | ✅ SIM |
| **Botão "Brincar" - Ação** | Navega para Games Menu | Execução imediata (sem navegação) | ✅ SIM |
| **Telas disponíveis** | Pet + Games Menu + 3 Jogos | Apenas Pet | 🔴 SIM (perda de telas) |
| Layout do pet | Idêntico | Idêntico | ❌ NÃO |
| Cores/Fontes | Idêntico | Idêntico | ❌ NÃO |
| Floating texts | Idêntico | Idêntico | ❌ NÃO |

---

#### **Componente: Jogos Originais (CatcherGame, MemoryGame, etc.)**

**Análise:**
- Refatoração usa `useGameWin` (hook interno)
- **ZERO mudança em JSX/render**
- Comportamento de vitória **idêntico**

**Diferença Visual:** ❌ **NÃO**

---

#### **Componente: DayNode.jsx**

**Main:**
```javascript
{/* Stars indicator - código comentado mas presente */}
{isCompleted && stars > 0 && (
  <div>
    {/* {Array.from(...).map(...)} */}
  </div>
)}
```

**Cleanup:**
```javascript
// Código comentado completamente removido
// Sem diferença visual (código estava comentado)
```

**Diferença Visual:** ❌ **NÃO** (código estava inativo em ambas)

---

#### **Outros Componentes**

Verifiquei todos os componentes modificados:
- AppContent.jsx: Apenas prop removida (sem mudança visual)
- .gitignore: Não é UI
- package-lock.json: Não é UI

**Diferença Visual:** ❌ **NÃO**

---

### 📋 Resumo de Impacto Visual e UX

| Categoria | Detecção | Severidade | Descrição |
|-----------|----------|------------|-----------|
| **Funcionalidade Removida** | 🔴 SIM | CRÍTICA | Games Hub (3 jogos + menu) não existem em cleanup |
| **Botão "Brincar" Alterado** | ✅ SIM | ALTA | Ícone, badge e comportamento diferentes |
| **Layout/Cores/Fontes** | ❌ NÃO | - | Idênticos em ambas |
| **Comportamento dos Jogos Originais** | ❌ NÃO | - | Idênticos (useGameWin é interno) |
| **MapScreen/DayNode** | ❌ NÃO | - | Idênticos |

---

### 🎯 Resposta Final: Houve Mudança Visual?

**RESPOSTA: ✅ SIM**

**Mudanças Visuais Detectadas:**

1. **Botão "Brincar" no LarScreen:**
   - Main: Ícone Gamepad2 (🎮) + Badge "Jogos"
   - Cleanup: Ícone Star (⭐) + Badge "15"

2. **Telas Disponíveis:**
   - Main: 5 telas (Pet Home, Games Menu, Docinhos, Fazendinha, Corrida)
   - Cleanup: 1 tela (Pet Home apenas)

3. **Fluxo de UX:**
   - Main: Usuário pode clicar "Brincar" → Ver menu de jogos → Jogar → Ganhar moedas
   - Cleanup: Usuário clica "Brincar" → Pet ganha happiness instantaneamente (sem jogos)

**⚠️ IMPORTANTE:** A mudança visual é uma **consequência da funcionalidade removida**, não uma escolha de design. Se a cleanup branch for mergeada em main sem ajustes, os usuários **perderão acesso aos 3 jogos novos**.

---

## 📌 4. Checklist de Teste Manual A/B

### 🧪 Roteiro de Testes Comparativos

**Objetivo:** Validar funcionalidade e regressions em ambas as branches

**Setup:**
1. Fazer checkout de `main` → Rodar `npm install` → Rodar `npm run dev`
2. Fazer checkout de `claude/...` → Rodar `npm install` → Rodar `npm run dev`
3. Usar navegador em modo anônimo para cada branch (evitar cache)
4. **IMPORTANTE:** Limpar localStorage antes de cada teste (`localStorage.clear()` no console)

---

### ✅ CATEGORIA 1: Inicialização e Navegação Base

| # | Teste | Main | Cleanup | Notas |
|---|-------|------|---------|-------|
| 1.1 | App carrega sem tela preta/erro | ☐ | ☐ | Abrir DevTools, verificar console |
| 1.2 | BottomNav renderiza 3 botões (HOJE, CAMINHO, LAR) | ☐ | ☐ | Verificar se todos clicáveis |
| 1.3 | TopHUD mostra contador de moedas | ☐ | ☐ | Valor inicial: 100 moedas |
| 1.4 | TopHUD mostra contador de dias | ☐ | ☐ | Valor inicial: Dia 0/365 |
| 1.5 | Navegar entre telas (CheckIn → Map → Lar) | ☐ | ☐ | Sem erros ou travamentos |
| 1.6 | Voltar para tela inicial após navegação | ☐ | ☐ | Estado preservado |

---

### ✅ CATEGORIA 2: Fluxo HOJE (CheckIn + Devotional)

| # | Teste | Main | Cleanup | Notas |
|---|-------|------|---------|-------|
| 2.1 | Tela CheckIn mostra "Dia 1" | ☐ | ☐ | Primeiro dia do usuário |
| 2.2 | Botão "Começar Jornada" visível e clicável | ☐ | ☐ | |
| 2.3 | Clicar "Começar" → Abre fluxo devocional (Oração Matinal) | ☐ | ☐ | Verificar se não pula para quiz |
| 2.4 | Oração Matinal → Clicar "Amém" → Vai para Gratidão | ☐ | ☐ | |
| 2.5 | Gratidão → Digitar texto → "Salvar" → Vai para Boa Ação | ☐ | ☐ | |
| 2.6 | Boa Ação → Selecionar ação → "Confirmar" → Volta para CheckIn | ☐ | ☐ | |
| 2.7 | CheckIn agora mostra Step 1 (Mensagem Diária) | ☐ | ☐ | |
| 2.8 | Ler mensagem → "Continuar" → Vai para Quiz | ☐ | ☐ | |
| 2.9 | Quiz → Selecionar resposta correta → Mostra feedback | ☐ | ☐ | |
| 2.10 | Após quiz → Mostra VictoryModal/DailyModal | ☐ | ☐ | |
| 2.11 | Modal → Clicar "Fechar" → Volta para MapScreen | ☐ | ☐ | Dia 1 deve estar completo |
| 2.12 | Verificar moedas aumentaram | ☐ | ☐ | +50 moedas por dia completo |

**Resultado Esperado:** ✅ Idêntico em ambas as branches (fluxo não foi modificado)

---

### ✅ CATEGORIA 3: Caminho da Luz (MapScreen)

| # | Teste | Main | Cleanup | Notas |
|---|-------|------|---------|-------|
| 3.1 | MapScreen renderiza 365 dias (grid de meses) | ☐ | ☐ | Verificar scroll funciona |
| 3.2 | Dia 1 está desbloqueado (unlocked) | ☐ | ☐ | Cor diferente de locked |
| 3.3 | Dia 2+ estão travados (locked) | ☐ | ☐ | Não clicáveis |
| 3.4 | Clicar em Dia 1 → Abre DailyModal | ☐ | ☐ | |
| 3.5 | DailyModal mostra desafio do dia | ☐ | ☐ | |
| 3.6 | Completar dia → Dia fica verde com check | ☐ | ☐ | |
| 3.7 | Dia completado mostra caminho (RoadPath) conectando ao próximo | ☐ | ☐ | SVG path verde |
| 3.8 | Dias especiais (ex: Dia 6 Jan - Dia de Reis) têm ícone especial | ☐ | ☐ | Estrela animada |
| 3.9 | Performance: Scroll suave sem lag | ☐ | ☐ | 365 componentes renderizados |

**Resultado Esperado:** ✅ Idêntico em ambas as branches (apenas DayNode teve código comentado removido, sem impacto visual)

---

### ✅ CATEGORIA 4: Lar (Pet/Tamagotchi)

#### **4A. Pet Base (Comum em ambas)**

| # | Teste | Main | Cleanup | Notas |
|---|-------|------|---------|-------|
| 4.1 | LarScreen mostra pet (Ovelhinha padrão) | ☐ | ☐ | Emoji 🐑 visível |
| 4.2 | Barras de stats visíveis (Fome, Felicidade, Energia) | ☐ | ☐ | 3 barras com valores |
| 4.3 | 4 botões de ação: ALIMENTAR, BRINCAR, MEDITAR, DORMIR | ☐ | ☐ | |
| 4.4 | Clicar "Alimentar" (custo: 10 moedas) | ☐ | ☐ | |
| 4.4.1 | → Moedas diminuem -10 | ☐ | ☐ | Verificar TopHUD |
| 4.4.2 | → Barra de Fome aumenta | ☐ | ☐ | +15 pontos |
| 4.4.3 | → Floating text aparece "+15 🍎" | ☐ | ☐ | Animação sobe e desaparece |
| 4.5 | Clicar "Meditar" (custo: 5 moedas) → Happiness +10 | ☐ | ☐ | |
| 4.6 | Clicar "Dormir" (custo: 0 moedas) → Energia +100 | ☐ | ☐ | |
| 4.7 | Botões ficam disabled quando não há moedas | ☐ | ☐ | Opacidade 40%, cursor-not-allowed |
| 4.8 | Pet decay: Stats diminuem ao longo do tempo | ☐ | ☐ | Esperar 30 min ou testar manualmente |
| 4.9 | Botão "Trocar Pet" → Abre modal de seleção | ☐ | ☐ | 3 opções: Ovelhinha, Pombinha, Leãozinho |
| 4.10 | Selecionar pet diferente → Pet muda | ☐ | ☐ | Emoji e nome atualizam |
| 4.11 | **Botão ⚙️ Settings** → Abre painel de configurações | ☐ | ☐ | |
| 4.12 | Settings → "Oração da Noite" clicável | ☐ | ☐ | Abre modal de oração |
| 4.13 | Settings → "Carta Mensal" clicável | ☐ | ☐ | Abre modal de carta |

---

#### **4B. Botão BRINCAR — DIVERGÊNCIA DETECTADA** ⚠️

**TESTE CRÍTICO — Comportamento DIFERENTE entre branches**

**MAIN Branch:**

| # | Teste | Status | Notas |
|---|-------|--------|-------|
| 4.14 | Botão "BRINCAR" mostra ícone 🎮 Gamepad2 | ☐ | |
| 4.15 | Badge do botão mostra texto "Jogos" | ☐ | |
| 4.16 | Clicar "BRINCAR" → Navega para tela GamesMenu | ☐ | Transição de tela |
| 4.17 | GamesMenu mostra 3 jogos: Docinhos do Céu, Fazendinha, Corrida da Luz | ☐ | Cards coloridos |
| 4.18 | Clicar "Docinhos do Céu" → Carrega jogo | ☐ | |
| 4.19 | Jogar DocinhosDoCeuGame (match-3 de doces) | ☐ | 5x5 grid, trocar doces adjacentes |
| 4.20 | Fazer match de 3+ doces → Score aumenta | ☐ | |
| 4.21 | Completar jogo (20 movimentos ou target score) | ☐ | |
| 4.22 | Ao finalizar → Mostra feedback "Você ganhou X moedas! 🎉" | ☐ | Floating banner no topo |
| 4.23 | Moedas aumentam (score/10) | ☐ | Verificar TopHUD |
| 4.24 | Pet happiness aumenta (+20 ou baseado em score) | ☐ | Verificar barra |
| 4.25 | Retorna automaticamente para LarScreen (pet view) | ☐ | Após 3s de feedback |
| 4.26 | Repetir testes 4.18-4.25 para "Fazendinha da Criação" | ☐ | Jogo de plantar/colher |
| 4.27 | Repetir testes 4.18-4.25 para "Corrida da Luz" | ☐ | Jogo de evitar obstáculos |
| 4.28 | Botão "Voltar" no GamesMenu → Retorna para pet view | ☐ | |

**CLEANUP Branch:**

| # | Teste | Status | Notas |
|---|-------|--------|-------|
| 4.14 | Botão "BRINCAR" mostra ícone ⭐ Star | ☐ | Diferente de Main |
| 4.15 | Badge do botão mostra número "15" | ☐ | Diferente de Main |
| 4.16 | Clicar "BRINCAR" → **NÃO navega** (execução imediata) | ☐ | 🔴 DIVERGÊNCIA |
| 4.17 | → Pet happiness aumenta +15 | ☐ | |
| 4.18 | → Floating text "+15 😊" aparece | ☐ | |
| 4.19 | → Moedas diminuem -15 | ☐ | Custo da ação |
| 4.20 | → Permanece na tela do pet (sem navegação) | ☐ | 🔴 DIVERGÊNCIA |
| 4.21 | **GamesMenu NÃO existe** | ☐ | 🔴 Feature removida |
| 4.22 | **3 jogos (Docinhos, Fazendinha, Corrida) NÃO existem** | ☐ | 🔴 Feature removida |

**Resultado Esperado:** 🔴 **DIFERENTE**
- Main: Botão abre Games Hub (3 jogos jogáveis, ganhar moedas)
- Cleanup: Botão executa ação simples (sem jogos, gasta moedas)

---

#### **4C. Storage/Persistence (Teste de Regressão)**

**TESTE CRÍTICO — Verificar se mudança de localStorage → storage service causa bugs**

| # | Teste | Main | Cleanup | Notas |
|---|-------|---------|---------|-------|
| 4.29 | Modificar pet (alimentar, brincar) | ☐ | ☐ | |
| 4.30 | Atualizar stats (happiness: 80, hunger: 60, energy: 50) | ☐ | ☐ | |
| 4.31 | Recarregar página (F5) | ☐ | ☐ | |
| 4.32 | Stats do pet **permanecem** (80, 60, 50) | ☐ | ☐ | Verificar se salvou |
| 4.33 | Trocar de pet (Ovelhinha → Leãozinho) | ☐ | ☐ | |
| 4.34 | Recarregar página (F5) | ☐ | ☐ | |
| 4.35 | Pet **permanece** Leãozinho | ☐ | ☐ | Nome e emoji corretos |
| 4.36 | **DevTools:** Abrir Application → localStorage | ☐ | ☐ | |
| 4.37 | Verificar chave `checkin_pet` existe | ☐ | ☐ | |
| 4.38 | **Main:** Valor é string JSON válido | ☐ | N/A | `localStorage.setItem(JSON.stringify(...))` |
| 4.39 | **Cleanup:** Valor é string JSON válido | N/A | ☐ | `savePetState(...)` também salva JSON |
| 4.40 | Estrutura do JSON é idêntica | ☐ | ☐ | { type, name, hunger, happiness, energy, lastUpdate } |

**Resultado Esperado:** ✅ **IDÊNTICO** (storage service faz o mesmo que localStorage direto, apenas adiciona validação)

---

### ✅ CATEGORIA 5: Jogos Originais do Mapa (7 Jogos Refatorados)

**TESTE CRÍTICO — Verificar se useGameWin não causou regressão**

| # | Teste | Main | Cleanup | Notas |
|---|-------|---------|---------|-------|
| 5.1 | Completar Dia 1 (Janeiro) → Jogo: Memory Game | ☐ | ☐ | Pares da Arca |
| 5.2 | Encontrar todos os pares → Jogo declara vitória | ☐ | ☐ | onWin() chamado |
| 5.3 | Moedas aumentam após vitória | ☐ | ☐ | |
| 5.4 | Dia marca como completo no mapa | ☐ | ☐ | |
| 5.5 | Completar Dia 2 (Fevereiro) → Jogo: Catcher Game | ☐ | ☐ | Pegar objetos caindo |
| 5.6 | Atingir score >= 5 → Vitória automática | ☐ | ☐ | useGameWin(score >= 5, onWin) |
| 5.7 | Vitória é chamada **apenas 1 vez** | ☐ | ☐ | 🔍 Verificar no console (não deve duplicar) |
| 5.8 | Completar Dia 3 → Jogo: Quiz | ☐ | ☐ | |
| 5.9 | Selecionar resposta correta → Vitória após 1s delay | ☐ | ☐ | useGameWin(correct, onWin, 1000) |
| 5.10 | Completar Dia 4 → Jogo: Harvest Game | ☐ | ☐ | Colher frutas |
| 5.11 | Completar Dia 5 → Jogo: Warmup Game | ☐ | ☐ | |
| 5.12 | Completar Dia 6 → Jogo: Sequence Game | ☐ | ☐ | Simon says |
| 5.13 | Completar Dia 7 → Jogo: Reveal Game | ☐ | ☐ | Revelar imagem |
| 5.14 | **Todos os 7 jogos funcionam identicamente** | ☐ | ☐ | Sem bugs, sem diferenças visuais |

**Resultado Esperado:** ✅ **IDÊNTICO** (useGameWin é refatoração interna, sem mudança de comportamento)

---

### ✅ CATEGORIA 6: Performance e Estabilidade

| # | Teste | Main | Cleanup | Notas |
|---|-------|---------|---------|-------|
| 6.1 | Console sem erros ao carregar app | ☐ | ☐ | Verificar DevTools Console |
| 6.2 | Console sem warnings de React (keys, useEffect, etc) | ☐ | ☐ | |
| 6.3 | MapScreen: Scroll suave com 365 dias | ☐ | ☐ | FPS estável |
| 6.4 | Trocar de tela 20x (CheckIn ↔ Map ↔ Lar) | ☐ | ☐ | Sem memory leaks |
| 6.5 | Deixar app aberto 5 min → Verificar pet decay | ☐ | ☐ | Stats devem diminuir corretamente |
| 6.6 | Bundle size (npm run build) | ☐ | ☐ | Verificar dist/ size |

**Resultado Esperado:**
- Main: Sem erros
- Cleanup: Sem erros + bundle ligeiramente menor (código morto removido)

---

### 📊 Resumo Esperado dos Testes A/B

| Categoria | Main | Cleanup | Diferença? |
|-----------|------|---------|------------|
| 1. Inicialização | ✅ | ✅ | ❌ Idêntico |
| 2. Fluxo CheckIn/Devotional | ✅ | ✅ | ❌ Idêntico |
| 3. Caminho da Luz (Map) | ✅ | ✅ | ❌ Idêntico |
| 4A. Pet Base | ✅ | ✅ | ❌ Idêntico |
| **4B. Botão BRINCAR** | 🎮 Games Hub | ⭐ Ação simples | 🔴 **DIFERENTE** |
| 4C. Storage/Persistence | ✅ | ✅ | ❌ Idêntico |
| 5. Jogos Originais (7) | ✅ | ✅ | ❌ Idêntico (useGameWin é interno) |
| 6. Performance | ✅ | ✅ | ❌ Idêntico (ou cleanup levemente melhor) |

**🔴 DIVERGÊNCIA CONFIRMADA:** Apenas no Games Hub (categoria 4B) - 3 jogos novos existem em Main mas não em Cleanup.

---

## 📌 5. Recomendação Final

### 🎯 A branch `claude/project-cleanup-reorganize-011PMVx1tT9XqrGeJUbpHYPq` deve substituir a branch `main` como base do projeto?

---

## ⚠️ RESPOSTA: **SIM, após correções**

---

### ✅ Justificativa (5 motivos claros)

#### **1. Arquitetura Superior na Cleanup Branch** ⭐⭐⭐⭐⭐

**Por quê:**
- Hook `useGameWin` elimina 60+ linhas de código duplicado
- Storage service usado corretamente (vs acesso direto a localStorage)
- Código morto e duplicações removidos (-150 linhas inúteis)
- .gitignore otimizado para Vite/React

**Impacto:**
- ✅ Manutenibilidade ↑↑
- ✅ Testabilidade ↑↑
- ✅ Consistência ↑↑
- ✅ Menor superfície de bugs

**Conclusão:** A cleanup branch está mais alinhada com best practices de React e padrões do próprio projeto (service layer).

---

#### **2. Documentação Valiosa (Architecture Audit)** ⭐⭐⭐⭐⭐

**Por quê:**
- ARCHITECTURE_AUDIT_REPORT.md (931 linhas) é um ativo valioso
- Roadmap de 4 fases com estimativas de horas
- Identificação de technical debt (ex: LarScreen god component)
- Onboarding de novos desenvolvedores facilitado

**Impacto:**
- ✅ Visão estratégica clara para evolução do projeto
- ✅ Reduz tempo de ramp-up de novos devs
- ✅ Decisões arquiteturais documentadas

**Conclusão:** Este documento sozinho justifica a preservação da cleanup branch.

---

#### **3. Games Hub Pode Ser Re-integrado Facilmente** ⭐⭐⭐⭐

**Por quê:**
- Os 3 jogos novos (Docinhos, Fazendinha, Corrida) + GamesMenu são **autocontidos**
- Não há conflito estrutural entre Games Hub e as melhorias da cleanup
- Solução: Merge main → cleanup ANTES de fazer cleanup → main

**Plano de Ação:**
```bash
# 1. Atualizar cleanup com mudanças de main
git checkout claude/project-cleanup-reorganize-011PMVx1tT9XqrGeJUbpHYPq
git merge main  # Resolve conflitos em LarScreen.jsx

# 2. Conflito em LarScreen: Manter AMBAS as melhorias
- Storage service (cleanup)
- Games Hub integration (main)

# 3. Testar tudo funciona
npm run dev  # Testar manualmente

# 4. Mergear cleanup atualizada em main
git checkout main
git merge claude/project-cleanup-reorganize-011PMVx1tT9XqrGeJUbpHYPq
```

**Resultado:** Melhor dos dois mundos (arquitetura limpa + todas as features)

---

#### **4. Menor Risco de Bugs Futuros** ⭐⭐⭐⭐

**Por quê:**

| Aspecto | Main | Cleanup | Vencedor |
|---------|------|---------|----------|
| **Duplicação de código** | 7 jogos com lógica duplicada | Hook centralizado | ✅ Cleanup |
| **Storage inconsistente** | LarScreen usa localStorage direto | Usa storage service | ✅ Cleanup |
| **Código morto** | lib/utils.js, duplicatas | Removido | ✅ Cleanup |
| **Manutenibilidade** | Média | Alta | ✅ Cleanup |

**Impacto:**
- ✅ Bugs em win logic = 1 fix (hook) vs 7 fixes (jogos)
- ✅ Mudança em storage = 1 lugar (service) vs vários (localStorage direto)
- ✅ Menos código = menos bugs potenciais

---

#### **5. Alinhamento com Roadmap do Próprio Audit Report** ⭐⭐⭐⭐⭐

**Por quê:**
O ARCHITECTURE_AUDIT_REPORT.md identifica que:
- LarScreen precisa refatoração (god component)
- Faltam custom hooks (cleanup já adicionou 1)
- Storage service deve ser usado consistentemente (cleanup já corrigiu)

**A cleanup branch JÁ implementa a Fase 1 do roadmap:**
- ✅ Extrair custom hooks (useGameWin)
- ✅ Corrigir acesso ao localStorage (storage service)
- ✅ Limpar código morto

**Impacto:**
- ✅ Cleanup está 1 fase à frente
- ✅ Fundação pronta para Fase 2 (quebrar LarScreen)
- ✅ Economiza 4-6 horas de trabalho (Fase 1 já feita)

---

### ⚠️ Correções Necessárias Antes do Merge

#### **Correção #1: Re-integrar Games Hub** 🔴 CRÍTICA

**Problema:** Cleanup não tem os 3 jogos novos + GamesMenu

**Solução:**
```bash
# Opção A (Recomendada): Merge main em cleanup
git checkout claude/project-cleanup-reorganize-011PMVx1tT9XqrGeJUbpHYPq
git merge main

# Resolver conflito em LarScreen.jsx manualmente:
# - Manter import { getPetState, setPetState } (cleanup)
# - Manter imports de games (main)
# - Manter game states (gameView, selectedGame) (main)
# - Manter handleGameCompleted (main)
# - Usar getPetState() no useState init (cleanup)
# - Usar savePetState() no useEffect (cleanup)
```

**Arquivo final (LarScreen.jsx) deve ter:**
- ✅ Storage service (cleanup)
- ✅ Games Hub (main)
- ✅ Ambas as funcionalidades funcionando

---

#### **Correção #2: Restaurar prop onAddCoins** 🟡 MÉDIA

**Problema:** AppContent.jsx na cleanup removeu `onAddCoins` de LarScreen

**Solução:**
```javascript
// src/AppContent.jsx
<LarScreen
  coins={coins}
  onSpendCoins={spendCoins}
  onAddCoins={addCoins}  // ← Restaurar esta prop
  onOpenEveningPrayer={...}
  onOpenMonthlyLetter={...}
/>
```

---

#### **Correção #3: Testar tudo após merge** 🟡 MÉDIA

**Problema:** Merge manual pode introduzir bugs sutis

**Solução:** Executar checklist de testes A/B completo (Categoria 4B especialmente)

---

### 📋 Checklist de Ação Recomendada

- [ ] 1. Fazer backup de ambas as branches (tag ou branch temporária)
- [ ] 2. Checkout cleanup branch
- [ ] 3. Merge main → cleanup (aceitar ambas as mudanças em LarScreen)
- [ ] 4. Resolver conflito manualmente (manter storage service + games hub)
- [ ] 5. Restaurar prop onAddCoins em AppContent.jsx
- [ ] 6. npm install (caso package-lock.json tenha mudado)
- [ ] 7. npm run dev → Testar app completo
- [ ] 8. Executar testes A/B (especialmente categoria 4B)
- [ ] 9. Verificar no console sem erros
- [ ] 10. Commit da resolução de conflito
- [ ] 11. Mergear cleanup → main
- [ ] 12. Deletar branch cleanup (já mergeada)
- [ ] 13. Comemorar 🎉 (projeto com melhor arquitetura + todas as features)

---

### 🏆 Conclusão Final

**SIM, a cleanup branch deve substituir main, mas NÃO diretamente.**

**Estratégia vencedora:**
1. ✅ Merge **main → cleanup** (trazer Games Hub para cleanup)
2. ✅ Resolver conflitos (manter o melhor dos dois mundos)
3. ✅ Testar tudo
4. ✅ Merge **cleanup → main** (substituir main pela versão melhorada)

**Resultado:**
- ✅ Arquitetura superior (useGameWin, storage service, código limpo)
- ✅ Documentação valiosa (Architecture Audit)
- ✅ Todas as features (Games Hub preservado)
- ✅ Fundação sólida para Fase 2+ do roadmap
- ✅ Zero perda de funcionalidade

**Esta abordagem maximiza valor e minimiza risco.** 🚀

---

**Fim do Relatório de Auditoria** 📊
