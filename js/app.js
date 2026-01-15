import { loginWithGoogle, logout, onUserChange } from "./auth.js";

const loginBtn = document.getElementById("loginGoogle");
const userInfo = document.getElementById("userInfo");

loginBtn.addEventListener("click", () => {
  loginWithGoogle();
});

onUserChange((user) => {
  if (user) {
    loginBtn.style.display = "none";
    userInfo.innerHTML = `
      <p>Logado como <strong>${user.displayName}</strong></p>
      <button id="logout">Logout</button>
    `;

    document.getElementById("logout").addEventListener("click", logout);
  } else {
    loginBtn.style.display = "inline-block";
    userInfo.innerHTML = "";
  }
});
