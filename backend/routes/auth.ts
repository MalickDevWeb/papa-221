import { Router } from "express";

export const authRouter = Router();

authRouter.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email et mot de passe requis" });
    return;
  }

  const simulatedUsers = [
    {
      email: 'admin@ecole221.sn',
      password: 'passer',
      user: { id: 'usr-admin-01', nom: 'Sylla', prenom: 'Admin', email: 'admin@ecole221.sn', role: 'ADMIN' },
      token: 'fake-jwt-token-admin-12345'
    },
    {
      email: 'etudiant221@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-etudiant-01', nom: 'Diop', prenom: 'Assane', email: 'etudiant221@gmail.com', role: 'ETUDIANT' },
      token: 'fake-jwt-token-etudiant-221'
    },
    {
      email: 'etudiant222@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-etudiant-02', nom: 'Sow', prenom: 'Fatou', email: 'etudiant222@gmail.com', role: 'ETUDIANT' },
      token: 'fake-jwt-token-etudiant-222'
    },
    {
      email: 'etudiant223@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-etudiant-03', nom: 'Ndiaye', prenom: 'Malick', email: 'etudiant223@gmail.com', role: 'ETUDIANT' },
      token: 'fake-jwt-token-etudiant-223'
    },
    {
      email: 'admin221@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-admin-02', nom: 'Ba', prenom: 'Mariama', email: 'admin221@gmail.com', role: 'ADMIN' },
      token: 'fake-jwt-token-admin-221'
    },
    {
      email: 'professeur221@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-prof-01', nom: 'Cheikh Anta', prenom: 'Dr.', email: 'professeur221@gmail.com', role: 'PROFESSEUR' },
      token: 'fake-jwt-token-prof-221'
    },
    {
      email: 'professeur222@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-prof-02', nom: 'Seynabou', prenom: 'Mme.', email: 'professeur222@gmail.com', role: 'PROFESSEUR' },
      token: 'fake-jwt-token-prof-222'
    },
    {
      email: 'surv221@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-surv-01', nom: 'Sene', prenom: 'Ousmane', email: 'surv221@gmail.com', role: 'SECRETAIRE' },
      token: 'fake-jwt-token-surv-221'
    },
    {
      email: 'surv222@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-surv-02', nom: 'Ndiaye', prenom: 'Awa', email: 'surv222@gmail.com', role: 'SECRETAIRE' },
      token: 'fake-jwt-token-surv-222'
    },
    {
      email: 'vigile221@gmail.com',
      password: 'ecole221',
      user: { id: 'usr-vigil-01', nom: 'Diallo', prenom: 'Aboulaye', email: 'vigile221@gmail.com', role: 'VIGIL' },
      token: 'fake-jwt-token-vigil-221'
    }
  ];

  const matched = simulatedUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );

  if (matched) {
    res.json({
      user: matched.user,
      token: matched.token
    });
  } else {
    res.status(401).json({ error: "Identifiants invalides" });
  }
});
