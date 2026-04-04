"use client";
import React, { useRef, useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  User, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function AddSubjectForm({ onSubmit, onCancel, initialData, loading, error, classes, teachers }) {
  // Refs for high performance (Lag-free input)
  const nameRef = useRef(null);
  
  // Controlled state for selects (React Select pattern)
  const [classId, setClassId] = useState(initialData?.classId || '');
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || '');
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    const name = nameRef.current.value.trim();

    // Basic Validation
    if (!name || name.length < 3) {
      setValidationError("اسم المادة يجب أن يكون 3 أحرف على الأقل");
      return;
    }
    if (!classId) {
      setValidationError("يرجى اختيار الصف الدراسي");
      return;
    }

    const finalData = {
      name,
      classId,
      teacherId: teacherId || null
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        
        {/* Subject Detail Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-800">تفاصيل المادة الدراسية</h3>
          </div>

          <div className="space-y-5">
            {/* Subject Name */}
            <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform">
              <label className="font-black text-slate-500 mr-2 uppercase tracking-tighter text-xs">اسم المادة</label>
              <div className="relative">
                <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  ref={nameRef} 
                  defaultValue={initialData?.name} 
                  type="text" 
                  placeholder="مثال: الرياضيات المتقدمة" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-11 pl-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-all outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Class Selection */}
              <div className="space-y-1.5">
                <label className="font-black text-slate-500 mr-2 uppercase tracking-tighter text-xs">الصف الدراسي</label>
                <div className="relative">
                  <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select 
                    value={classId} 
                    onChange={(e) => setClassId(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-11 pl-4 focus:bg-white focus:border-blue-500 font-bold transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">اختر الصف...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Teacher Selection */}
              <div className="space-y-1.5">
                <label className="font-black text-slate-500 mr-2 uppercase tracking-tighter text-xs">المعلم المسؤول (اختياري)</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select 
                    value={teacherId} 
                    onChange={(e) => setTeacherId(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-11 pl-4 focus:bg-white focus:border-blue-500 font-bold transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="">بدون معلم حالياً</option>
                    {teachers.filter(t => t.role === 'TEACHER').map(t => (
                      <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        {!initialData && (
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <p className="text-amber-800 text-sm font-medium leading-relaxed">
              تنبيه: ربط المادة بصف دراسي سيجعلها تظهر تلقائياً في جداول الطلاب والتقارير الأكاديمية لهذا الصف.
            </p>
          </div>
        )}
      </div>

      {/* Actions & Feedback */}
      <div className="p-8 pt-0 space-y-4">
        {(validationError || error) && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-black flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{validationError || error}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black transition-all hover:bg-slate-200"
          >
            إلغاء
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'حفظ التعديلات' : 'إضافة المادة')}
          </button>
        </div>
      </div>
    </form>
  );
}
