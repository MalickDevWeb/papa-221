import React from 'react';

export const EcoleBadge = () => (
  <div className="h-11 w-11 md:h-13 md:w-13 rounded-2xl bg-[#B3181C] border border-white/20 shadow-lg flex items-center justify-center p-2 select-none animate-fade-in shrink-0">
    <svg viewBox="0 0 100 100" className="h-full w-full text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 8 L88 23 V55 C88 77 50 93 50 93 C50 93 12 77 12 55 V23 L50 8 Z" fill="#B3181C" stroke="#FFFFFF" strokeWidth="3.5" />
      <path d="M50 14 L81 27 V51 C81 69 50 83 50 83 C50 83 19 69 19 51 V27 L50 14 Z" stroke="#E3A857" strokeWidth="2" />
      <path d="M50 26 L72 35 L50 44 L28 35 Z" fill="#FFFFFF" />
      <path d="M34 38 V49 C34 54 50 57 50 57 C50 57 66 54 66 49 V38" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M72 35 V53" stroke="#E3A857" strokeWidth="2.5" />
      <circle cx="72" cy="53" r="3.5" fill="#E3A857" />
      <text x="50" y="74" fill="#FFFFFF" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="'Inter', sans-serif">221</text>
    </svg>
  </div>
);
