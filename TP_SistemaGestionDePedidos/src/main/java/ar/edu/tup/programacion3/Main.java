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

        System.out.println("Total del pedido 2:");
        System.out.printf("Total pedido 2: $%.2f%n%n", pedido2.calcularTotal());

        System.out.println("Productos disponibles:");
        productos.stream()
                .filter(producto -> producto.getStock() > 0)
                .map(producto -> producto.getNombre() + " | Stock: " + producto.getStock())
                .forEach(System.out::println);

        System.out.println("\nCantidad de items del pedido 2:");
        int cantidadItemsPedido2 = pedido2.getDetallesPedido().stream()
                .mapToInt(detallePedido -> detallePedido.getCantidad())
                .sum();
        System.out.println("Cantidad total de items: " + cantidadItemsPedido2);

        System.out.println("\nProductos con stock menor a 5:");
        productos.stream()
                .filter(producto -> producto.getStock() < 5)
                .map(producto -> producto.getNombre() + " | Stock: " + producto.getStock())
                .forEach(System.out::println);

        System.out.println("\nPedidos que contienen Coca-Cola:");
        long pedidosConCocaCola = pedidos.stream()
                .filter(pedido -> pedido.getDetallesPedido().stream()
                        .anyMatch(detallePedido -> "Coca-Cola".equalsIgnoreCase(
                                detallePedido.getProducto().getNombre())))
                .count();
        System.out.println("Cantidad de pedidos con Coca-Cola: " + pedidosConCocaCola);
    }
}
