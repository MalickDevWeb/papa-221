package sn.exo.ecole221.application.port.dto;

import sn.exo.ecole221.domain.valueobject.RoleUtilisateur;

public record LoginResponseDto(
    String token,
    UserInfoDto user
) {
    public record UserInfoDto(
        String id,
        String nom,
        String prenom,
        String email,
        RoleUtilisateur role
    ) {}
}
