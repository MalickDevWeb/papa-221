package sn.exo.ecole221.domain.model;

import sn.exo.ecole221.domain.valueobject.RoleUtilisateur;

public class User {
    private final String id;
    private final String nom;
    private final String prenom;
    private final String email;
    private final String passwordHash;
    private final RoleUtilisateur role;

    public User(String id, String nom, String prenom, String email, String passwordHash, RoleUtilisateur role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public String getId() { return id; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public RoleUtilisateur getRole() { return role; }

    public boolean checkPassword(String plainPassword) {
        // En prod, utiliser un BCryptPasswordEncoder délégué ou injecté
        return this.passwordHash.equals(plainPassword);
    }
}
