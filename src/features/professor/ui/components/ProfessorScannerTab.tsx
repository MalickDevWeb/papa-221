import React, { useState } from 'react';
import { ProfessorScanSuccess } from './ProfessorScanSuccess';
import { QRCameraScanner } from '../../../../shared/components';

interface Props {
  readonly pointageType?: 'arrivée' | 'départ';
  readonly onScanComplete?: () => void;
}

export function ProfessorScannerTab({ pointageType = 'arrivée', onScanComplete }: Props) {
  const [scanSuccess, setScanSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleScanComplete = () => {
    setScanSuccess(true);
    onScanComplete?.();
  };

  return (
    <div className="space-y-4 text-center" id="professor-scanner-tab">
      <p className="text-xs text-secondary leading-relaxed font-semibold">
        Scannage en cours... Orientez l&apos;appareil vers le code QR du vigile pour enregistrer votre {pointageType}.
      </p>

      {scanSuccess ? (
        <ProfessorScanSuccess
          pointageType={pointageType}
          onReset={() => { setScanSuccess(false); setResetKey(k => k + 1); }}
        />
      ) : (
        <QRCameraScanner key={resetKey} onScanComplete={handleScanComplete} />
      )}
    </div>
  );
}
