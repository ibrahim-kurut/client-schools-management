"use client";
import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40",
  emerald: "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/40",
  secondary: "bg-slate-100 text-slate-500 hover:bg-slate-200",
  outline: "bg-white border-2 border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30",
  ghost: "bg-transparent text-slate-500 hover:bg-slate-50",
  danger: "bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 hover:border-red-200"
};

const sizes = {
  sm: "py-2 px-4 text-xs",
  md: "py-3.5 px-6 text-sm",
  lg: "py-4 px-8 text-base",
  xl: "py-5 px-10 text-lg"
};

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  disabled = false, 
  className = "", 
  type = "button",
  onClick,
  icon: Icon,
  fullWidth = false,
  ...props 
}) {
  const baseClasses = "rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
}
