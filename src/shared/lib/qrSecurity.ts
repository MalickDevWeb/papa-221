export function generateQRToken(matricule: string, minuteEpoch: number): string {
  const input = `${matricule}:${minuteEpoch}:ecole221secret`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase();
}

export function getDynamicBadgeData(matricule: string, name: string, minuteEpoch: number): string {
  const token = generateQRToken(matricule, minuteEpoch);
  return `STU_SECURE:${matricule}:${minuteEpoch}:${token}`;
}
