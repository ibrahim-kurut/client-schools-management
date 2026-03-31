"use client";

import React from "react";
import { Plus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPageHeader({ title, description, primaryAction }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-1 pt-1 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.5)]" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mr-4">{description}</p>
      </div>
      
      {primaryAction && (
        <div className="flex items-center gap-2 group">
          {primaryAction.secondary ? (
            <button 
              onClick={primaryAction.onSecondaryClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
            >
              {primaryAction.secondaryLabel}
            </button>
          ) : null}
          
          <button 
            onClick={primaryAction.onClick}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95",
              primaryAction.variant === "indigo" 
                ? "bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40"
                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-500/20"
            )}
          >
            {primaryAction.icon && <primaryAction.icon className="w-5 h-5" />}
            {primaryAction.label}
          </button>
        </div>
      )}
    </div>
  );
}
