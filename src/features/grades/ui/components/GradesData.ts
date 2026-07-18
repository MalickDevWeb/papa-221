export interface AcademicYear {
  id: string;
  year: string;
  level: string;
  specialty: string;
  average: number;
  gpa: number;
  ects: number;
  totalEcts: number;
  status: string;
  ranking: string;
  top: string;
  mention: string;
  modules: Array<{ module: string; prof: string; ects: number; note: number; moyPromo: number }>;
}

export const PREVIOUS_YEARS: AcademicYear[] = [
  {
    id: "2022-2023",
    year: "2022-2023",
    level: "Licence 1",
    specialty: "Génie Logiciel & Systèmes d'Information",
    average: 16.08,
    gpa: 3.8,
    ects: 30,
    totalEcts: 30,
    status: "Admis d'office (L1 validé)",
    ranking: "4ème / 138",
    top: "Top 3% de la promotion",
    mention: "Très Bien",
    modules: [
      { module: "Introduction aux Réseaux IP", prof: "Prof. O. Diallo", ects: 6, note: 15.80, moyPromo: 12.40 },
      { module: "Bases de Données Relationnelles", prof: "Prof. C. Diop", ects: 6, note: 16.20, moyPromo: 11.90 },
      { module: "Programmation Orientée Objet (Java)", prof: "Prof. A. Sow", ects: 8, note: 14.50, moyPromo: 12.10 },
      { module: "Systèmes d'Exploitation & Scripting", prof: "Prof. T. Mbaye", ects: 6, note: 17.00, moyPromo: 13.50 },
      { module: "Anglais Technique & Communication", prof: "Prof. J. Gomez", ects: 4, note: 18.10, moyPromo: 14.80 }
    ]
  },
  {
    id: "2021-2022",
    year: "2021-2022",
    level: "Tronc Commun",
    specialty: "Sciences & Technologies de l'Ingénieur",
    average: 14.75,
    gpa: 3.4,
    ects: 30,
    totalEcts: 30,
    status: "Admis d'office (Année validée)",
    ranking: "12ème / 152",
    top: "Top 8% de la promotion",
    mention: "Bien",
    modules: [
      { module: "Algèbre Linéaire & Analyse 1", prof: "Dr. K. Ndiaye", ects: 6, note: 14.10, moyPromo: 11.20 },
      { module: "Physique pour l'Ingénieur", prof: "Prof. M. Fall", ects: 6, note: 13.80, moyPromo: 10.50 },
      { module: "Algorithmique & Programmation C", prof: "Dr. B. Kane", ects: 8, note: 16.50, moyPromo: 12.00 },
      { module: "Méthodologie de Travail", prof: "Mme A. Tall", ects: 4, note: 15.00, moyPromo: 13.20 },
      { module: "Communication Professionnelle", prof: "Prof. J. Gomez", ects: 6, note: 14.20, moyPromo: 12.80 }
    ]
  }
];
