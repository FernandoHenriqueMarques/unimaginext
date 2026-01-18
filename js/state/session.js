let usuarioAtual = null;
let itemDetalheAtual = null;
let itemEmEdicao = null;

/* =========================
   USER
========================= */
export function setUsuario(user) {
  usuarioAtual = user;
}

export function getUsuario() {
  return usuarioAtual;
}

/* =========================
   DETALHE
========================= */
export function setItemDetalhe(item) {
  itemDetalheAtual = item;
}

export function getItemDetalhe() {
  return itemDetalheAtual;
}

export function clearItemDetalhe() {
  itemDetalheAtual = null;
}

/* =========================
   EDIÇÃO
========================= */
export function setItemEdicao(item) {
  itemEmEdicao = item;
}

export function getItemEdicao() {
  return itemEmEdicao;
}

export function clearItemEdicao() {
  itemEmEdicao = null;
}

/* =========================
   RESET GERAL (logout)
========================= */
export function clearSession() {
  usuarioAtual = null;
  itemDetalheAtual = null;
  itemEmEdicao = null;
}
