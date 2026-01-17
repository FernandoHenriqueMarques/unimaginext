import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { app } from "./firebase.js";

const db = getFirestore(app);
const collectionRef = collection(db, "bonecos");

export async function adicionarBoneco({ uid, nome, descricao, imagemUrl }) {
  await addDoc(collectionRef, {
    ownerId: uid,
    nome,
    descricao,
    imagemUrl,
    criadoEm: serverTimestamp()
  });
}

export async function listarBonecosDoUsuario(uid) {
  const q = query(collectionRef, where("ownerId", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

export async function excluirItem(itemId) {
  await deleteDoc(doc(db, "bonecos", itemId));
}
