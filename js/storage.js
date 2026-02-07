import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { app } from "./firebase.js";

const storage = getStorage(app);

function sanitizeFileName(name) {
  const normalized = name.replace(/[^\w.\-]/g, "_").slice(0, 80);
  return normalized || "upload";
}

export async function uploadImagem({ uid, file }) {
  const safeName = sanitizeFileName(file.name);
  const caminho = `bonecos/${uid}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, caminho);

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}

export async function excluirImagemPorUrl(imagemUrl) {
  if (!imagemUrl) return;

  const storageRef = ref(storage, imagemUrl);
  await deleteObject(storageRef);
}
