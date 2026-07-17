import { ValueObject } from '../../../../shared/domain/ValueObject';

interface ScolariteStatutProps {
  readonly state: 'À Jour' | 'En Retard' | 'Paiement partiel';
  readonly label: string;
}

export class ScolariteStatut extends ValueObject<ScolariteStatutProps> {
  public static create(state: 'À Jour' | 'En Retard' | 'Paiement partiel'): ScolariteStatut {
    let label = 'Scolarité en règle';
    if (state === 'En Retard') {
      label = 'Paiement en retard';
    } else if (state === 'Paiement partiel') {
      label = 'Paiement partiel effectué';
    }
    return new ScolariteStatut({ state, label });
  }

  public get state(): string {
    return this.props.state;
  }

  public get label(): string {
    return this.props.label;
  }
}
