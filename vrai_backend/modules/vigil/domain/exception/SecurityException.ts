export class SecurityException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidBadgeException extends SecurityException {
  constructor(badgeId: string) {
    super(`Le badge ID "${badgeId}" est invalide ou malformé.`);
    this.name = 'InvalidBadgeException';
  }
}

export class CheckpointNotFoundException extends SecurityException {
  constructor(checkpointId: string) {
    super(`La borne ou le point d'accès "${checkpointId}" est introuvable.`);
    this.name = 'CheckpointNotFoundException';
  }
}
