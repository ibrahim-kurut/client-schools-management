"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ClassModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTuitionFee(initialData.tuitionFee);
    } else {
      setName('');
      setTuitionFee('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, tuitionFee: Number(tuitionFee) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40" dir="rtl">
      <div 
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800">
            {initialData ? 'تعديل بيانات الصف' : 'إضافة صف جديد'}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">اسم المرحلة أو الصف</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: الصف الأول الابتدائي"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-colors font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">القسط الدراسي (اختياري)</label>
            <div className="relative">
              <input 
                type="number" 
                min="0"
                value={tuitionFee}
                onChange={(e) => setTuitionFee(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-colors font-semibold text-right pr-4"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold transition-colors"
            >
              {initialData ? 'حفظ التعديلات' : 'إضافة الصف'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
