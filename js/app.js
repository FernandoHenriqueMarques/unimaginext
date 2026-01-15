import { loginWithGoogle, onUserChange } from "./auth.js";
import { listarBonecosDoUsuario, adicionarBoneco } from "./bonecos.js";
import { uploadImagem } from "./storage.js";

/* =========================================================
   ELEMENTOS – HEADER / HOME
========================================================= */
const loginBtn = document.getElementById("loginGoogle");
const userAvatar = document.getElementById("userAvatar");
const galeria = document.getElementById("galeria");
const fabAdd = document.getElementById("fabAdd");

/* =========================================================
   ELEMENTOS – MODAL ADICIONAR
========================================================= */
const modalOverlay = document.getElementById("modalOverlay");
const fecharModalBtn = document.getElementById("fecharModal");

const form = document.getElementById("formBoneco");
const nomeInput = document.getElementById("nomeBoneco");
const descricaoInput = document.getElementById("descricaoBoneco");
const imagemInput = document.getElementById("imagemBoneco");

const previewContainer = document.getElementById("previewContainer");
const previewImagem = document.getElementById("previewImagem");
const removerImagemBtn = document.getElementById("removerImagem");

/* =========================================================
   ELEMENTOS – MODAL DETALHE
========================================================= */
const detalheOverlay = document.getElementById("detalheOverlay");
const fecharDetalheBtn = document.getElementById("fecharDetalhe");
const detalheNome = document.getElementById("detalheNome");
const detalheImagem = document.getElementById("detalheImagem");
const detalheDescricao = document.getElementById("detalheDescricao");

/* =========================================================
   ESTADO
========================================================= */
let usuarioAtual = null;
let bonecosCache = [];

/* =========================================================
   LOGIN
========================================================= */
loginBtn.addEventListener("click", loginWithGoogle);

/* =========================================================
   AUTH STATE
========================================================= */
onUserChange(async (user) => {
  usuarioAtual = user;

  if (user) {
    // Header
    loginBtn.style.display = "none";
    userAvatar.style.display = "block";
    userAvatar.style.backgroundImage = `url(${user.photoURL})`;
    userAvatar.style.backgroundSize = "cover";

    // Ações
    fabAdd.style.display = "flex";

    await carregarGaleria(user.uid);
  } else {
    loginBtn.style.display = "inline-block";
    userAvatar.style.display = "none";
    userAvatar.style.backgroundImage = "";

    fabAdd.style.display = "none";
    galeria.innerHTML = "";

    fecharModalAdicionar();
    fecharDetalhe();
  }
});

/* =========================================================
   MODAL – ADICIONAR ITEM
========================================================= */
fabAdd.addEventListener("click", abrirModalAdicionar);
fecharModalBtn.addEventListener("click", fecharModalAdicionar);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) fecharModalAdicionar();
});

function abrirModalAdicionar() {
  modalOverlay.style.display = "flex";
}

function fecharModalAdicionar() {
  modalOverlay.style.display = "none";
  limparFormulario();
}

/* =========================================================
   PREVIEW DE IMAGEM
========================================================= */
imagemInput.addEventListener("change", () => {
  const file = imagemInput.files[0];
  if (!file) return esconderPreview();

  previewImagem.src = URL.createObjectURL(file);
  previewContainer.style.display = "block";
});

removerImagemBtn.addEventListener("click", esconderPreview);

function esconderPreview() {
  previewImagem.src = "";
  previewContainer.style.display = "none";
  imagemInput.value = "";
}

/* =========================================================
   SUBMIT – NOVO ITEM
========================================================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!usuarioAtual) return;

  const nome = nomeInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const file = imagemInput.files[0];

  if (!nome) return;

  let imagemUrl = "";

  if (file) {
    imagemUrl = await uploadImagem({
      uid: usuarioAtual.uid,
      file
    });
  }

  await adicionarBoneco({
    uid: usuarioAtual.uid,
    nome,
    descricao,
    imagemUrl
  });

  await carregarGaleria(usuarioAtual.uid);
  fecharModalAdicionar();
});

/* =========================================================
   GALERIA
========================================================= */
async function carregarGaleria(uid) {
  galeria.innerHTML = "<p>Carregando sua galeria...</p>";

  const bonecos = await listarBonecosDoUsuario(uid);
  bonecosCache = bonecos;

  if (bonecos.length === 0) {
    galeria.innerHTML = "<p>Sua galeria está vazia.</p>";
    return;
  }

  galeria.innerHTML = bonecos.map((b, index) => `
    <div class="card" data-index="${index}">
      ${b.imagemUrl ? `<img src="${b.imagemUrl}" />` : ""}
      <h3>${b.nome}</h3>
    </div>
  `).join("");

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const index = card.dataset.index;
      abrirDetalhe(bonecosCache[index]);
    });
  });
}

/* =========================================================
   MODAL – DETALHE DO BONECO
========================================================= */
fecharDetalheBtn.addEventListener("click", fecharDetalhe);

detalheOverlay.addEventListener("click", (e) => {
  if (e.target === detalheOverlay) fecharDetalhe();
});

function abrirDetalhe(boneco) {
  detalheNome.textContent = boneco.nome;
  detalheDescricao.textContent = boneco.descricao || "";
  detalheImagem.src = boneco.imagemUrl || "";

  detalheOverlay.style.display = "flex";
}

function fecharDetalhe() {
  detalheOverlay.style.display = "none";
}

/* =========================================================
   UTIL
========================================================= */
function limparFormulario() {
  nomeInput.value = "";
  descricaoInput.value = "";
  esconderPreview();
}
