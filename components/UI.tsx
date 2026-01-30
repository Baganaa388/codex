
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass rounded-2xl p-6 transition-all duration-300 hover:border-white/30 hover:scale-[1.02] hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

export const SectionHeading: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({ title, subtitle, centered = false }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
      {title}
    </h2>
    {subtitle && <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>}
    <div className={`w-20 h-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 mt-6 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
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
  const baseStyles = "px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
    outline: "border-2 border-white/20 hover:border-cyan-400 text-white hover:bg-white/5",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5"
  };
  
  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'cyan' | 'purple' | 'yellow' }> = ({ children, color = 'cyan' }) => {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${colors[color]}`}>
      {children}
    </span>
  );
};
