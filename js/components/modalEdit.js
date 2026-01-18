import { atualizarBoneco } from "../bonecos.js";
import { uploadImagem, excluirImagemPorUrl } from "../storage.js";
import {
  getUsuario,
  getItemEdicao,
  clearItemEdicao
} from "../state/session.js";

/* =====================
   ELEMENTOS
===================== */
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

/* =====================
   ESTADO LOCAL
===================== */
let imagemEditadaFile = null;
let removerImagemAtual = false;

/* =====================
   OPEN / CLOSE
===================== */
function abrirModalEditar() {
  const item = getItemEdicao();
  if (!item) return;

  imagemEditadaFile = null;
  removerImagemAtual = false;

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

function fecharModalEditar() {
  modalEditarOverlay.style.display = "none";
  clearItemEdicao();
  resetarPreview();
}

/* =====================
   PREVIEW
===================== */
function resetarPreview() {
  editarPreviewImagem.src = "";
  editarPreview.classList.add("preview-hidden");
  editarUploadArea.classList.remove("hidden");
  editarImagem.value = "";
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
  resetarPreview();
});

/* =====================
   SALVAR
===================== */
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const item = getItemEdicao();
  const user = getUsuario();

  if (!item || !user) return;

  const nome = editarNome.value.trim();
  if (!nome) return;

  btnSalvarEdicao.disabled = true;

  let imagemUrl = item.imagemUrl || "";

  try {
    if (removerImagemAtual && imagemUrl) {
      await excluirImagemPorUrl(imagemUrl);
      imagemUrl = "";
    }

    if (imagemEditadaFile) {
      if (imagemUrl) {
        await excluirImagemPorUrl(imagemUrl);
      }

      imagemUrl = await uploadImagem({
        uid: user.uid,
        file: imagemEditadaFile
      });
    }

    await atualizarBoneco({
      id: item.id,
      dados: {
        nome,
        descricao: editarDescricao.value.trim(),
        imagemUrl
      }
    });

    fecharModalEditar();
    document.dispatchEvent(new CustomEvent("gallery:refresh"));
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações.");
  } finally {
    btnSalvarEdicao.disabled = false;
  }
});

/* =====================
   EVENTOS GLOBAIS
===================== */
fecharEditarBtn.addEventListener("click", fecharModalEditar);

modalEditarOverlay.addEventListener("click", (e) => {
  if (e.target === modalEditarOverlay) fecharModalEditar();
});

document.addEventListener("detail:edit", abrirModalEditar);

document.addEventListener("user:logout", fecharModalEditar);
