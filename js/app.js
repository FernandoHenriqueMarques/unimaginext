import { loginWithGoogle, logout, onUserChange } from "./auth.js";
import { listarBonecosDoUsuario, adicionarBoneco } from "./bonecos.js";
import { uploadImagem } from "./storage.js";

const loginBtn = document.getElementById("loginGoogle");
const userInfo = document.getElementById("userInfo");
const galeria = document.getElementById("galeria");
const form = document.getElementById("formBoneco");
const nomeInput = document.getElementById("nomeBoneco");
const descricaoInput = document.getElementById("descricaoBoneco");
const imagemInput = document.getElementById("imagemBoneco");

let usuarioAtual = null;

// 🔎 DEBUG TEMPORÁRIO
console.log("app.js carregado");
console.log("loginBtn:", loginBtn);

loginBtn.addEventListener("click", () => {
  console.log("CLIQUE NO BOTÃO LOGIN");
  loginWithGoogle();
});

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
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

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
  imagemInput.value = "";

  await carregarGaleria(usuarioAtual.uid);
});

async function carregarGaleria(uid) {
  galeria.innerHTML = "<p>Carregando sua galeria...</p>";

  const bonecos = await listarBonecosDoUsuario(uid);

  if (bonecos.length === 0) {
    galeria.innerHTML = "<p>Sua galeria está vazia.</p>";
    return;
  }

  galeria.innerHTML = bonecos.map(b => `
    <div style="margin-bottom:16px;">
      <strong>${b.nome}</strong><br>
      <small>${b.descricao || ""}</small>
    </div>
  `).join("");
}
