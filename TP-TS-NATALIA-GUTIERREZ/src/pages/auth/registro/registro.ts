import type { Rol } from "../../../types/Rol";
import type { IUser } from "../../../types/IUser";
import { getRegisteredUsers, saveRegisteredUsers } from "../../../utils/auth";
import { navigate, PATHS } from "../../../utils/navigate";

// Capturo los elementos del formulario con querySelector y genericos (Clase 3)
const form = document.querySelector<HTMLFormElement>("#form-registro");
const mensajeError = document.querySelector<HTMLParagraphElement>("#mensaje-error");
const mensajeExito = document.querySelector<HTMLParagraphElement>("#mensaje-exito");

// Funcion para mostrar un mensaje de error en pantalla
const mostrarError = (texto: string): void => {
  if (mensajeExito) mensajeExito.style.display = "none";
  if (mensajeError) {
    mensajeError.textContent = texto;
    mensajeError.style.display = "block";
  }
};

// Uso Optional Chaining (?.) para manejar si form fuera null (Clase 4)
form?.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();
  if (mensajeError) mensajeError.style.display = "none";
  if (mensajeExito) mensajeExito.style.display = "none";

  // Uso FormData para obtener todos los valores del formulario de una vez (Clase 4)
  const formElement = e.currentTarget as HTMLFormElement;
  const formData = new FormData(formElement);

  // Extraigo cada campo con formData.get() y casteo con "as string" (Type Assertion)
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;
  const rolValue = formData.get("rol") as string;

  // Valido que las contraseñas coincidan
  if (password !== confirmPassword) {
    mostrarError("Las contraseñas no coinciden.");
    return;
  }

  // Valido que el rol sea uno de los permitidos (Literal Types, Clase 2)
  if (rolValue !== "admin" && rolValue !== "client") {
    mostrarError("Seleccioná un rol válido.");
    return;
  }

  // Casteo el string a tipo Rol porque ya valide que es "admin" o "client"
  const rol: Rol = rolValue as Rol;

  // Verifico que no exista un usuario con el mismo email
  const usuarios: IUser[] = getRegisteredUsers();
  const existeEmail: boolean = usuarios.some((u: IUser) => u.email === email);

  if (existeEmail) {
    mostrarError("Ya existe un usuario con ese email.");
    return;
  }

  // Creo el nuevo usuario con la interface IUser (Clase 2)
  const nuevoUsuario: IUser = {
    email,
    password,
    loggedIn: false,
    role: rol,
  };

  // Lo agrego a la lista y guardo en localStorage
  usuarios.push(nuevoUsuario);
  saveRegisteredUsers(usuarios);

  // Muestro mensaje de exito
  if (mensajeError) mensajeError.style.display = "none";
  if (mensajeExito) {
    mensajeExito.textContent = "¡Registro exitoso! Redirigiendo al login...";
    mensajeExito.style.display = "block";
  }

  // Deshabilito el boton para que no se envie dos veces
  const btnSubmit = form.querySelector<HTMLButtonElement>("button");
  if (btnSubmit) btnSubmit.disabled = true;

  // Redirijo al login despues de 2 segundos
  setTimeout((): void => {
    navigate(PATHS.LOGIN);
  }, 2000);
});
