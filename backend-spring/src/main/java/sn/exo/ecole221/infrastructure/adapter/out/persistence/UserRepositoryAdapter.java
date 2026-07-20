package sn.exo.ecole221.infrastructure.adapter.out.persistence;

import org.springframework.stereotype.Component;
import sn.exo.ecole221.domain.model.User;
import sn.exo.ecole221.domain.port.repository.UserRepositoryPort;

import java.util.Optional;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final UserJpaRepository userJpaRepository;

    public UserRepositoryAdapter(UserJpaRepository userJpaRepository) {
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userJpaRepository.findByEmail(email)
                .map(entity -> new User(
                        entity.getId(),
                        entity.getNom(),
                        entity.getPrenom(),
                        entity.getEmail(),
                        entity.getPasswordHash(),
                        entity.getRole()
                ));
    }

    @Override
    public void save(User user) {
        UserJpaEntity entity = new UserJpaEntity();
        entity.setId(user.getId());
        entity.setNom(user.getNom());
        entity.setPrenom(user.getPrenom());
        entity.setEmail(user.getEmail());
        entity.setPasswordHash(user.getPasswordHash());
        entity.setRole(user.getRole());
        userJpaRepository.save(entity);
    }
}
