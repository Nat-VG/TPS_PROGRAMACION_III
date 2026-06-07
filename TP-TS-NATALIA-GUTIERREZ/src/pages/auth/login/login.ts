import { getRegisteredUsers, saveUser } from "../../../utils/auth";
import { navigate, PATHS } from "../../../utils/navigate";
import type { IUser } from "../../../types/IUser";

// Capturo los elementos del DOM con querySelector y genericos (Clase 3)
// Asi TypeScript sabe exactamente que tipo de elemento HTML es cada uno
const form = document.querySelector<HTMLFormElement>("#form-login");
const mensajeError = document.querySelector<HTMLParagraphElement>("#mensaje-error");

// Funcion para mostrar un mensaje de error en pantalla
const mostrarError = (texto: string): void => {
  if (mensajeError) {
    mensajeError.textContent = texto;
    mensajeError.style.display = "block";
  }
};

// Uso Optional Chaining (?.) para que si form es null, no lance error (Clase 4)
form?.addEventListener("submit", (e: SubmitEvent): void => {
  // Prevengo que el formulario recargue la pagina (Clase 4)
  e.preventDefault();
  if (mensajeError) mensajeError.style.display = "none";

  // Uso FormData para capturar los valores del formulario por el atributo name (Clase 4)
  // En vez de buscar cada input por separado, FormData los toma todos de una
  const formElement = e.currentTarget as HTMLFormElement;
  const formData = new FormData(formElement);

  // formData.get() devuelve FormDataEntryValue | null, asi que uso "as string" (Type Assertion)
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Busco si existe un usuario registrado con ese email y password
  const usuarios: IUser[] = getRegisteredUsers();
  const usuarioEncontrado: IUser | undefined = usuarios.find(
    (u: IUser) => u.email === email && u.password === password
  );

  if (!usuarioEncontrado) {
    mostrarError("Email o contraseña incorrectos.");
    return;
  }

  // Guardo la sesion en localStorage con loggedIn en true
  // Asi cuando recargue la pagina con F5, la sesion se mantiene (como dijo el profe en el video)
  const sesion: IUser = { ...usuarioEncontrado, loggedIn: true };
  saveUser(sesion);

  // Redirijo segun el rol: admin va a su panel, client va a la tienda
  if (sesion.role === "admin") {
    navigate(PATHS.ADMIN);
  } else {
    navigate(PATHS.CLIENT);
  }
});
