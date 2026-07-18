import React from 'react';
import { StudentKeysCard } from './StudentKeysCard';
import { ApiKeyCard } from './ApiKeyCard';
import { DeleteSecurityCodeCard } from './DeleteSecurityCodeCard';

export function CryptoKeysTab() {
  return (
    <div className="space-y-6 text-xs font-bold text-[#4A5568]" id="crypto-keys-tab">
      <div className="pb-2 border-b border-neutral-100">
        <h3 className="font-extrabold text-sm text-[#1E293B]">Clés de Sécurité & Clés API</h3>
        <p className="text-[10px] text-neutral-400 font-semibold">
          Gérez les jetons d'accès cryptographiques et configurez le code de protection des suppressions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DeleteSecurityCodeCard />
        <StudentKeysCard />
        <ApiKeyCard />
      </div>
    </div>
  );
}
