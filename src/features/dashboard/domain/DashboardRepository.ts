import { DashboardData, Attendance, LiveSession } from './Dashboard';

export interface DashboardRepository {
  getDashboardData(): Promise<DashboardData>;
  registerClockIn(type: string, method: string): Promise<Attendance>;
  sendLiveReaction(sessionId: string, type: string): Promise<Record<string, number>>;
  sendLiveChat(sessionId: string, user: string, text: string): Promise<LiveSession>;
}
