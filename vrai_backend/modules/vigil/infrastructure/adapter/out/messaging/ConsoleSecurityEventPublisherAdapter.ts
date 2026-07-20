import { SecurityEventPublisherPort } from '../../../../domain/port/event/SecurityEventPublisherPort';
import { DomainEvent, BadgeScannedEvent } from '../../../../domain/event/BadgeScannedEvent';
import { ProductionStore } from '../../../../../../shared/infrastructure/store/ProductionStore';

export class ConsoleSecurityEventPublisherAdapter implements SecurityEventPublisherPort {
  private readonly store = ProductionStore.getInstance();

  public async publish(event: DomainEvent): Promise<void> {
    console.log(`[SecurityEvent] ${event.eventName} occurred at ${event.occurredAt.toISOString()}`);
    
    if (event instanceof BadgeScannedEvent) {
      console.log(` -> Scan ID: ${event.scanId}, Owner: ${event.ownerName}, Status: ${event.status}`);
      
      const eventRecord = {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        eventName: "Badge Scanné",
        occurredAt: event.occurredAt.toISOString(),
        payload: {
          scanId: event.scanId,
          badgeId: event.badgeId,
          studentId: event.studentId,
          name: event.ownerName,
          status: event.status,
          time: event.time
        }
      };
      
      this.store.insert('securityEvents', eventRecord);
    }
  }
}
