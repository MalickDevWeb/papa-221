import { Entity } from '../../../../shared/domain/Entity';

interface UserProps {
  readonly email: string;
  readonly nom: string;
  readonly prenom: string;
  readonly role: string;
}

export class User extends Entity<UserProps> {
  private constructor(id: string, props: UserProps) {
    super(id, props);
  }

  public static create(id: string, email: string, nom: string, prenom: string, role: string): User {
    return new User(id, { email, nom, prenom, role });
  }

  public get email(): string { return this._props.email; }
  public get nom(): string { return this._props.nom; }
  public get prenom(): string { return this._props.prenom; }
  public get role(): string { return this._props.role; }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      nom: this.nom,
      prenom: this.prenom,
      role: this.role
    };
  }
}
