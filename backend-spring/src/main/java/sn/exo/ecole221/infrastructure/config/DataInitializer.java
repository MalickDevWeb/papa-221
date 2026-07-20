package sn.exo.ecole221.infrastructure.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import sn.exo.ecole221.domain.model.User;
import sn.exo.ecole221.domain.port.repository.UserRepositoryPort;
import sn.exo.ecole221.domain.valueobject.RoleUtilisateur;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepositoryPort userRepositoryPort;

    public DataInitializer(UserRepositoryPort userRepositoryPort) {
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public void run(String... args) {
        if (userRepositoryPort.findByEmail("student@ecole221.sn").isEmpty()) {
            // Seeding standard users
            userRepositoryPort.save(new User(
                    "usr-001", "Sall", "Mamadou", "student@ecole221.sn", "password123", RoleUtilisateur.STUDENT
            ));
            userRepositoryPort.save(new User(
                    "usr-002", "Diallo", "Moussa", "prof@ecole221.sn", "password123", RoleUtilisateur.PROFESSOR
            ));
            userRepositoryPort.save(new User(
                    "usr-003", "Sy", "Aminata", "admin@ecole221.sn", "password123", RoleUtilisateur.ADMIN
            ));
            userRepositoryPort.save(new User(
                    "usr-004", "Ndiaye", "Babacar", "vigil@ecole221.sn", "password123", RoleUtilisateur.VIGIL
            ));
            System.out.println(">>> Base de données de test initialisée avec succès ! <<<");
        }
    }
}
