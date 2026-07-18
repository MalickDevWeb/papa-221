import { ExtendedCandidate } from "@/features/admin/domain/AdmissionsExtendedModels";
import { Campaign, AuditLog, Message } from "./admissionsTypes";

export type { Campaign, AuditLog, Message } from "./admissionsTypes";

let lastSyncTime = 0;
const SYNC_INTERVAL_MS = 3000; // 3 seconds throttle for background sync

export function getAdmissionsDb() {
  // Lazy background synchronization
  const now = Date.now();
  if (now - lastSyncTime > SYNC_INTERVAL_MS) {
    lastSyncTime = now;
    syncAdmissionsWithBackend();
  }

  return {
    candidates: JSON.parse(localStorage.getItem("e221_candidates") || "[]") as ExtendedCandidate[],
    campaigns: JSON.parse(localStorage.getItem("e221_campaigns") || "[]") as Campaign[],
    auditLogs: JSON.parse(localStorage.getItem("e221_audit_logs") || "[]") as AuditLog[],
    messages: JSON.parse(localStorage.getItem("e221_messages") || "[]") as Message[]
  };
}

export async function syncAdmissionsWithBackend() {
  try {
    const res = await fetch("/api/admissions/db");
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("e221_candidates", JSON.stringify(data.candidates));
      localStorage.setItem("e221_campaigns", JSON.stringify(data.campaigns));
      localStorage.setItem("e221_audit_logs", JSON.stringify(data.auditLogs));
      localStorage.setItem("e221_messages", JSON.stringify(data.messages));
      window.dispatchEvent(new Event("admissions_db_synced"));
    }
  } catch (err) {
    console.error("Admissions DB Sync failed:", err);
  }
}

export function saveAdmissionsDb(data: {
  candidates?: ExtendedCandidate[];
  campaigns?: Campaign[];
  auditLogs?: AuditLog[];
  messages?: Message[];
}) {
  const updates: Record<string, any> = {};

  if (data.candidates) {
    localStorage.setItem("e221_candidates", JSON.stringify(data.candidates));
    updates.candidates = data.candidates;
  }
  if (data.campaigns) {
    localStorage.setItem("e221_campaigns", JSON.stringify(data.campaigns));
    updates.campaigns = data.campaigns;
  }
  if (data.auditLogs) {
    localStorage.setItem("e221_audit_logs", JSON.stringify(data.auditLogs));
    updates.auditLogs = data.auditLogs;
  }
  if (data.messages) {
    localStorage.setItem("e221_messages", JSON.stringify(data.messages));
    updates.messages = data.messages;
  }

  // Immediately post updates to the true backend
  fetch("/api/admissions/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  }).catch((err) => console.error("Failed to push updates to true backend:", err));
}

export function addAuditLog(candidateId: string, action: string, user: string) {
  const db = getAdmissionsDb();
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    candidateId,
    action,
    timestamp: new Date().toISOString(),
    user
  };
  saveAdmissionsDb({ auditLogs: [newLog, ...db.auditLogs] });
}
