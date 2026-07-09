import { DashboardRepository } from '../domain/DashboardRepository';

export function createSendLiveReactionUseCase(repository: DashboardRepository) {
  return async function execute(sessionId: string, type: string): Promise<Record<string, number>> {
    return await repository.sendLiveReaction(sessionId, type);
  };
}
