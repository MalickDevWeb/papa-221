import React from 'react';

export interface EcoleLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const EcoleLogo = ({ size = 'md' }: EcoleLogoProps) => {
  const sizeClasses = {
    sm: 'text-[24px] h-[30px]',
    md: 'text-[28px] h-[34px]',
    lg: 'text-[34px] h-[40px]',
  };
  
  return (
    <div className={`flex items-center justify-center font-sans tracking-tight text-[#291715] ${sizeClasses[size]} font-black select-none`}>
      <span>ÉCOLE</span>
      <span className="text-[#B3181C] ml-1.5 font-black">221</span>
    </div>
  );
};
