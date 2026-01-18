import { listarBonecosDoUsuario } from "../bonecos.js";
import {
  getUsuario,
  setItemDetalhe,
  clearItemDetalhe
} from "../state/session.js";

const galeria = document.getElementById("galeria");

let itensCache = [];

/* =====================
   RENDER
===================== */
function renderGaleria(itens) {
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

  galeria.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const index = card.dataset.index;
      const item = itensCache[index];

      setItemDetalhe(item);
      document.dispatchEvent(new CustomEvent("gallery:itemClick"));
    });
  });
}

/* =====================
   SKELETON
===================== */
function renderSkeleton() {
  galeria.innerHTML = `
    <div class="card skeleton skeleton-card"></div>
    <div class="card skeleton skeleton-card"></div>
    <div class="card skeleton skeleton-card"></div>
    <div class="card skeleton skeleton-card"></div>
  `;
}

/* =====================
   LOAD
===================== */
export async function carregarGaleria() {
  const user = getUsuario();
  if (!user) return;

  renderSkeleton();

  const itens = await listarBonecosDoUsuario(user.uid);
  itensCache = itens;

  renderGaleria(itens);
}

/* =====================
   EVENTOS GLOBAIS
===================== */
document.addEventListener("user:login", carregarGaleria);

document.addEventListener("user:logout", () => {
  itensCache = [];
  clearItemDetalhe();
  galeria.innerHTML = "";
});

document.addEventListener("gallery:refresh", carregarGaleria);
