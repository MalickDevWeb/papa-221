import React, { useState } from 'react';
import { Student } from '../../../../domain/StudentModels';
import { getStudentERPData } from './utils/StudentMockData';
import { ConnectionsTable, AuditTrailTable } from './SecurityTables';

interface Props {
  selectedStudent: Student;
  erpData?: any;
}

export function TabSecurity({ selectedStudent, erpData }: Props) {
  const finalErpData = erpData || getStudentERPData(selectedStudent.id, selectedStudent.name);
  const [secTab, setSecTab] = useState<'connections' | 'audit'>('connections');

  return (
    <div className="space-y-4 text-xs font-semibold text-neutral-600" id="tab-security">
      <div className="flex border-b border-neutral-100 gap-2 pb-2">
        <button
          onClick={() => setSecTab('connections')}
          className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
            secTab === 'connections' ? 'bg-[#B3181C] text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          Connexions Récentes
        </button>
        <button
          onClick={() => setSecTab('audit')}
          className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
            secTab === 'audit' ? 'bg-[#B3181C] text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
          }`}
        >
          Journal d'activité (Audit Trail)
        </button>
      </div>

      {secTab === 'connections' && (
        <ConnectionsTable
          connectionLogs={finalErpData.connectionLogs}
          studentName={selectedStudent.name}
        />
      )}

      {secTab === 'audit' && (
        <AuditTrailTable
          activityTrail={finalErpData.activityTrail}
          studentName={selectedStudent.name}
        />
      )}
    </div>
  );
}
