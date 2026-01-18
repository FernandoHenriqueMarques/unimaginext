import { adicionarBoneco } from "../bonecos.js";
import { uploadImagem } from "../storage.js";
import { getUsuario } from "../state/session.js";

/* =====================
   ELEMENTOS
===================== */
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

/* =====================
   OPEN / CLOSE
===================== */
function abrirModalAdicionar() {
  modalOverlay.style.display = "flex";
}

function fecharModalAdicionar() {
  modalOverlay.style.display = "none";
  limparFormulario();
}

/* =====================
   PREVIEW
===================== */
imagemInput.addEventListener("change", () => {
  const file = imagemInput.files[0];
  if (!file) return esconderPreview();

  previewImagem.src = URL.createObjectURL(file);
  previewContainer.classList.remove("preview-hidden");
  uploadArea.classList.add("hidden");
});

removerImagemBtn.addEventListener("click", esconderPreview);

function esconderPreview() {
  previewImagem.src = "";
  previewContainer.classList.add("preview-hidden");
  imagemInput.value = "";
  uploadArea.classList.remove("hidden");
}

/* =====================
   LOADING
===================== */
function setLoading(loading) {
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

/* =====================
   SUBMIT
===================== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = getUsuario();
  if (!user) return;

  const nome = nomeInput.value.trim();
  if (!nome) return;

  setLoading(true);

  try {
    const descricao = descricaoInput.value.trim();
    const file = imagemInput.files[0];

    let imagemUrl = "";

    if (file) {
      imagemUrl = await uploadImagem({
        uid: user.uid,
        file
      });
    }

    await adicionarBoneco({
      uid: user.uid,
      nome,
      descricao,
      imagemUrl
    });

    fecharModalAdicionar();
    document.dispatchEvent(new CustomEvent("gallery:refresh"));
  } catch (err) {
    console.error(err);
    alert("Erro ao adicionar item.");
  } finally {
    setLoading(false);
  }
});

/* =====================
   EVENTOS GLOBAIS
===================== */
fecharModalBtn.addEventListener("click", fecharModalAdicionar);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) fecharModalAdicionar();
});

document.addEventListener("ui:addItem", abrirModalAdicionar);

document.addEventListener("user:logout", fecharModalAdicionar);

/* =====================
   UTIL
===================== */
function limparFormulario() {
  nomeInput.value = "";
  descricaoInput.value = "";
  esconderPreview();
}
