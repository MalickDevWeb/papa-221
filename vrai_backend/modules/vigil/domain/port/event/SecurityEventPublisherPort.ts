import { DomainEvent } from '../../event/BadgeScannedEvent';

export interface SecurityEventPublisherPort {
  publish(event: DomainEvent): Promise<void>;
}
