
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass rounded-2xl p-6 transition-all duration-300 hover:border-slate-900/10 hover:scale-[1.01] ${className}`}>
    {children}
  </div>
);

export const SectionHeading: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({ title, subtitle, centered = false }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
      {title}
    </h2>
    {subtitle && <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>}
    <div className={`w-20 h-1.5 bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'outline' | 'ghost'; 
  className?: string; 
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled = false }) => {
  const baseStyles = "px-7 py-3 rounded-2xl font-semibold transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-[#F5D372] via-[#EDAF00] to-[#B98000] text-[#111827] shadow-lg hover:shadow-[0_12px_30px_rgba(237,175,0,0.28)]",
    outline: "border-2 border-slate-900/15 hover:border-[#EDAF00] text-slate-900 hover:bg-[#F7F7F8]",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  };
  
  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'cyan' | 'purple' | 'yellow' }> = ({ children, color = 'cyan' }) => {
  const colors = {
    cyan: "bg-[#EDAF00]/10 text-[#866300] border-[#EDAF00]/20",
    purple: "bg-[#866300]/10 text-[#866300] border-[#866300]/20",
    yellow: "bg-amber-500/10 text-amber-700 border-amber-500/20"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${colors[color]}`}>
      {children}
    </span>
  );
};
