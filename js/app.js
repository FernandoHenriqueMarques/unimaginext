import { loginWithGoogle, logout, onUserChange } from "./auth.js";
import { listarBonecosDoUsuario, adicionarBoneco } from "./bonecos.js";
import { uploadImagem } from "./storage.js";

/* ===== Elementos ===== */
const loginBtn = document.getElementById("loginGoogle");
const galeria = document.getElementById("galeria");
const fabAdd = document.getElementById("fabAdd");

const modalOverlay = document.getElementById("modalOverlay");
const fecharModalBtn = document.getElementById("fecharModal");

const form = document.getElementById("formBoneco");
const nomeInput = document.getElementById("nomeBoneco");
const descricaoInput = document.getElementById("descricaoBoneco");
const imagemInput = document.getElementById("imagemBoneco");

const previewContainer = document.getElementById("previewContainer");
const previewImagem = document.getElementById("previewImagem");
const removerImagemBtn = document.getElementById("removerImagem");

/* ===== Estado ===== */
let usuarioAtual = null;

/* ===== Login ===== */
loginBtn.addEventListener("click", loginWithGoogle);

/* ===== Auth ===== */
onUserChange(async (user) => {
  usuarioAtual = user;

  if (user) {
    fabAdd.style.display = "flex";
    await carregarGaleria(user.uid);
  } else {
    fabAdd.style.display = "none";
    galeria.innerHTML = "";
    fecharModal();
  }
});

/* ===== Modal ===== */
fabAdd.addEventListener("click", abrirModal);
fecharModalBtn.addEventListener("click", fecharModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) fecharModal();
});

function abrirModal() {
  modalOverlay.style.display = "flex";
}

function fecharModal() {
  modalOverlay.style.display = "none";
  limparFormulario();
}

/* ===== Preview ===== */
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

/* ===== Submit ===== */
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
  fecharModal();
});

/* ===== Util ===== */
function limparFormulario() {
  nomeInput.value = "";
  descricaoInput.value = "";
  esconderPreview();
}

/* ===== Galeria ===== */
async function carregarGaleria(uid) {
  galeria.innerHTML = "<p>Carregando...</p>";

  const bonecos = await listarBonecosDoUsuario(uid);

  if (bonecos.length === 0) {
    galeria.innerHTML = "<p>Sua galeria está vazia.</p>";
    return;
  }

  galeria.innerHTML = bonecos.map(b => `
    <div class="card">
      ${b.imagemUrl ? `<img src="${b.imagemUrl}" />` : ""}
      <h3>${b.nome}</h3>
      <p>${b.descricao || ""}</p>
    </div>
  `).join("");
}
