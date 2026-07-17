import { Entity } from '../../../../shared/domain/Entity';
import { ScolariteStatut } from '../valueobject/ScolariteStatut';

interface EleveProps {
  readonly name: string;
  readonly matricule: string;
  readonly promotionId: string;
  readonly scolarite: ScolariteStatut;
  readonly average: number;
  readonly gpa: number;
  mood?: string;
}

export class Eleve extends Entity<EleveProps> {
  private constructor(id: string, props: EleveProps) {
    super(id, props);
  }

  public static create(
    id: string,
    name: string,
    matricule: string,
    promotionId: string,
    scolariteState: 'À Jour' | 'En Retard' | 'Paiement partiel',
    average: number,
    gpa: number,
    mood?: string
  ): Eleve {
    return new Eleve(id, {
      name,
      matricule,
      promotionId,
      scolarite: ScolariteStatut.create(scolariteState),
      average,
      gpa,
      mood
    });
  }

  public get name(): string { return this._props.name; }
  public get matricule(): string { return this._props.matricule; }
  public get promotionId(): string { return this._props.promotionId; }
  public get scolarite(): ScolariteStatut { return this._props.scolarite; }
  public get average(): number { return this._props.average; }
  public get gpa(): number { return this._props.gpa; }
  public get mood(): string | undefined { return this._props.mood; }

  public updateMood(newMood: string): void {
    this._props.mood = newMood;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      matricule: this.matricule,
      promotionId: this.promotionId,
      scolarite: this.scolarite.state,
      average: this.average,
      gpa: this.gpa,
      mood: this.mood
    };
  }
}
