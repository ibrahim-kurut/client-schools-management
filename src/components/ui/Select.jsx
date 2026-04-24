"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils'; // I'll check if this exists, or define it locally

export default function Select({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "اختر...", 
  label,
  error,
  className,
  dir = "rtl"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-1.5 w-full", className)} ref={containerRef} dir={dir}>
      {label && (
        <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-tighter">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full bg-white border-2 rounded-2xl py-3.5 px-5 flex items-center justify-between transition-all outline-none",
            isOpen ? "border-emerald-500 ring-4 ring-emerald-500/5 shadow-lg" : "border-slate-100 hover:border-emerald-200 shadow-sm",
            error ? "border-red-500 ring-red-500/10" : ""
          )}
        >
          <span className={cn("font-bold text-sm", selectedOption ? "text-slate-800" : "text-slate-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
        </button>

        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full p-4 cursor-pointer transition-colors flex items-center justify-between text-right",
                    value === opt.value ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <span className="font-bold text-sm">{opt.label}</span>
                  {value === opt.value && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-red-500 font-bold mt-1 px-2">{error}</p>}
    </div>
  );
}
