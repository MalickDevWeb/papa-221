/**
 * Centralized Application Configurations
 * Following Clean Architecture and SOLID design principles.
 * Defines colors, typography, styles, mock data, and functional configurations.
 */
export const APP_CONFIG = {
  // Styles, Themes, and Color Schemes (Centralized layout tokens)
  theme: {
    colors: {
      brandRedDeep: '#E31E24',
      brandRedDark: '#ba0013',
      brandRedDarker: '#8C1012',
      brandRedLight: '#FCE8E6',
      bgLightGray: '#F1F3F5',
      bgWhite: '#FFFFFF',
      textPrimary: '#1A1C1E',
      textSecondary: '#5D5E61',
      textBrandRed: '#ba0013',
      textSuccess: '#28A745',
      successGreen: '#28A745',
    },
    // Tailwind Class abstractions to keep HTML/JSX elements perfectly clean and consistent
    classes: {
      pageWrapper: 'flex flex-col gap-5 px-4 py-3 pb-16 max-w-md mx-auto',
      segmentedControl: 'flex bg-[#F1F3F5] p-1.5 rounded-2xl border border-neutral-200/80',
      activeTabButton: 'flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 bg-white text-[#ba0013] shadow-md font-extrabold',
      inactiveTabButton: 'flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold tracking-tight transition-all duration-200 text-neutral-500 hover:text-black',
      scannerFrame: 'relative rounded-[32px] overflow-hidden shadow-lg aspect-square border border-neutral-200/60 bg-black',
      targetBox: 'relative w-56 h-56 border border-white/20 rounded-[28px] overflow-hidden flex flex-col items-center justify-center',
      manualButton: 'w-full bg-white border border-rose-100 hover:border-[#ba0013] p-4 rounded-2xl flex items-center justify-center gap-3 shadow-xs active:scale-[0.98] transition-all group',
      badgeCard: 'bg-white border-2 border-[#E31E24] rounded-[28px] p-8 shadow-md text-center flex flex-col items-center',
      badgeTitle: 'text-xs font-extrabold text-[#5d3f3c] uppercase tracking-[0.15em] opacity-80',
      badgeQRContainer: 'bg-white p-4 rounded-2xl shadow-xs border border-neutral-100 flex flex-col items-center justify-center my-4',
      badgeFooterTextPrimary: 'text-2xl font-black text-[#ba0013] tracking-wide font-headline-lg',
      badgeFooterTextSecondary: 'text-xs font-semibold text-[#5d5e61] mt-1.5 uppercase tracking-wider',
      dialogOverlay: 'fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[200] p-4',
      dialogContent: 'bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 animate-[fadeIn_0.2s_ease-out]',
      feedbackOverlay: 'fixed inset-0 flex items-center justify-center z-[250] p-4 pointer-events-none',
    },
  },

  // Centralized Application Copy and Wording
  texts: {
    tabScanner: 'Scanner un badge',
    tabMyBadge: 'Mon Badge',
    badgeHeader: 'MON BADGE - VIGILE',
    schoolName: 'ÉCOLE 221',
    securityBadgeRole: 'Sécurité | Accès',
    manualInputTrigger: 'Saisie manuelle du matricule',
    simulationBanner: 'Simuler la détection automatique du badge étudiant',
    manualDialogTitle: 'Saisie du matricule',
    manualDialogDescription: "Entrez le numéro d'identification de l'étudiant à contrôler.",
    manualDialogPlaceholder: 'Ex: 221-5092-B',
    btnCancel: 'Annuler',
    btnValidate: 'Valider',
    simulatorActive: 'Simulateur Actif',
    simulatorClickHint: 'Cliquez sur le carré pour simuler le scan',
    errorBadgeUnknown: 'Code Inconnu ou Frais non réglés',
    cameraBack: 'Caméra Face',
    cameraFront: 'Caméra Devant',
  },

  // Scanner Functional Settings
  scanner: {
    fps: 15,
    qrbox: {
      width: 220,
      height: 220,
    },
    defaultSimulatedBadge: '221-5092-B',
    finderSize: 21,
    finderSeed: 73,
    beepFrequencyStart: 523.25, // C5
    beepFrequencyEnd: 1046.50, // C6
    beepDuration: 0.3,
  },

  // Mocks Data and Fallbacks
  vigilMock: {
    id: 'usr-vigil-01',
    nom: 'Diallo',
    prenom: 'Aboulaye',
    badgeId: 'E221-SEC-042',
    equipe: 'Alpha Team',
    derniereConnexion: '08:30 Aujourd’hui',
    statut: 'Opérationnel',
  },

  studentMock: {
    badgeOwner: 'Mamadou Ndiaye',
    studentId: '221-5092-B',
    statut: 'Autorisé',
    message: 'Badge validé avec succès',
    assiduite: '98%',
    statutFrais: 'À jour',
    zone: 'Bâtiment C - Entrée Nord',
    time: '14:32',
  },
};
