"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, change, trend, icon: Icon, color, shadow }) {
  return (
    <div 
      className={cn(
        "p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl hover:border-indigo-500/20 transition-all duration-500",
        shadow
      )}
    >
      {/* Background gradient hint */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.07] -translate-y-1/2 translate-x-1/2 rounded-full transition-all duration-500 pointer-events-none group-hover:scale-110",
        color
      )} />
      
      <div className="flex items-center justify-between mb-5">
        <div className={cn(
          "p-3 rounded-2xl bg-gradient-to-br text-white shadow-lg shadow-slate-200 dark:shadow-none group-hover:scale-110 transition-transform duration-500",
          color
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter",
          trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
        )}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}
