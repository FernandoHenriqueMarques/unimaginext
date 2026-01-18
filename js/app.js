import { onUserChange } from "./auth.js";
import { setUsuario, clearSession } from "./state/session.js";

/* =====================
   COMPONENTES
===================== */
import "./components/header.js";
import "./components/gallery.js";
import "./components/modalDetail.js";
import "./components/modalEdit.js";
import "./components/modalAdd.js";

/* =====================
   AUTH ORCHESTRATION
===================== */
onUserChange((user) => {
  if (user) {
    setUsuario(user);
    document.dispatchEvent(new CustomEvent("user:login"));
  } else {
    clearSession();
    document.dispatchEvent(new CustomEvent("user:logout"));
  }
});
