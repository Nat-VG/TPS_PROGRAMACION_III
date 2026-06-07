package ar.edu.tup.programacion3.entities;

import ar.edu.tup.programacion3.enums.Rol;
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
public class Usuario extends Base {
    private String nombre;
    private String email;
    private Rol rol;
}
