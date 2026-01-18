import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  ref
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { app } from "./firebase.js";

const storage = getStorage(app);

export async function uploadImagem({ uid, file }) {
  const caminho = `bonecos/${uid}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, caminho);

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}

export async function excluirImagemPorUrl(imagemUrl) {
  if (!imagemUrl) return;

  const storageRef = ref(storage, imagemUrl);
  await deleteObject(storageRef);
}
