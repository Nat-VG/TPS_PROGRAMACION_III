import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { navigate, PATHS } from "./navigate";

// Claves del localStorage — las defino aca para no repetir strings sueltos
const KEYS = {
  USER_DATA: "userData",
  USERS: "users",
};

// Guarda el usuario logueado en localStorage
export const saveUser = (user: IUser): void => {
  localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
};

// Obtiene el usuario logueado desde localStorage
// Retorna IUser o null (Union Type, visto en Clase 2)
export const getUser = (): IUser | null => {
  const data: string | null = localStorage.getItem(KEYS.USER_DATA);
  // Type Guard con typeof (Clase 4) — me aseguro que sea string antes de parsear
  if (typeof data === "string") {
    return JSON.parse(data) as IUser;
  }
  return null;
};

// Elimina el usuario logueado de localStorage
export const removeUser = (): void => {
  localStorage.removeItem(KEYS.USER_DATA);
};

// Obtiene la lista de usuarios registrados desde localStorage
export const getRegisteredUsers = (): IUser[] => {
  const data: string | null = localStorage.getItem(KEYS.USERS);
  // Type Guard con typeof (Clase 4) — verifico el tipo antes de parsear
  if (typeof data === "string") {
    return JSON.parse(data) as IUser[];
  }
  return [];
};

// Guarda la lista de usuarios registrados en localStorage
export const saveRegisteredUsers = (users: IUser[]): void => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

// Interface para la configuracion de cada ruta protegida
interface RouteConfig {
  requiredRole: Rol;
  redirectIfWrongRole: string;
}

// Mapa de rutas protegidas — cada ruta tiene su rol requerido y a donde redirigir si no coincide
// Uso Index Signature (Clase 2) para tipar las claves como string
const PROTECTED_ROUTES: { [key: string]: RouteConfig } = {
  [PATHS.ADMIN]: {
    requiredRole: "admin",
    redirectIfWrongRole: PATHS.CLIENT,
  },
  [PATHS.CLIENT]: {
    requiredRole: "client",
    redirectIfWrongRole: PATHS.ADMIN,
  },
};

// Proteccion de rutas — se llama sin parametros desde cada pagina protegida
// Como explico el profe en el video: si no inicio sesion, me redirige al login
// y si mi rol no coincide con la ruta, me manda a la pagina que me corresponde
export const protectRoute = (): void => {
  const currentPath = window.location.pathname;
  const user = getUser();

  // Si no hay usuario logueado -> al login
  if (!user) {
    navigate(PATHS.LOGIN);
    return;
  }

  // Busco la config de esta ruta en el mapa
  const routeConfig = PROTECTED_ROUTES[currentPath];

  // Si la ruta esta protegida y el rol no coincide -> redirigir
  if (routeConfig && user.role !== routeConfig.requiredRole) {
    navigate(routeConfig.redirectIfWrongRole);
    return;
  }
};

// Cerrar sesion y volver al login
export const logout = (): void => {
  removeUser();
  navigate(PATHS.LOGIN);
};
