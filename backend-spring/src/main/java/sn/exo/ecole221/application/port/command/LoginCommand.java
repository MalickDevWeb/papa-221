package sn.exo.ecole221.application.port.command;

public record LoginCommand(
    String email,
    String password
) {}
