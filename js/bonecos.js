import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

export async function listarBonecosDoUsuario(uid) {
  const bonecosRef = collection(db, "bonecos");

  const q = query(
    bonecosRef,
    where("ownerId", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
