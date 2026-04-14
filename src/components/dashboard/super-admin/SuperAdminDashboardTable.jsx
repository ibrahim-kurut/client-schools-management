"use client";

import React from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SuperAdminDashboardTable
 * A reusable, high-end table component for the Super Admin dashboard.
 */
export default function SuperAdminDashboardTable({ 
  columns, 
  data, 
  loading, 
  emptyMessage = "لم يتم العثور على بيانات",
  emptyIcon: EmptyIcon = Search,
  className
}) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm relative min-h-[400px]",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={cn(
                    "px-6 py-5 text-[1rem] font-black text-slate-400 uppercase tracking-widest text-right",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {loading && data.length === 0 ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-8 h-20 bg-slate-50/10" />
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-6 py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                        <EmptyIcon className="w-10 h-10 text-slate-300" />
                      </div>
                      <span className="text-sm font-bold text-slate-400">{emptyMessage}</span>
                   </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((item, rowIndex) => (
                <tr 
                  key={item.id || rowIndex} 
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all duration-300"
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={cn("px-6 py-6 transition-all", column.cellClassName)}
                    >
                      {column.render ? column.render(item) : (item[column.key] || "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
