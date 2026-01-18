import { loginWithGoogle, logout, onUserChange } from "./auth.js";
import { uploadImagem } from "./storage.js";
import { excluirImagemPorUrl } from "./storage.js";
import { listarBonecosDoUsuario, adicionarBoneco, excluirBoneco, atualizarBoneco } from "./bonecos.js";

let itemDetalheAtual = null;
let itemEmEdicao = null;
let imagemEditadaFile = null;
let removerImagemAtual = false;

const modalEditarOverlay = document.getElementById("modalEditarOverlay");
const fecharEditarBtn = document.getElementById("fecharEditar");

const formEditar = document.getElementById("formEditar");
const editarNome = document.getElementById("editarNome");
const editarDescricao = document.getElementById("editarDescricao");
const editarImagem = document.getElementById("editarImagem");

const editarPreview = document.getElementById("editarPreview");
const editarPreviewImagem = document.getElementById("editarPreviewImagem");
const editarRemoverImagemBtn = document.getElementById("editarRemoverImagem");
const editarUploadArea = document.getElementById("editarUploadArea");

const btnSalvarEdicao = document.getElementById("btnSalvarEdicao");

const btnEditarItem = document.getElementById("btnEditarItem");




/* =========================================================
   ELEMENTOS – HEADER / HOME
========================================================= */
const loginBtn = document.getElementById("loginGoogle");
const userAvatar = document.getElementById("userAvatar");
const avatarMenu = document.getElementById("avatarMenu");
const menuAddItem = document.getElementById("menuAddItem");
const menuLogout = document.getElementById("menuLogout");

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

const btnSalvar = document.getElementById("btnSalvar");

const uploadArea = document.querySelector(".upload-area");


/* =========================================================
   ELEMENTOS – MODAL DETALHE
========================================================= */
const detalheOverlay = document.getElementById("detalheOverlay");
const fecharDetalheBtn = document.getElementById("fecharDetalhe");
const detalheNome = document.getElementById("detalheNome");
const detalheImagem = document.getElementById("detalheImagem");
const detalheDescricao = document.getElementById("detalheDescricao");

const btnExcluirItem = document.getElementById("btnExcluirItem");


/* =========================================================
   ESTADO
========================================================= */
let usuarioAtual = null;
let itensCache = [];

/* =========================================================
   LOGIN
========================================================= */
loginBtn.addEventListener("click", loginWithGoogle);

/* =========================================================
   MENU DO AVATAR
========================================================= */
userAvatar.addEventListener("click", (e) => {
  e.stopPropagation();
  avatarMenu.style.display =
    avatarMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", () => {
  avatarMenu.style.display = "none";
});

menuAddItem.addEventListener("click", () => {
  avatarMenu.style.display = "none";
  abrirModalAdicionar();
});

menuLogout.addEventListener("click", () => {
  avatarMenu.style.display = "none";
  logout();
});

/* =========================================================
   AUTH STATE
========================================================= */
onUserChange(async (user) => {
  usuarioAtual = user;

  if (user) {
    loginBtn.style.display = "none";

    userAvatar.style.display = "block";
    userAvatar.style.backgroundImage = `url(${user.photoURL})`;
    userAvatar.style.backgroundSize = "cover";

    fabAdd.style.display = "flex";

    await carregarGaleria(user.uid);
  } else {
    loginBtn.style.display = "inline-block";

    userAvatar.style.display = "none";
    userAvatar.style.backgroundImage = "";
    avatarMenu.style.display = "none";

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
  previewContainer.classList.remove("preview-hidden");

  // Esconde botão "Adicionar imagem"
  uploadArea.classList.add("hidden");
});

removerImagemBtn.addEventListener("click", esconderPreview);

function esconderPreview() {
  previewImagem.src = "";
  previewContainer.classList.add("preview-hidden");
  imagemInput.value = "";
  uploadArea.classList.remove("hidden");
}

/* =========================================================
   LOADING – BOTÃO SALVAR
========================================================= */
function setLoadingSalvar(loading) {
  const text = btnSalvar.querySelector(".btn-text");
  const spinner = btnSalvar.querySelector(".btn-spinner");

  if (loading) {
    btnSalvar.disabled = true;
    text.textContent = "Salvando...";
    spinner.style.display = "inline-block";
  } else {
    btnSalvar.disabled = false;
    text.textContent = "Salvar item";
    spinner.style.display = "none";
  }
}

/* =========================================================
   SUBMIT – NOVO ITEM
========================================================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!usuarioAtual) return;

  const nome = nomeInput.value.trim();
  if (!nome) return;

  setLoadingSalvar(true);

  try {
    const descricao = descricaoInput.value.trim();
    const file = imagemInput.files[0];

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
  } finally {
    setLoadingSalvar(false);
  }
});

/* =========================================================
   GALERIA + SKELETON
========================================================= */
async function carregarGaleria(uid) {
  mostrarSkeletonGaleria();

  const itens = await listarBonecosDoUsuario(uid);
  itensCache = itens;

  if (itens.length === 0) {
    galeria.innerHTML = "<p>Sua galeria está vazia.</p>";
    return;
  }

  galeria.innerHTML = itens.map((item, index) => `
    <div class="card" data-index="${index}">
      ${item.imagemUrl ? `<img src="${item.imagemUrl}" />` : ""}
      <h3>${item.nome}</h3>
    </div>
  `).join("");

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const index = card.dataset.index;
      abrirDetalhe(itensCache[index]);
    });
  });
}

