import axios from 'axios';

// Create central Axios instance pointing to the real Express backend API
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically inject bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || '';
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global security and robust error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[Session Expired] Redirecting to login...');
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('[Access Denied] Action non autorisée sur cet appareil.');
    }
    return Promise.reject(error);
  }
);

// --- CONTEXT SERVICES ---

export const adminService = {
  assignGate: async (gate: string, guard: string) => {
    const { data } = await apiClient.post('/admin/gates/assign', { gate, guard });
    return data;
  },
  updateStudentStatus: async (id: string, statutFrais: string) => {
    const { data } = await apiClient.patch(`/admin/students/${id}/status`, { statutFrais });
    return data;
  },
  assignSchedule: async (courseId: string, day: string, time: string, room: string, professorId?: string) => {
    const { data } = await apiClient.post('/admin/schedule/assign', { courseId, day, time, room, professorId });
    return data;
  },
  getRealtimeLogs: async () => {
    const { data } = await apiClient.get('/admin/realtime-logs');
    return data;
  },
};

export const securityService = {
  getCheckpointStatus: async () => {
    const { data } = await apiClient.get('/security/checkpoint-status');
    return data;
  },
  submitScanLog: async (badgeId: string) => {
    const { data } = await apiClient.post('/security/scan-logs', { badgeId });
    return data;
  },
};

export const studentService = {
  getDashboard: async () => {
    const { data } = await apiClient.get('/student/dashboard');
    return data;
  },
  getDigitalBadge: async () => {
    const { data } = await apiClient.get('/student/digital-badge');
    return data;
  },
};

export const profService = {
  getClassStudents: async (classId: string) => {
    const { data } = await apiClient.get(`/prof/classes/${classId}/students`);
    return data;
  },
  submitAttendance: async (classId: string, absences: string[]) => {
    const { data } = await apiClient.post('/prof/attendance/submit', { classId, absences });
    return data;
  },
  getTodaySchedule: async () => {
    const { data } = await apiClient.get('/prof/today-schedule');
    return data;
  },
};
