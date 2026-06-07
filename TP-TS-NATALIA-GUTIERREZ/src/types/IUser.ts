import type { Rol } from "./Rol";

// Interface que define la estructura de un usuario (visto en Clase 2)
// Usamos import type porque solo necesitamos el tipo Rol para compilacion
export interface IUser {
  email: string;
  password: string;
  loggedIn: boolean;
  role: Rol;
}
