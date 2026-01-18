import { loginWithGoogle, logout } from "../auth.js";
import { getUsuario } from "../state/session.js";

const loginBtn = document.getElementById("loginGoogle");
const userAvatar = document.getElementById("userAvatar");
const avatarMenu = document.getElementById("avatarMenu");
const menuAddItem = document.getElementById("menuAddItem");
const menuLogout = document.getElementById("menuLogout");

/* =====================
   EVENTOS
===================== */
loginBtn.addEventListener("click", loginWithGoogle);

userAvatar.addEventListener("click", (e) => {
  e.stopPropagation();
  avatarMenu.style.display =
    avatarMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", () => {
  avatarMenu.style.display = "none";
});

menuAddItem.addEventListener("click", () => {
  avatarMenu.style.display = "none";
  document.dispatchEvent(new CustomEvent("ui:addItem"));
});

menuLogout.addEventListener("click", logout);

/* =====================
   LOGIN / LOGOUT
===================== */
document.addEventListener("user:login", () => {
  const user = getUsuario();

  loginBtn.style.display = "none";
  userAvatar.style.display = "block";
  userAvatar.style.backgroundImage = `url(${user.photoURL})`;
});

document.addEventListener("user:logout", () => {
  loginBtn.style.display = "inline-block";
  userAvatar.style.display = "none";
  avatarMenu.style.display = "none";
});
