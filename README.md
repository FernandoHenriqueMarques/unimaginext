# unimaginext

**unimaginext** é um projeto pessoal de galeria digital para coleções de itens, inspirado inicialmente na linha **Imaginext**, mas com um conceito mais amplo:

> **“Ideias não imaginadas antes.”**

O projeto foi desenhado para ser:
- pessoal
- elegante
- seguro
- gratuito (ou de custo mínimo)
- fácil de evoluir
- totalmente frontend, sem backend próprio

Cada usuário gerencia **exclusivamente a sua própria coleção**, sem qualquer conceito de “admin”.

---

## 🎯 Objetivo do Projeto

- Permitir que qualquer usuário crie e gerencie **sua própria galeria pessoal**
- Garantir **isolamento total dos dados** entre usuários
- Manter o projeto simples, sustentável e sem dependência de frameworks
- Servir como base para futuras evoluções (ex: compartilhamento público)

---

## 🧠 Filosofia de UX

- Interface limpa e discreta  
- Ações destrutivas sempre protegidas  
- Separação clara entre visualizar, editar e excluir  
- UX mobile-first, responsivo no desktop  

---

## 🏗️ Arquitetura Geral

GitHub Pages (Frontend estático)  
Firebase Authentication (Login Google)  
Firebase Firestore (Banco NoSQL)  
Firebase Storage (Imagens)

---

## 🔐 Autenticação

- Login via Google
- Identidade baseada no `uid`
- Cada usuário acessa apenas seus próprios dados

---

## 🗄️ Banco de Dados

Coleção principal: `itens`

```json
{
  "ownerId": "UID_DO_USUARIO",
  "nome": "Nome do item",
  "descricao": "Descrição opcional",
  "imagemUrl": "https://...",
  "criadoEm": "timestamp",
  "atualizadoEm": "timestamp"
}
```

---

## 🧩 Organização do Código

```
/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   ├─ app.js
   ├─ state/
   │  └─ session.js
   ├─ components/
   │  ├─ header.js
   │  ├─ gallery.js
   │  ├─ modalAdd.js
   │  ├─ modalDetail.js
   │  └─ modalEdit.js
   └─ services/
      ├─ firebase.js
      ├─ auth.js
      ├─ itens.js
      └─ storage.js
```

---

## ✅ Funcionalidades

- Login com Google
- CRUD completo de itens
- Upload e remoção de imagens
- Galeria em grid responsivo
- Modais dedicados
- Arquitetura desacoplada

---

## 📌 Status

Projeto funcional, estável e pronto para evoluir.
