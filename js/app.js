import { loginWithGoogle, logout, onUserChange } from "./auth.js";
import { listarBonecosDoUsuario, adicionarBoneco } from "./bonecos.js";

const loginBtn = document.getElementById("loginGoogle");
const userInfo = document.getElementById("userInfo");
const galeria = document.getElementById("galeria");
const form = document.getElementById("formBoneco");
const nomeInput = document.getElementById("nomeBoneco");
const descricaoInput = document.getElementById("descricaoBoneco");

let usuarioAtual = null;

// 🔎 DEBUG (temporário)
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
      <button id="logout">Logout</button>
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

  if (!nome) return;

  await adicionarBoneco({
    uid: usuarioAtual.uid,
    nome,
    descricao
  });

  nomeInput.value =
