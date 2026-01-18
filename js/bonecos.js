import {
  getFirestore,
  collection,
  query,
  where,
  deleteDoc,
  doc,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

// 🔍 já existente
export async function listarBonecosDoUsuario(uid) {
  const bonecosRef = collection(db, "bonecos");
  const q = query(bonecosRef, where("ownerId", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function excluirBoneco({ id }) {
  const ref = doc(db, "bonecos", id);
  await deleteDoc(ref);
}

// ➕ NOVA FUNÇÃO
export async function adicionarBoneco({ uid, nome, descricao, imagemUrl }) {
  const ref = collection(db, "bonecos");

  await addDoc(ref, {
    ownerId: uid,
    nome,
    descricao,
    imagemUrl: imagemUrl || "",
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp()
  });
}
