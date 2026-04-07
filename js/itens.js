import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

const LIMITE = 50;

const ORDENACAO_MAP = {
  recentes: ["criadoEm", "desc"],
  antigos:  ["criadoEm", "asc"],
  az:       ["nome",     "asc"],
  za:       ["nome",     "desc"],
};

export async function contarItensDoUsuario(uid) {
  const q = query(collection(db, "itens"), where("ownerId", "==", uid));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export async function listarItensDoUsuarioPaginado(uid, { ordenacao = "recentes", cursor = null } = {}) {
  const [campo, direcao] = ORDENACAO_MAP[ordenacao] ?? ORDENACAO_MAP.recentes;

  const constraints = [
    where("ownerId", "==", uid),
    orderBy(campo, direcao),
    limit(LIMITE),
  ];

  if (cursor) constraints.push(startAfter(cursor));

  const snapshot = await getDocs(query(collection(db, "itens"), ...constraints));

  return {
    itens:        snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
    ultimoCursor: snapshot.docs.at(-1) ?? null,
    temMais:      snapshot.docs.length === LIMITE,
  };
}

export async function excluirItem({ id }) {
  const ref = doc(db, "itens", id);
  await deleteDoc(ref);
}

// ➕ NOVA FUNÇÃO
export async function adicionarItem({ uid, nome, descricao, imagemUrl }) {
  const ref = collection(db, "itens");

  await addDoc(ref, {
    ownerId: uid,
    nome,
    descricao,
    imagemUrl: imagemUrl || "",
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp()
  });
}

export async function atualizarItem({ id, dados }) {
  const ref = doc(db, "itens", id);
  await updateDoc(ref, {
    ...dados,
    atualizadoEm: serverTimestamp()
  });
}
