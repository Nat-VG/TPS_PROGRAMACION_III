package ar.edu.tup.programacion3.entities;

import ar.edu.tup.programacion3.enums.Estado;
import ar.edu.tup.programacion3.enums.FormaPago;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@ToString(callSuper = true)
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Pedido extends Base implements Calculable {
    private Usuario usuario;
    @Builder.Default
    private Set<DetallePedido> detallesPedido = new LinkedHashSet<>();
    private Estado estado;
    private FormaPago formaPago;
    private LocalDateTime fecha;

    public void agregarDetalle(DetallePedido detallePedido) {
        detallesPedido.add(detallePedido);
    }

    @Override
    public double calcularTotal() {
        return detallesPedido.stream()
                .mapToDouble(DetallePedido::calcularSubtotal)
                .sum();
    }
}
