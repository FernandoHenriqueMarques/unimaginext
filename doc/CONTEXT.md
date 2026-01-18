# PROJECT_CONTEXT — unimaginext

Este documento existe para **contextualizar completamente o projeto `unimaginext`**
para humanos e assistentes de IA, sem necessidade de histórico de conversas.

Se você está lendo este arquivo, assuma que:
- o projeto já está funcional
- o CRUD está completo
- a arquitetura foi intencionalmente desenhada
- simplicidade e clareza são prioridades

---

## 1. O QUE É O unimaginext (em termos práticos)

`unimaginext` é um **catálogo pessoal de coleções**, onde:

- cada usuário gerencia **apenas seus próprios itens**
- não existe conceito de administrador
- não existe conteúdo público (por enquanto)
- tudo acontece no frontend
- Firebase atua como BaaS (Auth, DB e Storage)

O sistema foi pensado como **produto pessoal**, não como rede social.

---

## 2. PRINCÍPIOS QUE GUIARAM TODAS AS DECISÕES

Estas regras são mais importantes que qualquer detalhe técnico.

### 2.1 Isolamento total de usuários
- Um usuário **nunca** vê dados de outro
- Segurança baseada em regras do Firestore
- UI não tenta “esconder” dados — eles simplesmente não existem

### 2.2 Sem backend próprio
- Nenhum servidor
- Nenhuma API custom
- Nenhum token exposto além do padrão Firebase
- Deploy simples e previsível

### 2.3 Simplicidade antes de abstração
- Nada de frameworks
- Nada de Redux, Zustand, etc
- Código explícito é preferido a código “esperto”

### 2.4 UX > features
- Se uma feature confunde, ela não entra
- Formulários só aparecem quando solicitados
- Ações destrutivas sempre confirmadas

---

## 3. VISÃO DE UX (COMO O USUÁRIO PENSA)

### 3.1 Fluxo principal
1. Usuário acessa a home
2. Faz login com Google
3. Vê sua galeria
4. Adiciona itens quando quiser
5. Clica em um item para ver detalhes
6. Decide editar ou excluir

Nada acontece automaticamente.
Nada “some” sem confirmação.

---

## 4. ARQUITETURA DE FRONTEND (CONCEITUAL)

O frontend é dividido em **quatro camadas claras**:

```
UI (HTML / CSS)
↓
Componentes JS (DOM + eventos)
↓
Estado Global (session.js)
↓
Serviços (Firebase)
```

Cada camada conhece apenas a imediatamente abaixo.

---

## 5. app.js (REGRA DE OURO)

O arquivo `app.js`:

- NÃO acessa DOM
- NÃO contém lógica de UI
- NÃO contém lógica de negócio
- NÃO guarda estado

Ele apenas:
- inicializa componentes
- conecta auth ao estado
- dispara eventos globais

Se `app.js` começar a crescer, algo está errado.

---

## 6. COMUNICAÇÃO ENTRE COMPONENTES

Componentes **não se importam entre si**.

Toda comunicação ocorre via `CustomEvent`.

### Eventos importantes

- `user:login`
- `user:logout`
- `gallery:refresh`
- `gallery:itemClick`
- `detail:edit`
- `ui:addItem`

Esse modelo evita acoplamento e facilita manutenção.

---

## 7. GERENCIAMENTO DE ESTADO

Existe **um único estado global**, localizado em:

```
js/state/session.js
```

Esse estado guarda:
- usuário autenticado
- item atualmente selecionado (quando necessário)

Nenhum componente mantém cópias desse estado.

---

## 8. MODAIS (DECISÃO IMPORTANTE)

O projeto usa **modais dedicados**, nunca reaproveitados:

- Modal de adicionar
- Modal de detalhe
- Modal de edição

Motivo:
- clareza mental
- menos bugs
- menos condicionais
- UX previsível

---

## 9. FIRESTORE (REGRAS MENTAIS)

- Cada documento tem `ownerId`
- Queries sempre filtram por `ownerId`
- Regras de segurança reforçam isso
- UI assume que o backend já é seguro

Nunca confiar apenas na UI.

---

## 10. STORAGE (IMAGENS)

- Cada imagem pertence a um item
- Cada imagem pertence a um usuário
- Ao excluir item:
  - imagem também é excluída
- Não existem imagens órfãs

---

## 11. O QUE NÃO FAZER (ANTI-PATTERNS)

- Não adicionar lógica no app.js
- Não criar estado duplicado
- Não fazer componentes se chamarem diretamente
- Não misturar visualização com edição
- Não otimizar antes de precisar

---

## 12. COMO EVOLUIR O PROJETO COM SEGURANÇA

Sempre responda estas perguntas antes de mudar algo:

1. Isso quebra isolamento de usuários?
2. Isso cria acoplamento entre componentes?
3. Isso aumenta complexidade sem ganho real?
4. Isso pode confundir o usuário?

Se alguma resposta for “sim”, repense.

---

## 13. ESTE DOCUMENTO

Este arquivo existe para:
- onboarding rápido
- contexto para IA
- memória de decisões
- evitar refatorações desnecessárias

Se algo aqui não bate com o código:
→ o código está errado, não o documento.

---

## FIM

Este projeto não é sobre tecnologia.
É sobre **clareza, controle e intenção**.
