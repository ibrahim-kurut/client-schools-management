"use client";

import React, { useState } from "react";
import { AlertTriangle, UserMinus, Loader2, X } from "lucide-react";

export default function DeleteUserConfirmationModal({ isOpen, onClose, onConfirm, userName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isDeleting ? onClose : undefined}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 text-center">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50 dark:ring-red-500/5">
          <UserMinus className="w-10 h-10 text-red-500" />
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          حذف المستخدم
        </h3>
        
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          هل أنت متأكد من رغبتك في حذف المستخدم <span className="text-red-600 dark:text-red-400">"{userName}"</span>؟ هذا الإجراء سيقوم بتعطيل الحساب ومنعه من الدخول للنظام.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-4 rounded-2xl font-black text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 py-4 rounded-2xl font-black text-sm text-white bg-red-500 hover:bg-red-600 shadow-xl shadow-red-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              "تأكيد الحذف"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
