"use client";

import React, { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from "lucide-react";

export default function ApproveRejectModal({ isOpen, onClose, onConfirm, type, schoolName }) {
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (type === 'REJECT' && !adminNotes.trim()) {
      return; // Notes required for rejection
    }
    setLoading(true);
    await onConfirm(adminNotes);
    setLoading(false);
    setAdminNotes("");
  };

  const isApprove = type === 'APPROVE';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isApprove ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {isApprove ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{isApprove ? 'قبول الاشتراك' : 'رفض الطلب'}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{schoolName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
              ملاحظات الإدارة {type === 'REJECT' && <span className="text-rose-500">(مطلوب)</span>}
            </label>
            <textarea 
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={isApprove ? 'أضف ملاحظات اختيارية للمدرسة...' : 'يرجى توضيح سبب الرفض لمدير المدرسة...'}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none min-h-[120px] transition-all"
            />
          </div>

          {!isApprove && !adminNotes.trim() && (
            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>يجب كتابة سبب الرفض لإبلاغ المدرسة</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex items-center gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            إلغاء
          </button>
          <button 
            onClick={handleConfirm}
            disabled={loading || (type === 'REJECT' && !adminNotes.trim())}
            className={`flex-1 py-4 text-white rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 ${isApprove ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600'}`}
          >
            {loading ? 'جاري المعالجة...' : isApprove ? 'تأكيد القبول' : 'تأكيد الرفض'}
          </button>
        </div>
      </div>
    </div>
  );
}
