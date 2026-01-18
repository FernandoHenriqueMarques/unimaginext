import { excluirBoneco } from "../bonecos.js";
import { excluirImagemPorUrl } from "../storage.js";
import {
  getUsuario,
  getItemDetalhe,
  clearItemDetalhe,
  setItemEdicao
} from "../state/session.js";

/* =====================
   ELEMENTOS
===================== */
const detalheOverlay = document.getElementById("detalheOverlay");
const fecharDetalheBtn = document.getElementById("fecharDetalhe");

const detalheNome = document.getElementById("detalheNome");
const detalheImagem = document.getElementById("detalheImagem");
const detalheDescricao = document.getElementById("detalheDescricao");

const btnExcluirItem = document.getElementById("btnExcluirItem");
const btnEditarItem = document.getElementById("btnEditarItem");

/* =====================
   OPEN / CLOSE
===================== */
function abrirDetalhe() {
  const item = getItemDetalhe();
  if (!item) return;

  detalheNome.textContent = item.nome;
  detalheDescricao.textContent = item.descricao || "";
  detalheImagem.src = item.imagemUrl || "";

  detalheOverlay.style.display = "flex";
}

function fecharDetalhe() {
  detalheOverlay.style.display = "none";
  clearItemDetalhe();
}

/* =====================
   EVENTOS DE UI
===================== */
fecharDetalheBtn.addEventListener("click", fecharDetalhe);

detalheOverlay.addEventListener("click", (e) => {
  if (e.target === detalheOverlay) fecharDetalhe();
});

/* =====================
   EXCLUIR
===================== */
btnExcluirItem.addEventListener("click", async () => {
  const item = getItemDetalhe();
  const user = getUsuario();

  if (!item || !user) return;

  const confirmado = confirm(
    "Excluir este item?\nEssa ação não pode ser desfeita."
  );

  if (!confirmado) return;

  try {
    if (item.imagemUrl) {
      await excluirImagemPorUrl(item.imagemUrl);
    }

    await excluirBoneco({ id: item.id });

    fecharDetalhe();
    document.dispatchEvent(new CustomEvent("gallery:refresh"));
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir o item.");
  }
});

/* =====================
   EDITAR
===================== */
btnEditarItem.addEventListener("click", () => {
  const item = getItemDetalhe();
  if (!item) return;

  setItemEdicao(item);
  fecharDetalhe();

  document.dispatchEvent(new CustomEvent("detail:edit"));
});

/* =====================
   EVENTOS GLOBAIS
===================== */
document.addEventListener("gallery:itemClick", abrirDetalhe);

document.addEventListener("user:logout", fecharDetalhe);
