package sn.exo.ecole221.domain.port.repository;

import sn.exo.ecole221.domain.model.User;
import java.util.Optional;

public interface UserRepositoryPort {
    Optional<User> findByEmail(String email);
    void save(User user);
}
