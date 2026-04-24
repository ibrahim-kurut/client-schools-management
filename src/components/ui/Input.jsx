"use client";
import React from 'react';

export default function Input({ 
  label, 
  error, 
  icon: Icon, 
  className = "", 
  containerClassName = "",
  dir = "rtl",
  ...props 
}) {
  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`} dir={dir}>
      {label && (
        <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-tighter">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        )}
        <input
          className={`w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-3.5 ${Icon ? 'pr-11' : 'pr-5'} pl-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold transition-all outline-none placeholder:text-slate-300 ${error ? 'border-red-500 focus:ring-red-500/5 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold mt-1 px-2 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
