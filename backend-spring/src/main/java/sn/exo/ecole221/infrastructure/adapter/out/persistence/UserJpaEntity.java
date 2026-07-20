package sn.exo.ecole221.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import sn.exo.ecole221.domain.valueobject.RoleUtilisateur;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
public class UserJpaEntity {

    @Id
    private String id;

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleUtilisateur role;
}
