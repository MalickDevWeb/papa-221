import React, { useState } from 'react';
import { STAFF_ROLES, RBAC_PERMISSIONS } from '../../../domain/PersonnelModels';

interface Props {
  onShowToast: (msg: string, success: boolean) => void;
}

export function RbacTab({ onShowToast }: Props) {
  const [matrix, setMatrix] = useState<Record<string, string[]>>({
    Administrateur: ['edit_grades', 'validate_payments', 'modify_schedule', 'view_audit_trail', 'manage_users'],
    Secrétaire: ['modify_schedule', 'manage_users'],
    Comptable: ['validate_payments'],
    Enseignant: ['edit_grades'],
    Vigile: [],
  });

  const togglePermission = (role: string, permKey: string) => {
    const activePerms = matrix[role] || [];
    const updated = activePerms.includes(permKey)
      ? activePerms.filter(p => p !== permKey)
      : [...activePerms, permKey];
    setMatrix({ ...matrix, [role]: updated });
  };

  const handleSave = () => {
    // Check if security critical permission is given to Vigil or Teacher
    const vigilTrail = matrix['Vigile']?.includes('view_audit_trail');
    const vigilFinance = matrix['Vigile']?.includes('validate_payments');
    if (vigilTrail || vigilFinance) {
      onShowToast("Alerte Sécurité ! Attribution d'un accès critique non recommandé au Vigile.", false);
      return;
    }
    onShowToast("Matrice des droits RBAC mise à jour avec succès !", true);
  };

  return (
    <div className="space-y-4 text-xs font-bold text-[#4A5568]" id="rbac-tab-root">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
        <div>
          <h3 className="font-extrabold text-sm text-[#1E293B]">Matrice de Droits (RBAC Enterprise)</h3>
          <p className="text-[10px] text-neutral-400 font-semibold">Cochez les droits par rôle pour appliquer les règles de sécurité en temps réel.</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs">
          Mettre à jour les permissions
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F6] text-[9px] font-black text-neutral-400 uppercase border-b border-neutral-200">
                <th className="px-6 py-3">Permission Système</th>
                <th className="px-6 py-3">Catégorie</th>
                {STAFF_ROLES.map(role => (
                  <th key={role} className="px-4 py-3 text-center">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-bold text-neutral-600">
              {RBAC_PERMISSIONS.map(p => (
                <tr key={p.key} className="hover:bg-neutral-50/30 transition-colors">
                  <td className="px-6 py-3.5 text-[#1E293B] font-black">{p.label}</td>
                  <td className="px-6 py-3.5">
                    <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded text-[9px] uppercase font-black">{p.category}</span>
                  </td>
                  {STAFF_ROLES.map(role => {
                    const checked = matrix[role]?.includes(p.key) || false;
                    return (
                      <td key={role} className="px-4 py-3.5 text-center">
                        <label className="inline-flex items-center justify-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(role, p.key)}
                            className="w-4 h-4 rounded border-neutral-200 text-[#B3181C] focus:ring-[#B3181C] cursor-pointer transition-all scale-110"
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
