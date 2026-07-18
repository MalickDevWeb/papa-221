import { DashboardRepository } from '../../domain/DashboardRepository';
import { DashboardData, Attendance, LiveSession } from '../../domain/Dashboard';
import { apiClient } from '@/shared/lib/apiClient';

export class InMemoryDashboardRepository implements DashboardRepository {
  private attendances: Attendance[] = [];
  private liveSessions: LiveSession[] = [
    {
      id: "live-1",
      courseName: "Architecture Microservices",
      teacherName: "Dr. Aly Diatta",
      title: "Introduction aux patterns CQRS",
      status: "finished",
      attendeesCount: 42,
      reactions: { '👍': 12, '💡': 5 },
      chatMessages: [
        { id: "1", user: "Dr. Aly Diatta", text: "Bienvenue à tous dans cette session.", timestamp: "14:00", isTeacher: true }
      ]
    }
  ];

  async getDashboardData(): Promise<DashboardData> {
    await new Promise(r => setTimeout(r, 400));
    let currentLiveSessions = [...this.liveSessions];
    let currentProfile = { id: "usr-1", name: "Abdoulaye Diallo", matricule: "SN-2026-8492", promotion: "M1 Architecture Logicielle", gpa: "3.8/4.0" };
    try {
      const [liveRes, profRes] = await Promise.all([
        apiClient.get('/student/live-sessions').catch(() => null),
        apiClient.get('/student/profile').catch(() => null)
      ]);
      if (liveRes?.data?.length) currentLiveSessions = liveRes.data;
      if (profRes?.data?.name) {
        currentProfile = {
          id: profRes.data.matricule || "usr-1",
          name: profRes.data.name,
          matricule: profRes.data.matricule || "SN-2026-8492",
          promotion: profRes.data.promotion || "M1 Architecture Logicielle",
          gpa: profRes.data.gpa ? `${profRes.data.gpa}/4.0` : "3.8/4.0"
        };
      }
    } catch (err) {
      console.warn("Dashboard API fetch error:", err);
    }
    return { profile: currentProfile, attendances: this.attendances, liveSessions: currentLiveSessions };
  }

  async registerClockIn(type: string, method: string): Promise<Attendance> {
    await new Promise(r => setTimeout(r, 300));
    const newAtt: Attendance = {
      id: "att-" + Date.now(),
      timestamp: new Date().toISOString(),
      type,
      method,
      status: "Validé",
      salle: "Amphi A (École 221)",
      location: "Campus Dakar Plateau"
    };
    this.attendances = [newAtt, ...this.attendances];
    return newAtt;
  }

  async sendLiveReaction(sessionId: string, type: string): Promise<Record<string, number>> {
    try {
      const res = await apiClient.post(`/student/live-sessions/${sessionId}/reaction`, { type });
      return res.data.reactions || {};
    } catch {
      const session = this.liveSessions.find(s => s.id === sessionId);
      if (!session) throw new Error("Session not found");
      const newReactions = { ...session.reactions, [type]: (session.reactions[type] || 0) + 1 };
      this.liveSessions = this.liveSessions.map((item) =>
        item.id === sessionId ? { ...item, reactions: newReactions } : item
      );
      return newReactions;
    }
  }

  async sendLiveChat(sessionId: string, user: string, text: string): Promise<LiveSession> {
    try {
      const res = await apiClient.post(`/student/live-sessions/${sessionId}/chat`, { user, text });
      return res.data;
    } catch {
      const session = this.liveSessions.find(s => s.id === sessionId);
      if (!session) throw new Error("Session not found");
      const newMsg = {
        id: "msg-" + Date.now(),
        user,
        text,
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        isTeacher: false
      };
      const updatedSession = { ...session, chatMessages: [...session.chatMessages, newMsg] };
      this.liveSessions = this.liveSessions.map((item) =>
        item.id === sessionId ? updatedSession : item
      );
      return updatedSession;
    }
  }
}
