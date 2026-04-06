import {
  getFirestore,
  collection,
  query,
  where,
  deleteDoc,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

// 🔍 já existente
export async function listarItensDoUsuario(uid) {
  const itensRef = collection(db, "itens");
  const q = query(itensRef, where("ownerId", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
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
