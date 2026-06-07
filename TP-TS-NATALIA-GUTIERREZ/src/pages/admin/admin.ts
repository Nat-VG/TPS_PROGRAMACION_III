import { protectRoute, logout, getUser } from "../../utils/auth";

// Protejo la ruta apenas carga la pagina
// Si no hay sesion -> al login. Si el rol no es admin -> redirige al client
protectRoute();

// Uso querySelector con genericos para obtener el elemento tipado (Clase 3)
const userInfo = document.querySelector<HTMLDivElement>("#user-info");
const user = getUser();

// Uso instanceof como Type Guard (Clase 4) para verificar que el elemento exista
// y sea realmente un HTMLDivElement antes de modificarlo
if (userInfo instanceof HTMLDivElement && user) {
  userInfo.textContent = `Bienvenido/a, ${user.email} (Rol: ${user.role})`;
}

// Boton de cerrar sesion — tambien uso instanceof para chequear (Clase 4)
const btnLogout = document.querySelector<HTMLButtonElement>("#btn-logout");
if (btnLogout instanceof HTMLButtonElement) {
  btnLogout.addEventListener("click", (): void => {
    logout();
  });
}
