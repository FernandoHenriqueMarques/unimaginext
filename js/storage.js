import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "./firebase.js";

const storage = getStorage(app);

export async function uploadImagem({ uid, file }) {
  const imageRef = ref(storage, `itens/${uid}/${Date.now()}-${file.name}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

export async function removerImagemDoStorage(imagemUrl) {
  if (!imagemUrl) return;
  const imageRef = ref(storage, imagemUrl);
  await deleteObject(imageRef);
}
