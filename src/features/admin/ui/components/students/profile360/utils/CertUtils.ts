import { Student } from '../../../../domain/StudentModels';

export function generateCert(student: Student) {
  const content = `
=========================================
      CERTIFICAT DE SCOLARITÉ ERP
=========================================
L'École 221 atteste par la présente que l'étudiant(e) :
Nom : ${student.name}
Matricule : ${student.matricule}
Classe : ${student.classe}
Moyenne Générale : ${student.gpa}

Est régulièrement inscrit(e) au sein de notre établissement
pour l'année universitaire en cours.

Fait à Dakar, le ${new Date().toLocaleDateString('fr-FR')}
Le Directeur Académique, École 221.
=========================================
  `;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Certificat_Scolarite_${student.matricule}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
