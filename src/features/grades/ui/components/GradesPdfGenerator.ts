import { jsPDF } from 'jspdf';
import { addEcole221Footer, addEcole221Header, ECOLE_221_LOGO_URL } from '@/shared/lib/pdfTheme';
import { AcademicYear } from './GradesData';

export function downloadPreviousYearPDF(year: AcademicYear, onProgress: (p: number) => void, onDone: () => void) {
  onProgress(10);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const build = () => {
    onProgress(60);
    void addEcole221Header(doc, {
      title: 'ÉCOLE 221 — PORTAIL ACADÉMIQUE',
      subtitle: 'BULLETIN DE NOTES OFFICIEL',
      meta: `Année ${year.year} | ${year.level} | ${year.specialty}`,
      generatedAt: new Date(),
    }, { marginX: 15, currentY: 15, height: 30 }).then(() => {
      doc.setDrawColor(220, 220, 220).setLineWidth(0.4).line(15, 42, 195, 42);
      doc.setFillColor(250, 249, 247).roundedRect(15, 48, 180, 28, 3, 3, "F");
      doc.setDrawColor(230, 228, 225).roundedRect(15, 48, 180, 28, 3, 3, "S");
      doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(41, 23, 21).text("INFORMATIONS", 20, 54);
      doc.setFontSize(8.5).setFont("helvetica", "normal").setTextColor(100, 100, 100);
      doc.text("Nom : Étudiant École 221", 20, 60).text(`Parcours : ${year.specialty}`, 20, 65).text(`Niveau : ${year.level}`, 20, 70);
      doc.text(`Décision : ${year.status}`, 120, 60).text(`Année d'étude : ${year.year}`, 120, 65);

      doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(179, 24, 28).text("SYNTHÈSE DES RÉSULTATS", 15, 85);
      const metrics = [
        { l: "MOYENNE", v: `${year.average.toFixed(2)}/20`, n: `Mention ${year.mention}` },
        { l: "GPA", v: `${year.gpa.toFixed(1)}/4.0`, n: "Excellent" },
        { l: "ECTS", v: `${year.ects}/${year.totalEcts}`, n: "100% Validés" },
        { l: "RANG", v: year.ranking, n: year.top }
      ];
      metrics.forEach((m, i) => {
        const x = 15 + i * 46;
        doc.setFillColor(255).setDrawColor(220).roundedRect(x, 89, 42, 19, 2, 2, "F");
        doc.roundedRect(x, 89, 42, 19, 2, 2, "S");
        doc.setFontSize(7).setTextColor(120).text(m.l, x + 21, 93, { align: "center" });
        doc.setFontSize(10).setTextColor(41, 23, 21).text(m.v, x + 21, 99, { align: "center" });
        doc.setFontSize(6.5).setTextColor(179, 24, 28).text(m.n, x + 21, 104, { align: "center" });
      });

      doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(179, 24, 28).text("DÉTAIL DES MODULES", 15, 117);
      doc.setFillColor(41, 23, 21).rect(15, 121, 180, 8, "F");
      doc.setFontSize(8).setTextColor(255).text("Module & Professeur", 18, 126.5);
      doc.text("Crédits", 110, 126.5).text("Note", 140, 126.5).text("Moy. Promo", 165, 126.5).text("Statut", 191, 126.5, { align: "right" });

      let currY = 129;
      year.modules.forEach((m, idx) => {
        if (idx % 2 === 0) doc.setFillColor(248, 247, 245).rect(15, currY, 180, 9.5, "F");
        doc.setFontSize(8).setTextColor(41, 23, 21).setFont("helvetica", "bold").text(m.module, 18, currY + 4.5);
        doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(120).text(m.prof, 18, currY + 8);
        doc.setFontSize(8).setTextColor(80).text(`${m.ects} ECTS`, 110, currY + 6);
        doc.setFont("helvetica", "bold").setTextColor(179, 24, 28).text(m.note.toFixed(2), 140, currY + 6);
        doc.setFont("helvetica", "normal").setTextColor(115).text(m.moyPromo.toFixed(2), 165, currY + 6);
        doc.setFont("helvetica", "bold").setTextColor(16, 124, 65).text("VALIDÉ", 191, currY + 6, { align: "right" });
        currY += 9.5;
      });

      const sY = 215;
      doc.setDrawColor(210).line(15, sY - 12, 195, sY - 12);
      doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(179, 24, 28).text("SIGNATURE & HOMOLOGATION", 15, sY - 6);
      doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(115);
      doc.text("Le Conseil de Direction Académique de l'École 221", 15, sY);
      doc.text("Ce relevé est certifié authentique.", 15, sY + 4);
      doc.text(`ID : E221-ID-${year.id}-${Math.floor(Math.random() * 89999 + 10000)}`, 15, sY + 8);

      doc.setDrawColor(179, 24, 28).setLineWidth(0.8).roundedRect(140, sY - 8, 55, 23, 1.5, 1.5, "S");
      doc.setFillColor(179, 24, 28).rect(140, sY - 8, 55, 4.5, "F");
      doc.setFont("helvetica", "bold").setFontSize(6.5).setTextColor(255).text("DIRECTION DES ÉTUDES - CERTIFIÉ", 167.5, sY - 4.8, { align: "center" });
      doc.setTextColor(179, 24, 28).setFontSize(8).text("ÉCOLE 221 - DAKAR", 167.5, sY + 2.5, { align: "center" });

      addEcole221Footer(doc, [
        "École 221  -  Établissement d'Enseignement Supérieur Privé Agrée par l'État",
        "bulletin de notes officiel.", "© 2026 École 221. Tous droits réservés."
      ]);

      onProgress(100);
      setTimeout(() => {
        doc.save(`bulletin_officiel_ecole221_${year.year.replace('-', '_')}.pdf`);
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
    if (ctx) { ctx.drawImage(img, 0, 0); build(); } else build();
  };
  img.onerror = () => build();
  img.src = ECOLE_221_LOGO_URL;
}
