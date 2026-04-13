"use client";

import React from "react";
import { cn } from "@/lib/utils";

const statusConfig = {
  ACTIVE: {
    label: "نشط",
    color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20 shadow-emerald-500/20",
    indicator: "bg-emerald-500"
  },
  PENDING: {
    label: "معلق",
    color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20 shadow-amber-500/20",
    indicator: "bg-amber-500"
  },
  REJECTED: {
    label: "مرفوض",
    color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/20 shadow-rose-500/20",
    indicator: "bg-rose-500"
  },
  SUSPENDED: {
    label: "محظور",
    color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/20 shadow-rose-500/20",
    indicator: "bg-rose-500"
  },
  APPROVED: {
    label: "مقبول",
    color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20 shadow-emerald-500/20",
    indicator: "bg-emerald-500"
  },
  INACTIVE: {
    label: "غير نشط",
    color: "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 shadow-slate-500/10",
    indicator: "bg-slate-400"
  },
  EXPIRED: {
    label: "منتهي",
    color: "bg-red-50 dark:bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/20 shadow-red-500/20",
    indicator: "bg-red-500"
  }
};

export default function StatusBadge({ status, pulse = true }) {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-[0_0_12px_-4px] border",
      config.color
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        config.indicator,
        (pulse && (status === "ACTIVE" || status === "PENDING")) && "animate-pulse"
      )} />
      {config.label}
    </div>
  );
}
