import { loginWithGoogle, logout, onUserChange } from "./auth.js";
import { listarBonecosDoUsuario, adicionarBoneco } from "./bonecos.js";
import { uploadImagem } from "./storage.js";

// ===== Elementos da UI =====
const loginBtn = document.getElementById("loginGoogle");
const userInfo = document.getElementById("userInfo");
const galeria = document.getElementById("galeria");

const form = document.getElementById("formBoneco");
const nomeInput = document.getElementById("nomeBoneco");
const descricaoInput = document.getElementById("descricaoBoneco");
const imagemInput = document.getElementById("imagemBoneco");

const previewContainer = document.getElementById("previewContainer");
const previewImagem = document.getElementById("previewImagem");
const removerImagemBtn = document.getElementById("removerImagem");

// ===== Estado =====
let usuarioAtual = null;

// ===== Login =====
loginBtn.addEventListener("click", () => {
  loginWithGoogle();
});

// ===== Auth state =====
onUserChange(async (user) => {
  usuarioAtual = user;

  if (user) {
    loginBtn.style.display = "none";
    form.style.display = "block";

    userInfo.innerHTML = `
      <p>Logado como <strong>${user.displayName}</strong></p>
      <button id="logout" type="button">Logout</button>
    `;

    document
      .getElementById("logout")
      .addEventListener("click", logout);

    await carregarGaleria(user.uid);
  } else {
    loginBtn.style.display = "inline-block";
    form.style.display = "none";
    userInfo.innerHTML = "";
    galeria.innerHTML = "";
    esconderPreview();
  }
});

// ===== Preview da imagem =====
imagemInput.addEventListener("change", () => {
  const file = imagemInput.files[0];

  if (!file) {
    esconderPreview();
    return;
  }

  const previewUrl = URL.createObjectURL(file);
  previewImagem.src = previewUrl;
  previewContainer.style.display = "block";
});

removerImagemBtn.addEventListener("click", () => {
  esconderPreview();
});

function esconderPreview() {
  previewImagem.src = "";
  previewContainer.style.display = "none";
  imagemInput.value = "";
}

// ===== Submit do formulário =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!usuarioAtual) return;

  const nome = nomeInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const file = imagemInput.files[0];

  if (!nome) return;

  let imagemUrl = "";

  if (file) {
    imagemUrl = await uploadImagem({
      uid: usuarioAtual.uid,
      file
    });
  }

  await adicionarBoneco({
    uid: usuarioAtual.uid,
    nome,
    descricao,
    imagemUrl
  });

  nomeInput.value = "";
  descricaoInput.value = "";
  esconderPreview();

  await carregarGaleria(usuarioAtual.uid);
});

// ===== Listagem =====
async function carregarGaleria(uid) {
  galeria.innerHTML = "<p>Carregando sua galeria...</p>";

  const bonecos = await listarBonecosDoUsuario(uid);

  if (bonecos.length === 0) {
    galeria.innerHTML = "<p>Sua galeria está vazia.</p>";
    return;
  }

  galeria.innerHTML = bonecos.map(b => `
  <div class="card">
    ${
      b.imagemUrl
        ? `<img src="${b.imagemUrl}" alt="${b.nome}">`
        : ""
    }
    <h3>${b.nome}</h3>
    <p>${b.descricao || ""}</p>
  </div>
`).join("");
}
