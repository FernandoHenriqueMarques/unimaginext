import { listarItensDoUsuarioPaginado, contarItensDoUsuario } from "../itens.js";
import {
  getUsuario,
  setItemDetalhe,
  clearItemDetalhe
} from "../state/session.js";

const galeria        = document.getElementById("galeria");
const contadorItens  = document.getElementById("contadorItens");
const selectOrdenacao = document.getElementById("ordenacaoGaleria");

/* =====================
   ESTADO
===================== */
let itensCache    = [];
let cursor        = null;
let totalItens    = 0;
let carregando    = false;
let tudoCarregado = false;
let ordenacaoAtual = "recentes";

/* =====================
   SENTINEL — infinite scroll
===================== */
const sentinel = document.createElement("div");
galeria.after(sentinel);

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !carregando && !tudoCarregado) {
    carregarMais();
  }
}, { rootMargin: "300px" });

/* =====================
   UTILITÁRIOS
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

function setOrdenacaoVisivel(visivel) {
  selectOrdenacao.hidden = !visivel;
}

function atualizarContador() {
  const carregados = itensCache.length;
  if (carregados === 0) {
    contadorItens.textContent = "Sua galeria está vazia.";
    return;
  }
  if (carregados === totalItens) {
    contadorItens.textContent = `${totalItens} ${totalItens === 1 ? "item" : "itens"}`;
  } else {
    contadorItens.textContent = `Exibindo ${carregados} de ${totalItens} itens`;
  }
}

/* =====================
   RENDER
===================== */
function criarCard(item, index) {
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

  return card;
}

function appendCards(itens) {
  const startIndex = itensCache.length;
  itensCache.push(...itens);

  const fragment = document.createDocumentFragment();
  itens.forEach((item, i) => {
    fragment.appendChild(criarCard(item, startIndex + i));
  });
  galeria.appendChild(fragment);
}

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
   RESET
===================== */
function resetarEstado() {
  itensCache    = [];
  cursor        = null;
  totalItens    = 0;
  carregando    = false;
  tudoCarregado = false;
  observer.disconnect();
}

/* =====================
   LOAD
===================== */
async function carregarMais() {
  if (carregando || tudoCarregado) return;
  const user = getUsuario();
  if (!user) return;

  carregando = true;

  const { itens, ultimoCursor, temMais } = await listarItensDoUsuarioPaginado(user.uid, {
    ordenacao: ordenacaoAtual,
    cursor,
  });

  cursor        = ultimoCursor;
  tudoCarregado = !temMais;

  appendCards(itens);
  atualizarContador();

  if (!tudoCarregado) {
    observer.observe(sentinel);
  }

  carregando = false;
}

export async function carregarGaleria() {
  const user = getUsuario();
  if (!user) return;

  resetarEstado();
  renderSkeleton();

  const [total] = await Promise.all([
    contarItensDoUsuario(user.uid),
    new Promise(resolve => setTimeout(resolve, 300)),
  ]);

  totalItens = total;
  galeria.replaceChildren();

  if (totalItens === 0) {
    setOrdenacaoVisivel(false);
    contadorItens.textContent = "Sua galeria está vazia.";
    return;
  }

  setOrdenacaoVisivel(true);
  await carregarMais();
}

/* =====================
   EVENT DELEGATION
===================== */
galeria.onclick = (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const item = itensCache[card.dataset.index];
  if (!item) return;
  setItemDetalhe(item);
  document.dispatchEvent(new CustomEvent("gallery:itemClick"));
};

selectOrdenacao.addEventListener("change", (e) => {
  const totalAtual = totalItens;
  ordenacaoAtual = e.target.value;
  resetarEstado();
  totalItens = totalAtual;
  galeria.replaceChildren();
  carregarMais();
});

/* =====================
   EVENTOS GLOBAIS
===================== */
document.addEventListener("user:login", carregarGaleria);

document.addEventListener("user:logout", () => {
  resetarEstado();
  galeria.innerHTML = "";
  setOrdenacaoVisivel(false);
  contadorItens.textContent = "Gerencie seus itens pessoais";
});

document.addEventListener("gallery:refresh", carregarGaleria);
