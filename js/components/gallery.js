import { listarBonecosDoUsuario } from "../bonecos.js";
import {
  getUsuario,
  setItemDetalhe,
  clearItemDetalhe
} from "../state/session.js";

const galeria = document.getElementById("galeria");

let itensCache = [];
let ordenacaoAtual = "recentes";

/* =====================
   RENDER
===================== */
function isSafeImageUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url, window.location.origin);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function renderGaleria(itens) {
  if (itens.length === 0) {
    const vazio = document.createElement("p");
    vazio.textContent = "Sua galeria está vazia.";
    galeria.replaceChildren(vazio);
    return;
  }

  const fragment = document.createDocumentFragment();

  itens.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = index;

    if (isSafeImageUrl(item.imagemUrl)) {
      const img = document.createElement("img");
      img.src = item.imagemUrl;
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = item.nome;
      card.appendChild(img);
    }

    const titulo = document.createElement("h3");
    titulo.textContent = item.nome;
    card.appendChild(titulo);

    fragment.appendChild(card);
  });

  galeria.replaceChildren(fragment);
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
  itensCache = ordenarItens(itens, ordenacaoAtual);

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

/* =====================
   Ordenação
===================== */
function ordenarItens(itens, tipo) {
  const copia = [...itens];

  switch (tipo) {
    case "antigos":
      return copia.sort((a, b) =>
        a.criadoEm?.seconds - b.criadoEm?.seconds
      );

    case "az":
      return copia.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );

    case "za":
      return copia.sort((a, b) =>
        b.nome.localeCompare(a.nome)
      );

    case "recentes":
    default:
      return copia.sort((a, b) =>
        b.criadoEm?.seconds - a.criadoEm?.seconds
      );
  }
}

const selectOrdenacao = document.getElementById("ordenacaoGaleria");

selectOrdenacao.addEventListener("change", (e) => {
  ordenacaoAtual = e.target.value;
  const itensOrdenados = ordenarItens(itensCache, ordenacaoAtual);
  renderGaleria(itensOrdenados);
});
