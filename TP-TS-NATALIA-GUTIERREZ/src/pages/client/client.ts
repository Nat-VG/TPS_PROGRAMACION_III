import { protectRoute, logout } from "../../utils/auth";

// Protejo la ruta: si no hay sesion va al login, si el rol no es client va al admin
protectRoute();

// Interfaces que definen la estructura de mis datos (Clase 2)
// Son como un "molde" que le dice a TypeScript que propiedades tiene cada objeto

interface ICategoria {
  id: string;
  nombre: string;
}

interface IProducto {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  alt: string;
}

// Interface para la respuesta completa de la API (Clase 5)
// La API no devuelve solo los productos, devuelve un "envoltorio" con metadatos
// Por eso necesito interfaces anidadas: IProductoResponse contiene ICategoria[] e IProducto[]
interface IProductoResponse {
  total: number;
  categorias: ICategoria[];
  productos: IProducto[];
}

// Variables para el carrito y los productos
let carrito: IProducto[] = [];
let todosLosProductos: IProducto[] = [];

// Capturo los elementos del DOM con querySelector y genericos (Clase 3)
// El generico <HTMLUListElement> le dice a TS que tipo de elemento espero
const listaCategorias = document.querySelector<HTMLUListElement>("#lista-categorias");
const seccionProductos = document.querySelector<HTMLDivElement>("#seccion-productos");
const contadorCarrito = document.querySelector<HTMLAnchorElement>("#contador-carrito");
const btnLogout = document.querySelector<HTMLButtonElement>("#btn-logout");

// Funcion que renderiza las categorias en el sidebar
const cargarCategorias = (categorias: ICategoria[]): void => {
  if (!listaCategorias) return;

  categorias.forEach((categoria: ICategoria): void => {
    const li: HTMLLIElement = document.createElement("li");
    li.innerHTML = `<a href="#" class="btn-categoria">${categoria.nombre}</a>`;

    // Uso instanceof como Type Guard (Clase 4) para asegurarme que el enlace existe
    const enlace = li.querySelector<HTMLAnchorElement>("a");
    if (enlace instanceof HTMLAnchorElement) {
      enlace.addEventListener("click", (evento: MouseEvent): void => {
        evento.preventDefault();
        cargarProductos(todosLosProductos, categoria.id);
      });
    }

    listaCategorias.appendChild(li);
  });
};

// Funcion que renderiza los productos filtrados por categoria
const cargarProductos = (productos: IProducto[], categoriaSeleccionada: string): void => {
  if (!seccionProductos) return;
  seccionProductos.innerHTML = "";

  productos.forEach((producto: IProducto): void => {
    if (categoriaSeleccionada === "todas" || producto.categoria === categoriaSeleccionada) {

      const article: HTMLElement = document.createElement("article");
      article.classList.add("card-producto");

      article.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.alt}" width="220" height="160">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p>Precio: <strong>$${producto.precio}</strong></p>
        <button type="button" class="btn-detalle">Ver Detalles</button>
        <button type="button" class="btn-carrito">Agregar al Carrito</button>
      `;

      // Verifico con instanceof que los botones existan antes de agregarles eventos (Clase 4)
      const btnDetalle = article.querySelector<HTMLButtonElement>(".btn-detalle");
      if (btnDetalle instanceof HTMLButtonElement) {
        btnDetalle.addEventListener("click", (): void => {
          alert(
            `Producto: ${producto.nombre}\n` +
            `Descripción: ${producto.descripcion}\n` +
            `Precio: $${producto.precio}`
          );
        });
      }

      const btnCarrito = article.querySelector<HTMLButtonElement>(".btn-carrito");
      if (btnCarrito instanceof HTMLButtonElement) {
        btnCarrito.addEventListener("click", (): void => {
          carrito.push(producto);
          actualizarContadorCarrito();
          localStorage.setItem("carrito", JSON.stringify(carrito));
          alert(`"${producto.nombre}" fue agregado al carrito.`);
        });
      }

      seccionProductos.appendChild(article);
    }
  });
};

// Actualiza el texto del contador del carrito en el header
const actualizarContadorCarrito = (): void => {
  if (contadorCarrito) {
    contadorCarrito.textContent = `Carrito (${carrito.length})`;
  }
};

// Recupera el carrito guardado en localStorage (por si el usuario recargo la pagina)
const recuperarCarrito = (): void => {
  const carritoGuardado: string | null = localStorage.getItem("carrito");
  // Uso typeof como Type Guard (Clase 4) para verificar que sea string antes de parsear
  if (typeof carritoGuardado === "string") {
    carrito = JSON.parse(carritoGuardado) as IProducto[];
    actualizarContadorCarrito();
  }
};

// Funcion asincrona que trae los datos del JSON con fetch (Clase 5)
// Es async porque fetch devuelve una Promise y necesito esperar la respuesta
// El tipo de retorno es Promise<IProductoResponse> porque toda funcion async retorna una Promise
async function obtenerDatos(): Promise<IProductoResponse> {
  const response = await fetch("/data/productos.json");

  // Verifico que la respuesta sea exitosa (status 200)
  // Si no es ok, lanzo un error para que lo atrape el catch (Clase 5)
  if (!response.ok) {
    throw new Error("Error en la petición: " + response.status);
  }

  // Casteo la respuesta JSON con mi interface para que TS sepa la estructura (Clase 5)
  const data: IProductoResponse = await response.json();
  return data;
}

// Funcion principal que inicia la app — maneja los 3 estados de UI (Clase 5):
// 1) Loading: muestro "Cargando..."
// 2) Success: renderizo los datos
// 3) Error: muestro mensaje de error si falla la peticion
async function iniciarApp(): Promise<void> {
  recuperarCarrito();

  if (!seccionProductos) return;

  // Estado Loading
  seccionProductos.innerHTML = "<p>Cargando productos...</p>";

  try {
    // Espero a que lleguen los datos con await
    const datos: IProductoResponse = await obtenerDatos();

    // Estado Success — cargo categorias y productos en el DOM
    todosLosProductos = datos.productos;
    cargarCategorias(datos.categorias);
    cargarProductos(datos.productos, "todas");

  } catch (error) {
    // Estado Error — si algo fallo (red, servidor, etc) muestro un mensaje
    seccionProductos.innerHTML =
      "<p style='color:red;'>Error al cargar los productos. Intente más tarde.</p>";
  }
}

// Boton de cerrar sesion — verifico con instanceof antes de usar (Clase 4)
if (btnLogout instanceof HTMLButtonElement) {
  btnLogout.addEventListener("click", (): void => {
    logout();
  });
}

// Inicio la aplicacion
iniciarApp();
