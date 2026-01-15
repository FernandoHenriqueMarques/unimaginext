# imaginext

unimaginext é um projeto pessoal de galeria de bonecos, focado inicialmente na linha **Imaginext**, com o conceito de **“ideias não imaginadas antes”**.

O objetivo do projeto é permitir que **cada usuário gerencie a sua própria galeria**, de forma simples, segura e gratuita, utilizando apenas tecnologias frontend e serviços BaaS (Backend as a Service).

---

## 🎯 Objetivo do Projeto

- Criar uma **galeria pessoal de bonecos**
- Cada usuário vê e gerencia **apenas os seus próprios itens**
- Projeto simples, evolutivo e sem backend próprio
- Hospedagem gratuita via GitHub Pages

---

## 🏗️ Arquitetura Geral

GitHub Pages (Frontend)  
└── Firebase Authentication (Login Google)  
└── Firebase Firestore (Banco de dados)  
└── Cloudinary (Hospedagem de imagens - planejado)

---

## 🌐 Hospedagem

- **GitHub Pages**
- Repositório público
- Site estático (HTML, CSS e JavaScript)
- Deploy automático a cada commit

---

## 🔐 Autenticação

- **Firebase Authentication**
- Login exclusivo com **Google**
- Não existe conceito de “admin”
- Cada usuário acessa somente seus próprios dados
- Identidade baseada no `uid` do Firebase

---

## 🗄️ Banco de Dados

- **Firebase Firestore**
- Banco NoSQL
- Regras de segurança baseadas no `ownerId`

### 📁 Coleção principal

bonecos

### 📄 Estrutura de um documento (modelo minimalista)

{
  "ownerId": "UID_DO_USUARIO",
  "nome": "Nome do boneco",
  "descricao": "Descrição do boneco",
  "imagemUrl": "https://...",
  "criadoEm": "timestamp",
  "atualizadoEm": "timestamp"
}

---

## 🧩 Estrutura do Projeto

/
├─ index.html
├─ css/
│  └─ style.css
└─ js/
   ├─ firebase.js
   ├─ auth.js
   ├─ bonecos.js
   └─ app.js

---

## ✅ Funcionalidades Implementadas

- Site publicado via GitHub Pages
- Login com Google (Firebase Auth)
- Sessão persistente do usuário
- Firestore configurado em modo production
- Regras de segurança por usuário
- Listagem de bonecos do usuário logado
- Mensagem de galeria vazia
- Adição de novos bonecos (nome + descrição)
- Persistência segura por usuário
- Código organizado em múltiplos arquivos

---

## 🚫 Decisões Importantes

- Não usar backend próprio
- Não usar Firebase Storage (para evitar custos)
- Não usar framework frontend neste momento
- Não ter área de admin separada
- Priorizar soluções gratuitas

---

## 🖼️ Hospedagem de Imagens (Planejado)

### Solução escolhida
- **Cloudinary (plano gratuito)**

---

## 🚀 Próximos Passos

- Configurar Cloudinary (Unsigned Upload)
- Upload de imagem do boneco
- Salvar `imagemUrl` no Firestore
- Exibir imagem na galeria
- Melhorar layout da galeria
- Editar e remover bonecos

---

## 📌 Status Atual

Projeto funcional e estável  
Upload de imagens pendente (Cloudinary)
