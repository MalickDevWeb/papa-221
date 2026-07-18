import { LiveSession } from '../domain/Dashboard';
import { DashboardRepository } from '../domain/DashboardRepository';

export function createSendLiveChatUseCase(repository: DashboardRepository) {
  return async function execute(sessionId: string, user: string, text: string): Promise<LiveSession> {
    if (!text.trim()) throw new Error("Le message ne peut pas être vide");
    return await repository.sendLiveChat(sessionId, user, text);
  };
}
