import { jsPDF } from 'jspdf';

export const ECOLE_221_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuATOYzVUJC7e-ftTE3lXovvVvRsqHHNIhIP8N0bYAlcl5I9wc4wZieBeLSgkAtekpfHAYpMhxIa--gptb4_ZxpWd3ASeAdcpP_qpDrpO4nP2JkJIgosmzLuiGVXktceJxPhEtgMsZR-c_s5iruzviVbSlXDr6TrcW_gGdmUzWynAC6Zq-pdSXA1JAqg8IG_N4D4HAZoaQ82t3xETLWbA7hX9Gnd5mLdfidA4Ba6BeD-xvZSUi-OCy37myHKNc8Qo6GRQkUQgXCirQw';

export const ECOLE_221_PALETTE = {
  primary: [179, 24, 28] as [number, number, number],
  secondary: [41, 23, 21] as [number, number, number],
  neutral: [64, 64, 64] as [number, number, number],
  lightBg: [250, 248, 246] as [number, number, number],
  border: [226, 220, 218] as [number, number, number],
};

export type Ecole221HeaderConfig = {
  title: string;
  subtitle: string;
  meta: string;
  generatedAt?: Date | string;
};

export function formatFrenchDateTime(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  const day = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day} à ${time}`;
}

export function loadLogoImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function addEcole221Header(
  doc: jsPDF,
  config: Ecole221HeaderConfig,
  options?: { marginX?: number; currentY?: number; height?: number },
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = options?.marginX ?? 15;
  const currentY = options?.currentY ?? 15;
  const headerHeight = options?.height ?? 30;
  const { primary, secondary, neutral, lightBg, border } = ECOLE_221_PALETTE;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(marginX, currentY, pageWidth - marginX * 2, headerHeight, 'F');
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(marginX, currentY, 1.6, headerHeight, 'F');

  const textOffsetX = 23;
  const logoWidth = 16;
  const logoHeight = 16;
  const logoX = marginX + 4;
  const logoY = currentY + 6;

  try {
    const logoImg = await loadLogoImage(ECOLE_221_LOGO_URL);
    if (logoImg) {
      doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } else {
      doc.setFillColor(primary[0], primary[1], primary[2]);
      doc.ellipse(logoX + 8, logoY + 8, 8, 8, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('221', logoX + 8, logoY + 11, { align: 'center' });
    }
  } catch {
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.ellipse(logoX + 8, logoY + 8, 8, 8, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('221', logoX + 8, logoY + 11, { align: 'center' });
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(secondary[0], secondary[1], secondary[2]);
  doc.text(config.title, marginX + textOffsetX, currentY + 8);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(neutral[0], neutral[1], neutral[2]);
  doc.text(config.subtitle, marginX + textOffsetX, currentY + 13.5);
  doc.text(config.meta, marginX + textOffsetX, currentY + 18.5);

  const generatedAt = config.generatedAt instanceof Date || typeof config.generatedAt === 'string'
    ? formatFrenchDateTime(config.generatedAt)
    : formatFrenchDateTime(new Date());
  doc.setFontSize(7.2);
  doc.setTextColor(120, 120, 120);
  doc.text(`Généré le ${generatedAt}`, pageWidth - marginX - 5, currentY + 7, { align: 'right' });

  doc.setDrawColor(border[0], border[1], border[2]);
  doc.setLineWidth(0.3);
  doc.line(marginX, currentY + headerHeight + 0.6, pageWidth - marginX, currentY + headerHeight + 0.6);

  return {
    currentY: currentY + headerHeight + 6,
    marginX,
    pageWidth,
  };
}

export function addEcole221Footer(doc: jsPDF, lines: string[]) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { neutral } = ECOLE_221_PALETTE;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(neutral[0], neutral[1], neutral[2]);

  lines.forEach((line, index) => {
    doc.text(line, pageWidth / 2, pageHeight - 12 + index * 3.6, { align: 'center' });
  });
}
