export function formatTimeRange(timeStr: string) {
  if (!timeStr) return { start: '', end: '', display: '' };
  const parts = timeStr.split(' - ');
  if (parts.length !== 2) return { start: timeStr, end: '', display: timeStr };
  
  const start = parts[0].replace(':', 'h');
  const end = parts[1].replace(':', 'h');
  return {
    start,
    end,
    display: `${start} ➔ ${end}`
  };
}

export function formatRoomName(roomStr: string): string {
  if (!roomStr) return '';
  const lower = roomStr.toLowerCase();
  if (lower.includes('salle') || lower.includes('amphi') || lower.includes('labo')) {
    return roomStr;
  }
  return `Salle ${roomStr}`;
}
