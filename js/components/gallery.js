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
      ${
        item.imagemUrl
          ? `<img 
              src="${item.imagemUrl}" 
              loading="lazy" 
              decoding="async"
              alt="${item.nome}"
            />`
          : ""
      }
      <h3>${item.nome}</h3>
    </div>
  `).join("");
}

/* =====================
   EVENT DELEGATION
===================== */
galeria.onclick = (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const index = card.dataset.index;
  const item = itensCache[index];

  if (!item) return;

  setItemDetalhe(item);
  document.dispatchEvent(new CustomEvent("gallery:itemClick"));
};

/* =====================
   SKELETON (UX)
===================== */
function renderSkeleton() {
  galeria.innerHTML = `
    ${Array.from({ length: 6 }).map(() => `
      <div class="card skeleton-card">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton skeleton-title"></div>
      </div>
    `).join("")}
  `;
}

/* =====================
   LOAD
===================== */
export async function carregarGaleria() {
  const user = getUsuario();
  if (!user) return;

  renderSkeleton();

  // Delay mínimo para evitar "piscar" do skeleton
  await new Promise(resolve => setTimeout(resolve, 300));

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
