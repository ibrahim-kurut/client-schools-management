"use client";

import React from "react";
import { Check, X, Layers, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlanCard({ plan }) {
  const { name, description, price, interval, features, color, popular, activeSchools } = plan;

  return (
    <div 
      className={cn(
        "relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all duration-500 group overflow-hidden",
        popular && "ring-2 ring-indigo-500 shadow-indigo-500/10 relative"
      )}
    >
      {popular && (
        <div className="absolute top-8 -left-12 -rotate-45 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-12 py-2 shadow-lg z-10">
          الأكثر تداولاً
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
           <div className={cn("p-4 rounded-3xl bg-gradient-to-br text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500", color)}>
              <Layers className="w-8 h-8" />
           </div>
           <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${price}</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{interval}</span>
           </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{name}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>

        <div className="space-y-4 mb-10">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center p-1 group-hover:scale-110 transition-transform",
                feature.included ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600" : "bg-slate-50 dark:bg-slate-800 text-slate-300"
              )}>
                {feature.included ? <Check className="w-3 h-3 stroke-[3px]" /> : <X className="w-3 h-3" />}
              </div>
              <span className={cn(
                "text-xs font-bold transition-colors",
                feature.included ? "text-slate-700 dark:text-slate-300" : "text-slate-400 line-through"
              )}>{feature.name}</span>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">مدارس نشطة</span>
              <span className="text-lg font-black text-slate-800 dark:text-white mt-1">{activeSchools}</span>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-600 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all active:scale-90">
                 <Edit3 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-500 hover:text-rose-600 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all active:scale-90">
                 <Trash2 className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r transition-all duration-500 group-hover:h-2 opacity-30 group-hover:opacity-100" style={{ backgroundImage: `linear-gradient(to right, transparent, ${color.split(' ')[1].replace('to-', '')}, transparent)` }} />
    </div>
  );
}
