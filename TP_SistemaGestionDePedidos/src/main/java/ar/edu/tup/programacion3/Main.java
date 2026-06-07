package ar.edu.tup.programacion3;

import ar.edu.tup.programacion3.entities.Categoria;
import ar.edu.tup.programacion3.entities.DetallePedido;
import ar.edu.tup.programacion3.entities.Pedido;
import ar.edu.tup.programacion3.entities.Producto;
import ar.edu.tup.programacion3.entities.Usuario;
import ar.edu.tup.programacion3.enums.Estado;
import ar.edu.tup.programacion3.enums.FormaPago;
import ar.edu.tup.programacion3.enums.Rol;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class Main {

    public static void main(String[] args) {
        Categoria categoriaPancho = Categoria.builder().id(1L).nombre("Panchos").build();
        Categoria categoriaBebida = Categoria.builder().id(2L).nombre("Bebidas").build();

        Producto pancho = Producto.builder()
                .id(1L)
                .nombre("Pancho")
                .precio(2500)
                .stock(12)
                .categoria(categoriaPancho)
                .build();

        Producto panchoEspecial = Producto.builder()
                .id(2L)
                .nombre("Pancho Especial")
                .precio(3200)
                .stock(4)
                .categoria(categoriaPancho)
                .build();

        Producto cocaCola = Producto.builder()
                .id(3L)
                .nombre("Coca-Cola")
                .precio(1800)
                .stock(3)
                .categoria(categoriaBebida)
                .build();

        Producto agua = Producto.builder()
                .id(4L)
                .nombre("Agua")
                .precio(1200)
                .stock(0)
                .categoria(categoriaBebida)
                .build();

        Set<Producto> productos = new LinkedHashSet<>(Set.of(pancho, panchoEspecial, cocaCola, agua));

        Usuario cliente = Usuario.builder()
                .id(1L)
                .nombre("Natalia Gutierrez")
                .email("natalia@email.com")
                .rol(Rol.CLIENTE)
                .build();

        Pedido pedido1 = Pedido.builder()
                .id(1L)
                .usuario(cliente)
                .estado(Estado.ENTREGADO)
                .formaPago(FormaPago.EFECTIVO)
                .fecha(LocalDateTime.now())
                .build();
        pedido1.agregarDetalle(DetallePedido.builder().id(1L).producto(pancho).cantidad(2).build());

        Pedido pedido2 = Pedido.builder()
                .id(2L)
                .usuario(cliente)
                .estado(Estado.ENTREGADO)
                .formaPago(FormaPago.TARJETA)
                .fecha(LocalDateTime.now())
                .build();
        pedido2.agregarDetalle(DetallePedido.builder().id(2L).producto(panchoEspecial).cantidad(1).build());
        pedido2.agregarDetalle(DetallePedido.builder().id(3L).producto(cocaCola).cantidad(2).build());

        Pedido pedido3 = Pedido.builder()
                .id(3L)
                .usuario(cliente)
                .estado(Estado.PENDIENTE)
                .formaPago(FormaPago.TRANSFERENCIA)
                .fecha(LocalDateTime.now())
                .build();
        pedido3.agregarDetalle(DetallePedido.builder().id(4L).producto(pancho).cantidad(1).build());
        pedido3.agregarDetalle(DetallePedido.builder().id(5L).producto(cocaCola).cantidad(1).build());

        List<Pedido> pedidos = List.of(pedido1, pedido2, pedido3);

        System.out.println("=== 1) TOTAL DEL PEDIDO 2 ===");
        System.out.printf("Total pedido 2: $%.2f%n%n", pedido2.calcularTotal());

        System.out.println("=== 2) PRODUCTOS DISPONIBLES ===");
        obtenerProductosDisponibles(productos)
                .stream()
                .map(producto -> producto.getNombre() + " | Stock: " + producto.getStock())
                .forEach(System.out::println);

        System.out.println("\n=== 3) CANTIDAD DE ITEMS DEL PEDIDO 2 ===");
        int cantidadItemsPedido2 = calcularCantidadTotalItems(pedido2);
        System.out.println("Cantidad total de items: " + cantidadItemsPedido2);

        System.out.println("\n=== 4) PRODUCTOS CON STOCK MENOR A 5 ===");
        obtenerProductosConStockMenorA(productos, 5)
                .stream()
                .map(producto -> producto.getNombre() + " | Stock: " + producto.getStock())
                .forEach(System.out::println);

        System.out.println("\n=== EXTRA: PEDIDOS QUE CONTIENEN COCA-COLA ===");
        long pedidosConCocaCola = contarPedidosQueContienenProducto(pedidos, "Coca-Cola");
        System.out.println("Cantidad de pedidos con Coca-Cola: " + pedidosConCocaCola);
    }

    private static Set<Producto> obtenerProductosDisponibles(Set<Producto> productos) {
        return productos.stream()
                .filter(producto -> producto.getStock() > 0)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static int calcularCantidadTotalItems(Pedido pedido) {
        return pedido.getDetallesPedido().stream()
                .mapToInt(detallePedido -> detallePedido.getCantidad())
                .sum();
    }

    private static Set<Producto> obtenerProductosConStockMenorA(Set<Producto> productos, int umbral) {
        return productos.stream()
                .filter(producto -> producto.getStock() < umbral)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private static long contarPedidosQueContienenProducto(List<Pedido> pedidos, String nombreProducto) {
        return pedidos.stream()
                .filter(pedido -> pedido.getDetallesPedido().stream()
                        .anyMatch(detallePedido -> nombreProducto.equalsIgnoreCase(
                                detallePedido.getProducto().getNombre())))
                .count();
    }
}
