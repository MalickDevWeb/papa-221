import React, { useState } from 'react';
import { StudentSubSidebar } from './students/StudentSubSidebar';
import { StudentDataGridTab } from './students/StudentDataGridTab';
import { ExcelImportTab } from './students/ExcelImportTab';
import { StudentProfile360Tab } from './students/StudentProfile360Tab';
import { INITIAL_STUDENTS, Student } from '../../domain/StudentModels';
import { TabletDrawerWrapper } from '@/features/screenguard/ui/components/TabletDrawerWrapper';

export function AdminStudentManager() {
  const [activeTab, setActiveTab] = useState('annuaire');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student>(INITIAL_STUDENTS[0]);

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('profil360');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start w-full" id="student-manager-root">
      <TabletDrawerWrapper>
        <StudentSubSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </TabletDrawerWrapper>
      <div className="flex-grow min-w-0 w-full bg-white border border-[#E2DCDA] rounded-2xl p-3 sm:p-6 shadow-sm min-h-[550px]">
        {activeTab === 'annuaire' && (
          <StudentDataGridTab
            students={students}
            onUpdateStudents={setStudents}
            onViewProfile={handleViewProfile}
          />
        )}
        {activeTab === 'import' && (
          <ExcelImportTab
            students={students}
            onAddStudents={(newList) => setStudents([...students, ...newList])}
            onAddSingleStudent={(s) => setStudents([...students, s])}
          />
        )}
        {activeTab === 'profil360' && (
          <StudentProfile360Tab
            selectedStudent={selectedStudent}
            onUpdateStudent={(s) => {
              setSelectedStudent(s);
              setStudents(students.map((st) => (st.id === s.id ? s : st)));
            }}
          />
        )}
      </div>
    </div>
  );
}
