package sn.exo.ecole221.application.service;

import org.springframework.stereotype.Service;
import sn.exo.ecole221.application.port.command.LoginCommand;
import sn.exo.ecole221.application.port.dto.LoginResponseDto;
import sn.exo.ecole221.domain.model.User;
import sn.exo.ecole221.domain.port.repository.UserRepositoryPort;

import java.util.UUID;

@Service
public class LoginService implements sn.exo.ecole221.application.port.usecase.LoginUseCase {

    private final UserRepositoryPort userRepositoryPort;

    public LoginService(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public LoginResponseDto login(LoginCommand command) {
        User user = userRepositoryPort.findByEmail(command.email())
                .orElseThrow(() -> new IllegalArgumentException("Identifiants incorrects"));

        if (!user.checkPassword(command.password())) {
            throw new IllegalArgumentException("Identifiants incorrects");
        }

        // Générer un token JWT (ou un token aléatoire pour ce squelette de démarrage)
        String token = "jwt-mock-token-" + UUID.randomUUID().toString().replace("-", "");

        return new LoginResponseDto(
                token,
                new LoginResponseDto.UserInfoDto(
                        user.getId(),
                        user.getNom(),
                        user.getPrenom(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }
}
