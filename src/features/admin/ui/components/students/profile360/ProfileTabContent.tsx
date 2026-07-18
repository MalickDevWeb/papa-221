import React from 'react';
import { Student } from '../../../../domain/StudentModels';
import { ProfileTabSection } from './ProfileSidebar';
import { TabGeneral } from './TabGeneral';
import { TabAcademic } from './TabAcademic';
import { TabGrades } from './TabGrades';
import { TabAttendance } from './TabAttendance';
import { TabFinances } from './TabFinances';
import { TabActivities } from './TabActivities';
import { TabSecurity } from './TabSecurity';
import { TabCommunication } from './TabCommunication';
import { TabAI } from './TabAI';

interface TabContentProps {
  activeSection: ProfileTabSection;
  selectedStudent: Student;
  onUpdateStudent: (s: Student) => void;
  erpData: any;
  updateProfile: (fields: any) => Promise<boolean>;
}

export function ProfileTabContent({
  activeSection,
  selectedStudent,
  onUpdateStudent,
  erpData,
  updateProfile
}: TabContentProps) {
  switch (activeSection) {
    case 'general':
      return (
        <TabGeneral 
          selectedStudent={selectedStudent} 
          onUpdateStudent={onUpdateStudent} 
          erpData={erpData}
          onUpdateProfileFields={updateProfile}
        />
      );
    case 'academic':
      return <TabAcademic selectedStudent={selectedStudent} erpData={erpData} />;
    case 'grades':
      return <TabGrades selectedStudent={selectedStudent} erpData={erpData} />;
    case 'attendance':
      return <TabAttendance selectedStudent={selectedStudent} erpData={erpData} />;
    case 'finances':
      return <TabFinances selectedStudent={selectedStudent} erpData={erpData} />;
    case 'activities':
      return <TabActivities selectedStudent={selectedStudent} erpData={erpData} />;
    case 'security':
      return <TabSecurity selectedStudent={selectedStudent} erpData={erpData} />;
    case 'communication':
      return <TabCommunication selectedStudent={selectedStudent} erpData={erpData} />;
    case 'ai':
      return <TabAI selectedStudent={selectedStudent} erpData={erpData} />;
    default:
      return null;
  }
}
