// Rutas de la aplicacion centralizadas en un solo lugar
// Si cambio una ruta, solo la modifico aca y se actualiza en todos los archivos
export const PATHS = {
  LOGIN: "/src/pages/auth/login/login.html",
  REGISTRO: "/src/pages/auth/registro/registro.html",
  ADMIN: "/src/pages/admin/admin.html",
  CLIENT: "/src/pages/client/client.html",
};

// Funcion para redirigir al usuario a otra pagina
export const navigate = (route: string): void => {
  window.location.href = route;
};
