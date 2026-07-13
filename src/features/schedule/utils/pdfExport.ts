import { jsPDF } from 'jspdf';
import { addEcole221Footer, addEcole221Header, ECOLE_221_PALETTE } from '@/shared/lib/pdfTheme';
import { CourseSession } from '../domain/Schedule';

/**
 * Génère un fichier PDF ultra-professionnel et personnalisé pour l'emploi du temps de l'étudiant.
 */
export async function exportToPDF(sessions: CourseSession[], className: string = 'L3-GL') {
  // Créer l'instance jsPDF (Format A4, portrait, unité mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Marges
  const marginX = 15;
  let currentY = 15;

  const { primary: primaryColor, secondary: secondaryColor, neutral: neutralDark, lightBg, border: borderLight } = ECOLE_221_PALETTE;

  const { currentY: headerY } = await addEcole221Header(doc, {
    title: 'ÉCOLE 221 — PORTAIL ACADÉMIQUE',
    subtitle: 'EMPLOI DU TEMPS INDIVIDUEL DE L\'ÉTUDIANT',
    meta: `Semaine du 23 au 27 Octobre 2023 | Classe : ${className} | Semestre 1`,
    generatedAt: new Date(),
  }, {
    marginX,
    currentY,
    height: 30,
  });

  currentY = headerY;

  // --- TITRE PRINCIPAL ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('PLANNING DE LA SEMAINE', marginX, currentY);
  
  currentY += 3;
  // Ligne de séparation fine sous le titre principal
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);

  currentY += 8;

  // Jours ordonnés
  const joursOrdre: { code: string; label: string }[] = [
    { code: 'LUN', label: 'LUNDI' },
    { code: 'MAR', label: 'MARDI' },
    { code: 'MER', label: 'MERCREDI' },
    { code: 'JEU', label: 'JEUDI' },
    { code: 'VEN', label: 'VENDREDI' }
  ];

  joursOrdre.forEach((jour) => {
    const jourSessions = sessions
      .filter((s) => s.jour === jour.code)
      .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));

    if (jourSessions.length === 0) {
      return; // Ne pas afficher les jours vides pour gagner de la place
    }

    // Saut de page de précaution si on approche du bas de la page
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
      
      // Petit entête de rappel sur la nouvelle page
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('ÉCOLE 221 — EMPLOI DU TEMPS (Suite)', marginX, currentY);
      currentY += 3;
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.setLineWidth(0.2);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);
      currentY += 8;
    }

    // --- EN-TÊTE DU JOUR ---
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(marginX, currentY, pageWidth - (marginX * 2), 7, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(jour.label, marginX + 3, currentY + 5);

    // Date associée si disponible
    const sessionDate = jourSessions[0]?.dateStr;
    if (sessionDate) {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(230, 230, 230);
      doc.text(sessionDate + ' 2023', pageWidth - marginX - 4, currentY + 4.8, { align: 'right' });
    }

    currentY += 7;

    // --- TABLEAU DES COURS DE LA JOURNÉE ---
    // En-têtes des colonnes
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(marginX, currentY, pageWidth - (marginX * 2), 6, 'F');
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.setLineWidth(0.1);
    doc.rect(marginX, currentY, pageWidth - (marginX * 2), 6, 'S');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Horaire', marginX + 3, currentY + 4);
    doc.text('Type', marginX + 28, currentY + 4);
    doc.text('Matière / Module', marginX + 42, currentY + 4);
    doc.text('Enseignant', marginX + 115, currentY + 4);
    doc.text('Salle', marginX + 162, currentY + 4);

    currentY += 6;

    // Lignes de cours
    jourSessions.forEach((s) => {
      // Déterminer les couleurs selon le type de cours
      let badgeColor = [179, 24, 28]; // Rouge par défaut (CM)
      let badgeLabel = 'CM';
      if (s.type === 'TP') {
        badgeColor = [16, 185, 129]; // Vert
        badgeLabel = 'TP';
      } else if (s.type === 'TD') {
        badgeColor = [59, 130, 246]; // Bleu
        badgeLabel = 'TD';
      }

      // Fond blanc
      doc.setFillColor(255, 255, 255);
      doc.rect(marginX, currentY, pageWidth - (marginX * 2), 11, 'F');
      
      // Ligne de bordure inférieure
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.setLineWidth(0.1);
      doc.line(marginX, currentY + 11, pageWidth - marginX, currentY + 11);
      
      // Bordure latérale selon le type
      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.rect(marginX, currentY, 0.8, 11, 'F');

      // 1. Horaire
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(s.heureStr, marginX + 3, currentY + 7);

      // 2. Type Badge
      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.rect(marginX + 28, currentY + 3.5, 9, 4.5, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(badgeLabel, marginX + 32.5, currentY + 6.8, { align: 'center' });

      // 3. Module/Nom du cours
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      // Tronquer si trop long
      let truncatedNom = s.nom;
      if (truncatedNom.length > 36) {
        truncatedNom = truncatedNom.substring(0, 34) + '...';
      }
      doc.text(truncatedNom, marginX + 42, currentY + 7);

      // 4. Enseignant
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(neutralDark[0], neutralDark[1], neutralDark[2]);
      doc.text(s.professeur, marginX + 115, currentY + 7);

      // 5. Salle
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(s.salle, marginX + 162, currentY + 7);

      currentY += 11;
    });

    currentY += 6; // Espace entre les jours
  });

  // --- BAS DE PAGE (FOOTER) ---
  addEcole221Footer(doc, [
    "Ce document est un planning officiel de l'Université École 221.",
    "Toute modification frauduleuse est passible de sanctions disciplinaires. Consultez votre espace numérique pour les mises à jour.",
  ]);

  // Sauvegarde automatique du PDF
  doc.save(`mon-emploi-du-temps-${className.toLowerCase()}.pdf`);
}
