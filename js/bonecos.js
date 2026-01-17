import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

const COLLECTION = "bonecos";

export async function adicionarBoneco({ uid, nome, descricao, imagemUrl }) {
  await addDoc(collection(db, COLLECTION), {
    ownerId: uid,
    nome,
    descricao,
    imagemUrl: imagemUrl || "",
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp()
  });
}

export async function listarBonecosDoUsuario(uid) {
  const q = query(
    collection(db, COLLECTION),
    where("ownerId", "==", uid),
    orderBy("criadoEm", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
