import { jsPDF } from 'jspdf';
import { addEcole221Footer, addEcole221Header, ECOLE_221_LOGO_URL } from '@/shared/lib/pdfTheme';
import { AcademicYear } from './GradesData';

export interface CustomPdfOptions {
  studentName: string;
  specialty: string;
  level: string;
  academicYear: string;
  signature: string;
  themeColor: 'red' | 'blue' | 'green' | 'gold';
}

const PALETTES = {
  red: { primary: [179, 24, 28] as [number, number, number], secondary: [41, 23, 21] as [number, number, number] },
  blue: { primary: [30, 41, 59] as [number, number, number], secondary: [15, 23, 42] as [number, number, number] },
  green: { primary: [16, 185, 129] as [number, number, number], secondary: [6, 78, 59] as [number, number, number] },
  gold: { primary: [217, 119, 6] as [number, number, number], secondary: [120, 53, 4] as [number, number, number] },
};

export function generateCustomGradePdf(
  year: AcademicYear,
  opts: CustomPdfOptions,
  onProgress: (p: number) => void,
  onDone: () => void
) {
  onProgress(15);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { primary, secondary } = PALETTES[opts.themeColor];

  const build = () => {
    onProgress(60);
    void addEcole221Header(doc, {
      title: 'ÉCOLE 221 — BULLETIN DE NOTES',
      subtitle: `BULLETIN OFFICIEL DE FIN DE SEMESTRE / ANNÉE`,
      meta: `${opts.level} | ${opts.specialty} | ${opts.academicYear}`,
      generatedAt: new Date(),
    }, { marginX: 15, currentY: 15, height: 30 }).then(() => {
      doc.setDrawColor(220, 220, 220).setLineWidth(0.4).line(15, 42, 195, 42);
      
      // Info Panel
      doc.setFillColor(250, 249, 247).roundedRect(15, 48, 180, 26, 3, 3, "F");
      doc.setDrawColor(230, 228, 225).roundedRect(15, 48, 180, 26, 3, 3, "S");
      doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(secondary[0], secondary[1], secondary[2]).text("IDENTIFICATION DE L'ÉTUDIANT", 20, 53.5);
      doc.setFontSize(8).setFont("helvetica", "normal").setTextColor(100, 100, 100);
      doc.text(`Nom complet : ${opts.studentName}`, 20, 59);
      doc.text(`Niveau d'études : ${opts.level}`, 20, 64);
      doc.text(`Spécialité : ${opts.specialty}`, 20, 69);
      doc.text(`Décision finale : ${year.status}`, 120, 59);
      doc.text(`Année académique : ${opts.academicYear}`, 120, 64);

      // Synthesis Metrics
      doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(primary[0], primary[1], primary[2]).text("SYNTHÈSE GLOBALE", 15, 83);
      const metrics = [
        { l: "MOYENNE", v: `${year.average.toFixed(2)}/20`, n: `Mention ${year.mention}` },
        { l: "GPA ESTIMÉ", v: `${year.gpa.toFixed(1)}/4.0`, n: year.average >= 14 ? "Excellent" : "Satisfaisant" },
        { l: "CRÉDITS ECTS", v: `${year.ects}/${year.totalEcts}`, n: `${Math.round((year.ects / year.totalEcts) * 100)}% validés` },
        { l: "RANG COHORTE", v: year.ranking, n: year.top }
      ];

      metrics.forEach((m, i) => {
        const x = 15 + i * 46;
        doc.setFillColor(255).setDrawColor(220).roundedRect(x, 87, 42, 18, 2, 2, "F");
        doc.roundedRect(x, 87, 42, 18, 2, 2, "S");
        doc.setFontSize(6.5).setTextColor(120).text(m.l, x + 21, 91, { align: "center" });
        doc.setFontSize(9.5).setTextColor(secondary[0], secondary[1], secondary[2]).setFont("helvetica", "bold").text(m.v, x + 21, 97, { align: "center" });
        doc.setFontSize(6).setTextColor(primary[0], primary[1], primary[2]).setFont("helvetica", "normal").text(m.n, x + 21, 102, { align: "center" });
      });

      // Modules Table Header
      doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(primary[0], primary[1], primary[2]).text("RELEVÉ DÉTAILLÉ DES UNITÉS D'ENSEIGNEMENT", 15, 114);
      doc.setFillColor(secondary[0], secondary[1], secondary[2]).rect(15, 118, 180, 7.5, "F");
      doc.setFontSize(7.5).setTextColor(255).text("Module & Enseignant référent", 18, 123);
      doc.text("Crédits", 110, 123).text("Note / 20", 140, 123).text("Moy. Promo", 165, 123).text("Statut", 191, 123, { align: "right" });

      let currY = 125.5;
      year.modules.forEach((m, idx) => {
        if (idx % 2 === 0) doc.setFillColor(248, 247, 245).rect(15, currY, 180, 9, "F");
        doc.setFontSize(7.5).setTextColor(secondary[0], secondary[1], secondary[2]).setFont("helvetica", "bold").text(m.module, 18, currY + 4);
        doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(120).text(m.prof, 18, currY + 7.5);
        doc.setFontSize(7.5).setTextColor(80).text(`${m.ects} ECTS`, 110, currY + 5);
        doc.setFont("helvetica", "bold").setTextColor(primary[0], primary[1], primary[2]).text(m.note.toFixed(2), 140, currY + 5);
        doc.setFont("helvetica", "normal").setTextColor(115).text(m.moyPromo.toFixed(2), 165, currY + 5);
        
        const isValide = m.note >= 10;
        doc.setFont("helvetica", "bold").setTextColor(isValide ? 16 : primary[0], isValide ? 124 : primary[1], isValide ? 65 : primary[2])
          .text(isValide ? "VALIDÉ" : "RATTRAPAGE", 191, currY + 5, { align: "right" });
        currY += 9;
      });

      // Signature Panel
      const sY = 215;
      doc.setDrawColor(210).line(15, sY - 10, 195, sY - 10);
      doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(primary[0], primary[1], primary[2]).text("SIGNATURES ET HOMOLOGATION", 15, sY - 4);
      doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(115);
      doc.text(opts.signature, 15, sY + 2);
      doc.text("Document officiel certifié et signé numériquement par l'établissement.", 15, sY + 6);
      doc.text(`Identifiant d'archivage : E221-${year.id}-${Math.floor(Math.random() * 89999 + 10000)}`, 15, sY + 10);

      // Seal Box
      doc.setDrawColor(primary[0], primary[1], primary[2]).setLineWidth(0.6).roundedRect(138, sY - 6, 57, 21, 1.5, 1.5, "S");
      doc.setFillColor(primary[0], primary[1], primary[2]).rect(138, sY - 6, 57, 4, "F");
      doc.setFont("helvetica", "bold").setFontSize(6).setTextColor(255).text("DIRECTION DES ÉTUDES - CERTIFIÉ", 166.5, sY - 3, { align: "center" });
      doc.setTextColor(primary[0], primary[1], primary[2]).setFontSize(7.5).text("ÉCOLE 221 - SÉNÉGAL", 166.5, sY + 5, { align: "center" });

      addEcole221Footer(doc, [
        "École 221  -  Établissement d'Enseignement Supérieur Privé Agréé par l'État",
        "Document généré par le portail numérique officiel de l'étudiant.", "© 2026 École 221. Tous droits réservés."
      ]);

      onProgress(100);
      setTimeout(() => {
        doc.save(`bulletin_${opts.studentName.toLowerCase().replace(/\s+/g, '_')}_${year.year}.pdf`);
        onDone();
      }, 500);
    });
  };

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (ctx && img.width > 0) { ctx.drawImage(img, 0, 0); build(); } else build();
  };
  img.onerror = () => build();
  img.src = ECOLE_221_LOGO_URL;
}