function mostrarSkeletonGaleria() {
  galeria.innerHTML = `
    <div class="card skeleton skeleton-card"></div>
    <div class="card skeleton skeleton-card"></div>
    <div class="card skeleton skeleton-card"></div>
    <div class="card skeleton skeleton-card"></div>
  `;
}

/* =========================================================
   MODAL – DETALHE DO ITEM
========================================================= */
fecharDetalheBtn.addEventListener("click", fecharDetalhe);

detalheOverlay.addEventListener("click", (e) => {
  if (e.target === detalheOverlay) fecharDetalhe();
});

function abrirDetalhe(item) {
  itemDetalheAtual = item;

  detalheNome.textContent = item.nome;
  detalheDescricao.textContent = item.descricao || "";
  detalheImagem.src = item.imagemUrl || "";

  detalheOverlay.style.display = "flex";
}

function fecharDetalhe() {
  detalheOverlay.style.display = "none";
  itemDetalheAtual = null;
}

/* =========================================================
   UTIL
========================================================= */
function limparFormulario() {
  nomeInput.value = "";
  descricaoInput.value = "";
  esconderPreview();
}

btnExcluirItem.addEventListener("click", async () => {
  if (!itemDetalheAtual || !usuarioAtual) return;

  const confirmado = confirm(
    "Excluir este item?\nEssa ação não pode ser desfeita."
  );

  if (!confirmado) return;

  try {
    // 1. Exclui imagem (se existir)
    await excluirImagemPorUrl(itemDetalheAtual.imagemUrl);

    // 2. Exclui documento
    await excluirBoneco({ id: itemDetalheAtual.id });

    // 3. Fecha modal
    fecharDetalhe();

    // 4. Atualiza galeria
    await carregarGaleria(usuarioAtual.uid);
  } catch (e) {
    alert("Erro ao excluir o item.");
    console.error(e);
  }
});

btnEditarItem.addEventListener("click", () => {
  if (!itemDetalheAtual) return;

  const itemParaEditar = itemDetalheAtual;
  fecharDetalhe();
  abrirModalEditar(itemParaEditar);
});


function abrirModalEditar(item) {
  if (!item) return;

  itemEmEdicao = item;
  removerImagemAtual = false;
  imagemEditadaFile = null;

  editarNome.value = item.nome;
  editarDescricao.value = item.descricao || "";

  if (item.imagemUrl) {
    editarPreviewImagem.src = item.imagemUrl;
    editarPreview.classList.remove("preview-hidden");
    editarUploadArea.classList.add("hidden");
  } else {
    editarPreview.classList.add("preview-hidden");
    editarUploadArea.classList.remove("hidden");
  }

  modalEditarOverlay.style.display = "flex";
}

editarImagem.addEventListener("change", () => {
  const file = editarImagem.files[0];
  if (!file) return;

  imagemEditadaFile = file;
  removerImagemAtual = false;

  editarPreviewImagem.src = URL.createObjectURL(file);
  editarPreview.classList.remove("preview-hidden");
  editarUploadArea.classList.add("hidden");
});

editarRemoverImagemBtn.addEventListener("click", () => {
  removerImagemAtual = true;
  imagemEditadaFile = null;

  editarPreviewImagem.src = "";
  editarPreview.classList.add("preview-hidden");
  editarUploadArea.classList.remove("hidden");
});

formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!itemEmEdicao || !usuarioAtual) return;

  const nome = editarNome.value.trim();
  if (!nome) return;

  btnSalvarEdicao.disabled = true;

  let imagemUrl = itemEmEdicao.imagemUrl || "";

  try {
    // Remove imagem antiga
    if (removerImagemAtual && imagemUrl) {
      await excluirImagemPorUrl(imagemUrl);
      imagemUrl = "";
    }

    // Substitui imagem
    if (imagemEditadaFile) {
      if (imagemUrl) {
        await excluirImagemPorUrl(imagemUrl);
      }

      imagemUrl = await uploadImagem({
        uid: usuarioAtual.uid,
        file: imagemEditadaFile
      });
    }

    await atualizarBoneco({
      id: itemEmEdicao.id,
      dados: {
        nome,
        descricao: editarDescricao.value.trim(),
        imagemUrl
      }
    });

    modalEditarOverlay.style.display = "none";
    await carregarGaleria(usuarioAtual.uid);
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações.");
  } finally {
    btnSalvarEdicao.disabled = false;
  }
});
