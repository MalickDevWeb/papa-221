import React from 'react';

interface CandidatureStepperProps {
  step: number;
}

export function CandidatureStepper({ step }: CandidatureStepperProps) {
  return (
    <div className="flex justify-between items-center gap-2">
      {[1, 2, 3].map(s => (
        <div key={s} className="flex-1 flex items-center gap-1">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${step >= s ? 'bg-[#B3181C] border-[#B3181C] text-white' : 'bg-[#FAF8F6] border-[#E2DCDA] text-[#8E7977]'}`}>{s}</div>
          <div className={`flex-1 h-[2px] ${step > s ? 'bg-[#B3181C]' : 'bg-[#E2DCDA]'}`}></div>
        </div>
      ))}
    </div>
  );
}
