import { SecurityEventPublisherPort } from '../../../../domain/port/event/SecurityEventPublisherPort';
import { DomainEvent } from '../../../../domain/event/BadgeScannedEvent';

export class ConsoleSecurityEventPublisherAdapter implements SecurityEventPublisherPort {
  public async publish(event: DomainEvent): Promise<void> {
    console.log(`[Security Event Published] ${event.eventName} occurred at ${event.occurredAt.toISOString()}:`, JSON.stringify(event));
  }
}
