import { AuthRepositoryPort } from '../../../../domain/port/AuthRepositoryPort';
import { User } from '../../../../domain/model/User';
import { readDb } from '../../../../../../../backend/db';

const simulatedUsers = [
  {
    email: "admin@ecole221.sn",
    password: "passer",
    user: { id: "usr-admin-01", nom: "Sylla", prenom: "Admin", email: "admin@ecole221.sn", role: "ADMIN" },
    token: "fake-jwt-token-admin-12345"
  },
  {
    email: "etudiant221@gmail.com",
    password: "ecole221",
    user: { id: "usr-etudiant-01", nom: "Diop", prenom: "Assane", email: "etudiant221@gmail.com", role: "ETUDIANT" },
    token: "fake-jwt-token-etudiant-221"
  },
  {
    email: "etudiant222@gmail.com",
    password: "ecole221",
    user: { id: "usr-etudiant-02", nom: "Sow", prenom: "Fatou", email: "etudiant222@gmail.com", role: "ETUDIANT" },
    token: "fake-jwt-token-etudiant-222"
  },
  {
    email: "etudiant223@gmail.com",
    password: "ecole221",
    user: { id: "usr-etudiant-03", nom: "Ndiaye", prenom: "Malick", email: "etudiant223@gmail.com", role: "ETUDIANT" },
    token: "fake-jwt-token-etudiant-223"
  },
  {
    email: "admin221@gmail.com",
    password: "ecole221",
    user: { id: "usr-admin-02", nom: "Ba", prenom: "Mariama", email: "admin221@gmail.com", role: "ADMIN" },
    token: "fake-jwt-token-admin-221"
  },
  {
    email: "professeur221@gmail.com",
    password: "ecole221",
    user: { id: "usr-prof-01", nom: "Cheikh Anta", prenom: "Dr.", email: "professeur221@gmail.com", role: "PROFESSEUR" },
    token: "fake-jwt-token-prof-221"
  },
  {
    email: "professeur222@gmail.com",
    password: "ecole221",
    user: { id: "usr-prof-02", nom: "Seynabou", prenom: "Mme.", email: "professeur222@gmail.com", role: "PROFESSEUR" },
    token: "fake-jwt-token-prof-222"
  },
  {
    email: "surv221@gmail.com",
    password: "ecole221",
    user: { id: "usr-surv-01", nom: "Sene", prenom: "Ousmane", email: "surv221@gmail.com", role: "SECRETAIRE" },
    token: "fake-jwt-token-surv-221"
  },
  {
    email: "surv222@gmail.com",
    password: "ecole221",
    user: { id: "usr-surv-02", nom: "Ndiaye", prenom: "Awa", email: "surv222@gmail.com", role: "SECRETAIRE" },
    token: "fake-jwt-token-surv-222"
  },
  {
    email: "vigile221@gmail.com",
    password: "ecole221",
    user: { id: "usr-vigil-01", nom: "Diallo", prenom: "Aboulaye", email: "vigile221@gmail.com", role: "VIGIL" },
    token: "fake-jwt-token-vigil-221"
  }
];

export class JsonAuthRepositoryAdapter implements AuthRepositoryPort {
  async findByEmail(email: string): Promise<{ user: User; passwordHash: string; token: string } | null> {
    const db = readDb();
    const users = db.users || [];
    const matched = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase().trim() || 
                  (u.tempIdentifier && u.tempIdentifier.toLowerCase() === email.toLowerCase().trim())
    );
    if (matched) {
      const userEntity = User.create(
        matched.id,
        matched.email,
        matched.nom,
        matched.prenom || "Candidat",
        matched.role
      );
      return {
        user: userEntity,
        passwordHash: matched.password || "",
        token: matched.token || `fake-jwt-token-${matched.id}`
      };
    }
    const fallbackMatched = simulatedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!fallbackMatched) return null;
    const userEntity = User.create(
      fallbackMatched.user.id,
      fallbackMatched.user.email,
      fallbackMatched.user.nom,
      fallbackMatched.user.prenom,
      fallbackMatched.user.role
    );
    return {
      user: userEntity,
      passwordHash: fallbackMatched.password,
      token: fallbackMatched.token
    };
  }
}
