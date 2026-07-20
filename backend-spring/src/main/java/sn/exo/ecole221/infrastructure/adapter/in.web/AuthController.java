package sn.exo.ecole221.infrastructure.adapter.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.exo.ecole221.application.port.command.LoginCommand;
import sn.exo.ecole221.application.port.dto.LoginResponseDto;
import sn.exo.ecole221.application.port.usecase.LoginUseCase;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // CORS pour autoriser tous les clients en dev
public class AuthController {

    private final LoginUseCase loginUseCase;

    public AuthController(LoginUseCase loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginCommand command) {
        try {
            LoginResponseDto response = loginUseCase.login(command);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).build();
        }
    }
}
