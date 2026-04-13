"use client";

import React, { useState } from "react";
import { AlertTriangle, ArchiveX, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArchiveConfirmationModal({ isOpen, onClose, onConfirm, schoolName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 fade-in duration-300">
        <button 
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-6 ring-8 ring-amber-50/50 dark:ring-amber-500/5">
            <ArchiveX className="w-8 h-8 text-amber-500" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            أرشفة المدرسة
          </h3>
          
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            هل أنت متأكد من رغبتك في أرشفة مدرسة <span className="font-bold text-slate-900 dark:text-white">"{schoolName}"</span>؟ سيتم إخفاء المدرسة من اللوحة الرئيسية، ولكن يمكنك استعادتها لاحقاً من الأرشيف.
          </p>

          <div className="w-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-4 mb-8 flex items-start gap-3 text-right">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400/90 leading-relaxed">
              هذا الإجراء سيقوم بتحويل المدرسة وحسابات طلابها ومعلميها إلى حالة غير نشطة (أرشيف) بدلاً من الحذف النهائي.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الأرشفة...
                </>
              ) : (
                "تأكيد الأرشفة"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
