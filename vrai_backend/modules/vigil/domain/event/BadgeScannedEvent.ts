export interface DomainEvent {
  readonly occurredAt: Date;
  readonly eventName: string;
}

export class BadgeScannedEvent implements DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventName = 'BadgeScannedEvent';

  constructor(
    public readonly scanId: string,
    public readonly badgeId: string,
    public readonly studentId: string,
    public readonly ownerName: string,
    public readonly status: 'Autorisé' | 'Refusé',
    public readonly time: string
  ) {
    this.occurredAt = new Date();
    Object.freeze(this);
  }
}
