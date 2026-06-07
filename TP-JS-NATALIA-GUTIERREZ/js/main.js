// main.js - TP Integrador Food Store

// ---- Datos de categorias y productos (simulan una base de datos) ----

const categorias = [
  { id: "todas",        nombre: "Todas" },
  { id: "hamburguesas", nombre: "Hamburguesas" },
  { id: "pizzas",       nombre: "Pizzas" },
  { id: "papas-fritas", nombre: "Papas Fritas" },
  { id: "bebidas",      nombre: "Bebidas" }
];

const productos = [
  {
    nombre: "Hamburguesa Clasica Completa",
    descripcion: "Hamburguesa con queso cheddar, panceta, tomate, cebolla y lechuga fresca.",
    precio: 9800,
    categoria: "hamburguesas",
    imagen: "img/hamburguesa-clasica.jpg",
    alt: "Hamburguesa triple smash con cheddar"
  },
  {
    nombre: "Pizza Pepperoni Familiar",
    descripcion: "Masa casera, salsa de tomate, pepperoni abundante y albahaca.",
    precio: 13500,
    categoria: "pizzas",
    imagen: "img/pizza.jpg",
    alt: "Pizza pepperoni y albahaca"
  },
  {
    nombre: "Papas Fritas Crujientes",
    descripcion: "Porción grande de papas fritas crocantes.",
    precio: 6200,
    categoria: "papas-fritas",
    imagen: "img/papas-fritas-crujientes.jpg",
    alt: "Papas fritas crujientes listas para servir"
  },
  {
    nombre: "Coca Cola 1.5L",
    descripcion: "Bebida cola sabor original ideal para compartir con pizzas y combos.",
    precio: 3200,
    categoria: "bebidas",
    imagen: "img/coca_1_5lt.jpg",
    alt: "Botella de Coca Cola sabor original de un litro y medio"
  }
];

// ---- Carrito (array vacio, se va llenando cuando el usuario agrega) ----

let carrito = [];

// ---- Funcion para cargar las categorias en el aside ----

const cargarCategorias = () => {
  // getElementById -> busca un elemento del HTML por su id
  const listaCategorias = document.getElementById("lista-categorias");

  categorias.forEach((categoria) => {
    // createElement -> crea un elemento nuevo en memoria (todavia no se ve en la pagina)
    const li = document.createElement("li");
    // innerHTML con backticks (``) y ${} para meter variables adentro del HTML
    li.innerHTML = `<a href="#" class="btn-categoria">${categoria.nombre}</a>`;

    // cuando hacen click en una categoria, filtra los productos
    const enlace = li.querySelector("a");
    // addEventListener -> le agrega un evento (en este caso "click") a un elemento
    enlace.addEventListener("click", (evento) => {
      // preventDefault -> evita que el link recargue o salte la pagina
      evento.preventDefault();
      cargarProductos(categoria.id);
    });

    // appendChild -> agrega el elemento que creamos como hijo del ul
    listaCategorias.appendChild(li);
  });
};

// ---- Funcion para mostrar los productos en la seccion ----
// si le paso "todas" muestra todo, sino filtra por categoria
const cargarProductos = (categoriaSeleccionada) => {
  const seccionProductos = document.getElementById("seccion-productos");
  // innerHTML = "" -> vacia el contenedor antes de volver a llenarlo
  seccionProductos.innerHTML = "";

  productos.forEach((producto) => {

    // filtro: si es "todas" lo muestra, o si coincide la categoria
    if (categoriaSeleccionada === "todas" || producto.categoria === categoriaSeleccionada) {

      const article = document.createElement("article");
      article.classList.add("card-producto");

      article.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.alt}" width="220" height="160">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p>Precio: <strong>$${producto.precio}</strong></p>
        <button type="button" class="btn-detalle">Ver Detalles</button>
        <button type="button" class="btn-carrito">Agregar al Carrito</button>
      `;

      // boton para ver info del producto con alert
      const btnDetalle = article.querySelector(".btn-detalle");
      btnDetalle.addEventListener("click", () => {
        alert(
          `Producto: ${producto.nombre}\n` +
          `Descripción: ${producto.descripcion}\n` +
          `Precio: $${producto.precio}`
        );
      });

      // boton agregar al carrito, lo pushea y guarda en localStorage
      const btnCarrito = article.querySelector(".btn-carrito");
      btnCarrito.addEventListener("click", () => {
        // push -> agrega el producto al final del array carrito
        carrito.push(producto);
        actualizarContadorCarrito();
        // localStorage.setItem -> guarda datos en el navegador (sobrevive si recargo la pagina)
        // JSON.stringify -> convierte el array/objeto a texto para poder guardarlo
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`"${producto.nombre}" fue agregado al carrito.`);
      });

      seccionProductos.appendChild(article);
    }
  });
};

// actualiza el numero que se ve en el nav ("Carrito (x)")
const actualizarContadorCarrito = () => {
// textContent -> cambia solo el texto de un elemento (no interpreta HTML)
  const contador = document.getElementById("contador-carrito");
  contador.textContent = `Carrito (${carrito.length})`;
};

// si habia algo guardado en localStorage lo recupero al recargar
const recuperarCarrito = () => {
  // localStorage.getItem -> trae lo que guarde antes con setItem
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    // JSON.parse -> convierte el texto guardado de vuelta a array/objeto
    carrito = JSON.parse(carritoGuardado);
    actualizarContadorCarrito();
  }
};

// arranca todo cuando carga la pagina
const iniciarApp = () => {
  cargarCategorias();
  cargarProductos("todas");
  recuperarCarrito();
};

iniciarApp();
