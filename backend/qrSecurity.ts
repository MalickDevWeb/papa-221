export function generateQRToken(matricule: string, minuteEpoch: number): string {
  const input = `${matricule}:${minuteEpoch}:ecole221secret`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase();
}

export function validateDynamicBadge(badgeId: string): { valid: boolean; matricule?: string; error?: string } {
  if (!badgeId.startsWith("STU_SECURE:")) {
    return { valid: false, error: "Format QR non sécurisé. Les copies ou photos de codes statiques ne sont pas autorisés." };
  }
  
  const parts = badgeId.split(":");
  if (parts.length !== 4) {
    return { valid: false, error: "Code QR corrompu ou invalide." };
  }
  
  const [_, matricule, minuteEpochStr, token] = parts;
  const minuteEpoch = parseInt(minuteEpochStr, 10);
  if (isNaN(minuteEpoch)) {
    return { valid: false, error: "Données temporelles du QR code invalides." };
  }
  
  const currentEpoch = Math.floor(Date.now() / 60000);
  const diff = Math.abs(currentEpoch - minuteEpoch);
  
  if (diff > 1) {
    return { valid: false, error: "Code QR expiré. Il se renouvelle automatiquement chaque minute pour éviter la fraude." };
  }
  
  const expectedToken = generateQRToken(matricule, minuteEpoch);
  if (expectedToken !== token) {
    return { valid: false, error: "Clé de sécurité QR invalide (suspicion de fraude)." };
  }
  
  return { valid: true, matricule };
}
