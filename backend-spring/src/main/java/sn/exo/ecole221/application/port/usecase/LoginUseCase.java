package sn.exo.ecole221.application.port.usecase;

import sn.exo.ecole221.application.port.command.LoginCommand;
import sn.exo.ecole221.application.port.dto.LoginResponseDto;

public interface LoginUseCase {
    LoginResponseDto login(LoginCommand command);
}
