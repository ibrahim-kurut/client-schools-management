"use client";
import React, { useRef, useState, useEffect } from 'react';
import { BookOpen, AlertCircle, XCircle } from 'lucide-react';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

export default function AddSubjectForm({ onSubmit, onCancel, initialData, loading, error, classes, teachers }) {
  // Refs for high performance (Lag-free input)
  const nameRef = useRef(null);
  
  // Controlled state for selects (React Select pattern)
  const [classId, setClassId] = useState(initialData?.classId || '');
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || '');
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const name = nameRef.current.value.trim();

    // Basic Validation
    if (!name || name.length < 2) {
      setValidationError("اسم المادة يجب أن يكون حرفين على الأقل");
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
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        
        {/* Subject Detail Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">بيانات المادة الدراسية</h3>
              <p className="text-slate-400 text-xs font-bold">يرجى ملء تفاصيل المادة وربطها بالمعلم والصف</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Subject Name */}
            <Input 
              ref={nameRef} 
              defaultValue={initialData?.name} 
              label="اسم المادة الدراسية" 
              placeholder="مثال: الرياضيات، اللغة العربية..." 
              icon={BookOpen} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selection */}
              <Select 
                label="الصف الدراسي الموجه إليه" 
                value={classId} 
                onChange={setClassId} 
                placeholder="اختر الصف..."
                options={classes.map(c => ({ value: c.id, label: c.name }))} 
              />

              {/* Teacher Selection */}
              <Select 
                label="المعلم المسؤول (اختياري)" 
                value={teacherId} 
                onChange={setTeacherId} 
                placeholder="بدون معلم حالياً"
                options={[
                  { value: '', label: 'بدون معلم حالياً' },
                  ...teachers.filter(t => t.role === 'TEACHER').map(t => ({ 
                    value: t.id, 
                    label: `${t.firstName} ${t.lastName}` 
                  }))
                ]} 
              />
            </div>
          </div>
        </div>

        {/* Info Card */}
        {!initialData && (
          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex gap-4 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-blue-900 text-sm font-black">ملاحظة هامة:</p>
              <p className="text-blue-700/80 text-xs font-bold leading-relaxed">
                ربط المادة بصف دراسي سيجعلها تظهر تلقائياً في جداول الطلاب والتقارير الأكاديمية لهذا الصف بشكل فوري.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions & Feedback */}
      <div className="p-8 px-6 sm:px-10 pb-10 pt-6 border-t border-slate-50 bg-slate-50/30 shrink-0 space-y-4 ">
        {(validationError || error) && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black flex items-center gap-3 border border-rose-100 animate-shake">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>{validationError || error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button 
            variant="secondary" 
            className="w-full sm:w-1/3"
            onClick={onCancel}
          >
            إلغاء العملية
          </Button>
          <Button 
            variant="primary" 
            className="w-full sm:w-2/3"
            loading={loading}
            type="submit"
          >
            {initialData ? 'حفظ التعديلات' : 'إضافة المادة الجديدة'}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </form>
  );
}
