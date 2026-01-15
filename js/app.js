import { loginWithGoogle, logout, onUserChange } from "./auth.js";
import { listarBonecosDoUsuario } from "./bonecos.js";

const loginBtn = document.getElementById("loginGoogle");
const userInfo = document.getElementById("userInfo");
const galeria = document.getElementById("galeria");

loginBtn.addEventListener("click", () => {
  loginWithGoogle();
});

onUserChange(async (user) => {
  if (user) {
    loginBtn.style.display = "none";

    userInfo.innerHTML = `
      <p>Logado como <strong>${user.displayName}</strong></p>
      <button id="logout">Logout</button>
    `;

    document.getElementById("logout")
      .addEventListener("click", logout);

    await carregarGaleria(user.uid);

  } else {
    loginBtn.style.display = "inline-block";
    userInfo.innerHTML = "";
    galeria.innerHTML = "";
  }
});

async function carregarGaleria(uid) {
  galeria.innerHTML = "<p>Carregando sua galeria...</p>";

  const bonecos = await listarBonecosDoUsuario(uid);

  if (bonecos.length === 0) {
    galeria.innerHTML = "<p>Sua galeria está vazia.</p>";
    return;
  }

  galeria.innerHTML = bonecos.map(boneco => `
    <div style="margin-bottom:16px;">
      <strong>${boneco.nome}</strong><br>
      <small>${boneco.descricao || ""}</small>
    </div>
  `).join("");
}
