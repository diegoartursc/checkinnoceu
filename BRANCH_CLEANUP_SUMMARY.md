# Relatório de Faxina de Branches — Check-in no Céu

## 1. Contexto

O projeto check-in no céu acumulou muitas branches antigas ao longo do desenvolvimento, resultante de features experimentais, refactors estruturais e testes de integração com IA. Essa acumulação criava confusão no histórico de versões e dificultava a manutenção e o onboarding de novos desenvolvedores.

Foi realizada uma **limpeza estrutural massiva** das branches remotas, consolidando todo o trabalho válido na branch `main` e preparando o projeto para uma nova fase de desenvolvimento com práticas mais disciplinadas. A branch `main` atual representa o código limpo e consolidado após o processo de cleanup.

A branch `main-old` foi mantida exclusivamente como **backup histórico**, preservando todo o contexto anterior caso seja necessário resgate de informações.

## 2. Estado Final das Branches

### Branch Padrão (Ativa)
- **`main`** → Branch principal de desenvolvimento
  - Código estável e revisado
  - Protegida com regras de PR obrigatório
  - Pronta para uso, testes e apresentação

### Branch de Backup
- **`main-old`** → Histórico completo anterior ao cleanup
  - Mantida apenas como referência histórica
  - Não recebe novos commits planejados
  - Pode ser consultada caso seja necessário resgatar código antigo

### Branches Deletadas
- **Todas as demais branches remotas foram removidas**, incluindo:
  - Branches de features antigas
  - Branches de refactors experimentais
  - Branches de testes de IA
  - Branches de correções de bugs já resolvidos

## 3. Regras de Proteção da Branch `main`

A branch `main` está protegida com as seguintes regras obrigatórias:

✅ **Proteção via Pull Request**
- Nenhum push direto é permitido na `main`
- Todas as mudanças devem passar por Pull Request
- Previne commits acidentais no código estável

✅ **Aprovação Obrigatória**
- Cada PR requer pelo menos **1 aprovação** antes do merge
- Garante revisão de código antes de integração
- Promove qualidade e conhecimento compartilhado

⚪ **Checks de CI/CD**
- Não há checks de status obrigatórios configurados ainda
- Podem ser adicionados no futuro quando CI/CD estiver em produção
- Quando implementado, testes automatizados serão exigidos antes de merge

**Objetivo:** Manter a `main` sempre estável, limpa, revisada e pronta para qualquer contexto de uso ou apresentação.

## 4. Estratégia de Branches a Partir de Agora

### Estrutura Padrão

```
main (código estável e produção)
  ↓
  ├── feature/nome-da-funcionalidade
  ├── fix/nome-do-problema
  ├── refactor/nome-da-refatoração
  └── docs/nome-da-documentação
```

### Fluxo de Trabalho

1. **Criar Branch Local**
   - Sempre a partir da `main`
   - Nome descritivo e curto: `feature/tela-jogos`, `fix/bug-caminho`, `docs/readme`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/nome-descritivo
   ```

2. **Desenvolver com Commits Focados**
   - Um commit por mudança lógica
   - Mensagens claras e em português
   - Commits pequenos e frequentes
   ```bash
   git commit -m "feat: adicionar tela de configurações"
   git commit -m "fix: corrigir bug de renderização"
   ```

3. **Abrir Pull Request**
   - Descrever claramente o objetivo
   - Referenciar issues se aplicável
   - Solicitar revisão de um colega

4. **Revisar, Aprovar e Mergear**
   - Reviewer analisa o código
   - Aprova ou solicita mudanças
   - Após aprovação, fazer merge na `main`
   - Usar "Squash and merge" para commits limpos (recomendado)

5. **Deletar Branch Após Merge**
   - Remover a branch local: `git branch -d feature/nome`
   - Remover a branch remota automaticamente (GitHub faz isso após merge)
   - **Não deixar branches velhas acumulando no repositório**

### Princípios

- ⏱️ **Ciclos curtos:** Branches devem viver poucos dias (máximo 1-2 semanas)
- 🎯 **Foco:** Uma branch = uma funcionalidade ou fix específico
- 🧹 **Limpeza:** Deletar branches após merge é obrigatório
- 📝 **Commits claros:** Histórico legível facilita bisect e blame
- 🔄 **Integração frequente:** Mergear com frequência evita conflitos grandes

## 5. Histórico Anterior (Branch `main-old`)

A branch `main-old` preserva **toda a história completa** do projeto antes do cleanup estrutural. Essa branch:

- ✅ Contém todos os commits antigos e histórico de desenvolvimento
- ✅ Serve como backup completo caso algo precise ser resgatado
- ❌ **Não deve ser usada para desenvolvimento ativo**
- ❌ Não deve receber novos commits ou merges

### Como Resgate de Código Antigo

Caso seja necessário resgatar funcionalidade ou código da `main-old`:

1. **Criar branch temporária a partir de `main-old`**
   ```bash
   git checkout main-old
   git pull origin main-old
   git checkout -b resgate/funcionalidade-x
   ```

2. **Copiar apenas o código útil**
   - Não fazer merge direto (mantém histórico puro)
   - Copiar manualmente os trechos necessários
   - Adaptar para o contexto atual da `main`

3. **Abrir PR normalmente**
   - A branch de resgate entra na fila de PR como qualquer outra
   - Passa pelas mesmas regras de revisão
   - Após merge, deletar a branch de resgate

---

**Data de Atualização:** Dezembro 2025
**Status:** ✅ Implementado e ativo
**Mantido por:** Equipe de Desenvolvimento
