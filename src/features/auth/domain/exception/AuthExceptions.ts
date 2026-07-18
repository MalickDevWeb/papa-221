export class IdentifiantsInvalidesError extends Error {
  constructor() {
    super('Email ou mot de passe incorrect.');
    this.name = 'IdentifiantsInvalidesError';
  }
}
