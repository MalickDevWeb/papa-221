import React, { useState } from 'react';
import { Student } from '../../../domain/StudentModels';
import { ProfileHeader } from './profile360/ProfileHeader';
import { ProfileSidebar, ProfileTabSection } from './profile360/ProfileSidebar';
import { useStudentProfile360 } from './profile360/hooks/useStudentProfile360';
import { generateCert } from './profile360/utils/CertUtils';
import { ProfileTabContent } from './profile360/ProfileTabContent';

interface Props {
  selectedStudent: Student;
  onUpdateStudent: (student: Student) => void;
}

export function StudentProfile360Tab({ selectedStudent, onUpdateStudent }: Props) {
  const [activeSection, setActiveSection] = useState<ProfileTabSection>('general');
  const [certLoading, setCertLoading] = useState(false);
  const { erpData, loading, updateProfile } = useStudentProfile360(selectedStudent.id, selectedStudent.name);

  const handleGenerateCert = () => {
    setCertLoading(true);
    generateCert(selectedStudent);
    setTimeout(() => setCertLoading(false), 2000);
  };

  if (loading && !erpData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3" id="profile-main-loading">
        <div className="w-10 h-10 border-4 border-[#B3181C] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 font-extrabold uppercase tracking-widest animate-pulse">
          Chargement du profil 360°...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="student-360-tab-root">
      <ProfileHeader
        selectedStudent={selectedStudent}
        onGenerateCert={handleGenerateCert}
        certLoading={certLoading}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />

        <div className="flex-grow min-w-0 bg-white border border-neutral-100 rounded-2xl p-4 lg:p-5 shadow-sm min-h-[400px]">
          <ProfileTabContent
            activeSection={activeSection}
            selectedStudent={selectedStudent}
            onUpdateStudent={onUpdateStudent}
            erpData={erpData}
            updateProfile={updateProfile}
          />
        </div>
      </div>
    </div>
  );
}

