"use client";
import React, { useState, useRef, useCallback, memo } from 'react';
import { User, Phone, Mail, Calendar, Loader2, XCircle, ShieldCheck, Layers } from 'lucide-react';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

/**
 * @description Ultra-Performance Form for Adding School Staff (Teachers, Assistants, Accountants)
 * @notice Optimized with React.memo and Specific Transitions
 */
const AddMemberForm = memo(function AddMemberForm({ 
  role: initialRole = 'TEACHER',
  currentUserRole = 'SCHOOL_ADMIN',
  onSubmit, 
  onCancel, 
  initialData = null, 
  loading = false, 
  error = null, 
  classes = [],
  subjects = [] 
}) {
  // --- Refs (For Lag-Free Input) ---
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const birthDateRef = useRef(null);
  const phoneRef = useRef(null);
  const subjectRef = useRef(null);
  const classNameRef = useRef(null);

  // --- UI State ---
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(initialData?.role || initialRole);
  const [gender, setGender] = useState(initialData?.gender || 'MALE');
  const [validationError, setValidationError] = useState('');

  // Role labeling
  const getRoleLabel = useCallback((r) => {
    switch (r) {
      case 'TEACHER': return 'معلم';
      case 'ASSISTANT': return 'معاون';
      case 'ACCOUNTANT': return 'محاسب';
      default: return 'عضو';
    }
  }, []);

  const handleNext = useCallback(() => {
    if (!firstNameRef.current?.value.trim()) return setValidationError('الاسم الأول مطلوب');
    if (!lastNameRef.current?.value.trim()) return setValidationError('اسم العائلة مطلوب');
    if (!emailRef.current?.value.trim()) return setValidationError('البريد الإلكتروني مطلوب');
    if (!initialData && !passwordRef.current?.value.trim()) return setValidationError('كلمة المرور مطلوبة');
    if (passwordRef.current?.value) {
      const pass = passwordRef.current.value.trim();
      if (pass.length < 8) return setValidationError('كلمة المرور يجب أن تكون 8 خانات على الأقل');
      if (!/[a-zA-Z]/.test(pass) || !/[0-9]/.test(pass)) {
        return setValidationError('كلمة المرور يجب أن تحتوي على حروف وأرقام');
      }
    }
    if (!birthDateRef.current?.value) return setValidationError('تاريخ الميلاد مطلوب');
    
    setValidationError('');
    setStep(2);
  }, [setStep]);

  const handleSubmitInternal = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Final Validation Step 2
    const phoneVal = phoneRef.current?.value.trim();
    if (!phoneVal) return setValidationError('رقم الهاتف مطلوب');
    if (!/^\d{10,11}$/.test(phoneVal)) return setValidationError('يجب أن يكون رقم الهاتف 10 أو 11 رقماً');

    const finalData = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      birthDate: birthDateRef.current.value,
      gender,
      role,
      phone: phoneRef.current.value,
      className: classNameRef.current?.value || '',
      subject: subjectRef.current?.value || ''
    };

    onSubmit(finalData);
  }, [gender, role, onSubmit]);

  const translateError = (errorMsg) => {
    if (!errorMsg) return '';
    const errorMap = {
      "User with this email already exists": "البريد الإلكتروني مسجل مسبقاً",
      "Plan limit reached": "تم الوصول للحد الأقصى لخطة الاشتراك",
      "failed to create user": "فشلت العملية، حاول مرة أخرى"
    };
    return errorMap[errorMsg] || errorMsg;
  };

  return (
    <div className="relative flex flex-col flex-1 min-h-0 max-h-[85vh]">
      {/* Stepper */}
      <div className="flex p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 shrink-0 px-4 sm:px-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-2 relative">
             <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 z-10 ${step >= s ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-slate-200 text-slate-500'}`}>
                {s}
             </div>
             <span className={`text-[10px] md:text-xs font-black ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                {s === 1 ? 'البيانات الشخصية' : 'بيانات الوظيفة'}
             </span>
             {s < 2 && (
               <div className="absolute top-4 md:top-5 right-1/2 w-full h-[2px] bg-slate-200 -z-0">
                  <div className={`h-full bg-blue-600 transition-all duration-700 ${step > s ? 'w-full' : 'w-0'}`}></div>
               </div>
             )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitInternal} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6 px-6 sm:px-10">
        
        {/* --- STEP 1 --- */}
        <div className={`space-y-6 animate-in fade-in zoom-in-95 duration-400 ${step === 1 ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                ref={firstNameRef} 
                defaultValue={initialData?.firstName} 
                label="الاسم الأول" 
                placeholder="مثال: يوسف" 
                icon={User} 
              />
              <Input 
                ref={lastNameRef} 
                defaultValue={initialData?.lastName} 
                label="اسم العائلة" 
                placeholder="اللقب" 
                icon={User} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <Input 
                 ref={emailRef} 
                 defaultValue={initialData?.email} 
                 type="email" 
                 label="البريد الإلكتروني" 
                 placeholder="staff@school.com" 
                 dir="ltr" 
                 icon={Mail} 
               />
               <Input 
                 ref={passwordRef} 
                 type="password" 
                 label="كلمة المرور" 
                 placeholder="••••••••" 
                 dir="ltr" 
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <Input 
                 ref={birthDateRef} 
                 defaultValue={initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : ''} 
                 type="date" 
                 label="تاريخ الميلاد" 
                 icon={Calendar} 
               />
               <Select 
                 label="الجنس" 
                 value={gender} 
                 onChange={setGender} 
                 options={[
                   { value: 'MALE', label: 'ذكر' },
                   { value: 'FEMALE', label: 'أنثى' }
                 ]} 
               />
            </div>
        </div>

        {/* --- STEP 2 --- */}
        <div className={`space-y-6 animate-in fade-in slide-in-from-left-6 duration-500 ${step === 2 ? 'block' : 'hidden'}`}>
            <div className="p-5 md:p-6 bg-blue-50/40 rounded-3xl border border-blue-100/50">
              <h3 className="text-sm font-black text-blue-800 flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  تحديد الدور الوظيفي
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['TEACHER', 'ASSISTANT', 'ACCOUNTANT']
                    .filter(r => currentUserRole !== 'ASSISTANT' || (r === 'TEACHER' || r === 'ACCOUNTANT'))
                    .map((r) => (
                    <button 
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3.5 rounded-2xl font-black text-sm transition-all duration-300 ${role === r ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-300'}`}
                    >
                      {getRoleLabel(r)}
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <Input 
                 ref={phoneRef} 
                 defaultValue={initialData?.phone} 
                 type="tel" 
                 label="رقم الهاتف المحلي" 
                 placeholder="07XXXXXXXX" 
                 dir="ltr" 
                 icon={Phone} 
               />

               {role === 'TEACHER' && (
                  <Select 
                    label="التخصص الدراسي الرئيسي" 
                    value={initialData?.subject || ''} 
                    onChange={(val) => {
                      if (subjectRef.current) subjectRef.current.value = val;
                    }} 
                    placeholder="اختر التخصص الدراسي..."
                    options={subjects.map(s => ({ value: s.name, label: s.name }))} 
                  />
               )}
               {/* Hidden ref for subject */}
               <input type="hidden" ref={subjectRef} defaultValue={initialData?.subject || ''} />

               {role === 'TEACHER' && (
                  <Select 
                    label="الصف الدراسي المرتبط (اختياري)" 
                    value={initialData?.className || ''} 
                    onChange={(val) => {
                      if (classNameRef.current) classNameRef.current.value = val;
                    }} 
                    placeholder="غير مرتبط بصف محدد"
                    options={[
                      { value: '', label: 'غير مرتبط بصف محدد' },
                      ...classes.map(c => ({ value: c.name, label: c.name }))
                    ]} 
                  />
               )}
               {/* Hidden ref for className */}
               <input type="hidden" ref={classNameRef} defaultValue={initialData?.className || ''} />
            </div>
        </div>
      </form>

      {/* Actions & Feedback */}
      <div className="p-8 px-6 sm:px-10 pb-10 pt-6 border-t border-slate-50 bg-slate-50/30 shrink-0 space-y-4">
        {(validationError || error) && (
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black flex items-center gap-3 border border-rose-100 animate-shake">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError || translateError(error)}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button 
            variant="secondary" 
            className="w-full sm:w-1/3" 
            onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
          >
            {step > 1 ? 'العودة للخلف' : 'إلغاء العملية'}
          </Button>
          <Button 
            variant="primary" 
            className="w-full sm:w-2/3" 
            loading={loading}
            onClick={() => {
              if (step === 1) handleNext();
              else handleSubmitInternal();
            }}
          >
            {step === 1 ? 'الخطوة التالية' : (initialData ? 'تحديث البيانات' : 'حفظ العضو الجديد')}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
});

AddMemberForm.displayName = 'AddMemberForm';

export default AddMemberForm;
