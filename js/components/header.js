import { loginWithGoogle, logout } from "../auth.js";
import { getUsuario } from "../state/session.js";

const loginBtn = document.getElementById("loginGoogle");
const userAvatar = document.getElementById("userAvatar");
const avatarMenu = document.getElementById("avatarMenu");
const menuAddItem = document.getElementById("menuAddItem");
const menuToggleTheme = document.getElementById("menuToggleTheme");
const menuLogout = document.getElementById("menuLogout");
const THEME_STORAGE_KEY = "unimaginext-theme";

const applyTheme = (theme) => {
  document.body.classList.toggle("theme-dark", theme === "dark");
  menuToggleTheme.textContent = theme === "dark" ? "Modo claro" : "Modo escuro";
};

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

applyTheme(getInitialTheme());

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

menuToggleTheme.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("theme-dark")
    ? "light"
    : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
  avatarMenu.style.display = "none";
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
