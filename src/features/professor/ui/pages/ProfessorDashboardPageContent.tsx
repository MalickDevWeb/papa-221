import { useProfessorDashboardPage } from '../../hooks/useProfessorDashboardPage';
import { ProfessorHeader } from '../components/ProfessorHeader';
import { ProfessorMobileNav } from '../components/ProfessorMobileNav';
import { ProfessorSidebar } from '../components/ProfessorSidebar';
import { CheckCircle2 } from 'lucide-react';
import { ProfessorDashboardTabContent } from './ProfessorDashboardTabContent';

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Tableau de bord',
  classroom: 'Salle de Classe',
  schedule: 'Mon Emploi du Temps',
  collaboration: 'Espace Collaboration',
};

export function ProfessorDashboardPageContent() {
  const vm = useProfessorDashboardPage();

  if (vm.isLoading) return <ProfessorLoadingState />;
  if (vm.error) return <ProfessorErrorState error={vm.error} />;

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex selection:bg-brand-red-light selection:text-brand-red-deep">
      {vm.toastMessage && <ProfessorToast message={vm.toastMessage} />}
      <ProfessorSidebar
        activeTab={vm.activeTab}
        onSelectTab={vm.setActiveTab}
        profName={vm.profName}
        triggerToast={vm.triggerToast}
        courses={vm.courses}
        selectedCourseId={vm.selectedCourse?.id ?? ''}
        onSelectCourse={vm.selectCourse}
        classroomSubTab={vm.classroomSubTab}
        setClassroomSubTab={vm.setClassroomSubTab}
        schedule={vm.schedule}
      />
      <div className="flex-grow md:ml-64 bg-background min-h-screen pb-28 md:pb-0 flex flex-col min-w-0 mx-auto w-full max-w-[540px] md:max-w-none overflow-x-hidden overflow-y-auto">
        <ProfessorHeader 
          title={TAB_TITLES[vm.activeTab]} 
          profName={vm.profName} 
          activeTab={vm.activeTab} 
          onSelectTab={vm.setActiveTab} 
          triggerToast={vm.triggerToast} 
        />
        <ProfessorDashboardTabContent vm={vm} />
        <ProfessorMobileNav activeTab={vm.activeTab} onSelectTab={vm.setActiveTab} />
      </div>
    </div>
  );
}

function ProfessorLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAF8F6]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-red-deep/20 border-t-brand-red-deep rounded-full animate-spin" />
        <p className="text-sm font-bold text-secondary">Initialisation du Portail Enseignant...</p>
      </div>
    </div>
  );
}

function ProfessorErrorState({ error }: { readonly error: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAF8F6] p-6">
      <div className="bg-red-50 text-brand-red-deep p-6 rounded-2xl border border-red-100 text-center max-w-md">
        <h3 className="font-bold text-lg">Erreur d&apos;initialisation</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    </div>
  );
}

function ProfessorToast({ message }: { readonly message: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-[210] -translate-x-1/2 rounded-2xl bg-neutral-gray-900 border border-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-2xl">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default ProfessorDashboardPageContent;
