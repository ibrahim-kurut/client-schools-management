"use client";
import React, { useState, useRef, useCallback, memo } from 'react';
import { User, Phone, Mail, Calendar, Loader2, Camera, XCircle, ShieldCheck, BookOpen, Layers } from 'lucide-react';

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
  classes = [] 
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
  const fileInputRef = useRef(null);


  // --- UI State ---
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(initialData?.role || initialRole);
  const [gender, setGender] = useState(initialData?.gender || 'MALE');
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setValidationError('');
    }
  };

  const handleNext = useCallback(() => {
    if (!firstNameRef.current?.value.trim()) return setValidationError('الاسم الأول مطلوب');
    if (!lastNameRef.current?.value.trim()) return setValidationError('اسم العائلة مطلوب');
    if (!emailRef.current?.value.trim()) return setValidationError('البريد الإلكتروني مطلوب');
    if (!initialData && !passwordRef.current?.value.trim()) return setValidationError('كلمة المرور مطلوبة');
    if (passwordRef.current?.value && passwordRef.current.value.length < 6) return setValidationError('كلمة مرور ضعيفة (6 أحرف على الأقل)');
    if (!birthDateRef.current?.value) return setValidationError('تاريخ الميلاد مطلوب');
    
    setValidationError('');
    setStep(2);
  }, [initialData]);

  const handleSubmitInternal = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Final Validation Step 2
    if (!phoneRef.current?.value.trim()) return setValidationError('رقم الهاتف مطلوب');

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
      subject: subjectRef.current?.value || '',
      image: selectedImage
    };

    onSubmit(finalData);
  }, [gender, role, selectedImage, onSubmit]);

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
    <div className="relative">
      {/* Stepper */}
      <div className="flex p-6 border-b border-slate-100 bg-slate-50/30">
        {[1, 2].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-2 relative">
             <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black transition-all duration-500 z-10 ${step >= s ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-slate-200 text-slate-500'}`}>
                {s}
             </div>
             <span className={` font-black ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                {s === 1 ? 'البيانات الشخصية' : 'بيانات الوظيفة'}
             </span>
             {s < 2 && (
               <div className="absolute top-4.5 right-1/2 w-full h-[2px] bg-slate-200 -z-0">
                  <div className={`h-full bg-blue-600 transition-property-[width] duration-700 ${step > s ? 'w-full' : 'w-0'}`}></div>
               </div>
             )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitInternal} className="p-8 max-h-[55vh] overflow-y-auto no-scrollbar scroll-smooth">
        
        {/* --- STEP 1 --- */}
        <div className={`space-y-6 animate-in fade-in zoom-in-95 duration-400 ${step === 1 ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform duration-200">
                <label className=" font-black text-slate-500 mr-2 uppercase tracking-tighter">الاسم الأول</label>
                <div className="relative">
                   <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input ref={firstNameRef} defaultValue={initialData?.firstName} type="text" placeholder="مثال: يوسف" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-colors outline-none" />
                </div>
              </div>
              <div className="space-y-1.5 focus-within:scale-[1.01] transition-transform duration-200">
                <label className=" font-black text-slate-500 mr-2 uppercase tracking-tighter">اسم العائلة</label>
                <div className="relative">
                   <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input ref={lastNameRef} defaultValue={initialData?.lastName} type="text" placeholder="اللقب" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-bold transition-colors outline-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5 col-span-2 md:col-span-1">
                 <label className=" font-black text-slate-500 mr-2">البريد الإلكتروني</label>
                 <div className="relative">
                   <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input ref={emailRef} defaultValue={initialData?.email} type="email" dir="ltr" placeholder="staff@school.com" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:border-blue-500 font-bold transition-colors outline-none" />
                 </div>
               </div>
               <div className="space-y-1.5 col-span-2 md:col-span-1">
                 <label className=" font-black text-slate-500 mr-2">كلمة المرور</label>
                 <input ref={passwordRef} type="password" dir="ltr" placeholder="••••••••" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-5 focus:bg-white focus:border-blue-500 font-bold transition-colors outline-none" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <label className=" font-black text-slate-500 mr-2">تاريخ الميلاد</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input ref={birthDateRef} defaultValue={initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : ''} type="date" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-blue-500 font-bold outline-none" />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className=" font-black text-slate-500 mr-2">الجنس</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-5 focus:border-blue-500 font-bold appearance-none cursor-pointer outline-none">
                     <option value="MALE">ذكر</option>
                     <option value="FEMALE">أنثى</option>
                  </select>
               </div>
            </div>
        </div>

        {/* --- STEP 2 --- */}
        <div className={`space-y-8 animate-in fade-in slide-in-from-left-6 duration-500 ${step === 2 ? 'block' : 'hidden'}`}>
            <div className="p-6 bg-blue-50/40 rounded-3xl border border-blue-100/50">
              <h3 className=" font-black text-blue-800 flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  تحديد الدور الوظيفي
              </h3>
              <div className="grid grid-cols-3 gap-2">
                  {['TEACHER', 'ASSISTANT', 'ACCOUNTANT']
                    .filter(r => currentUserRole !== 'ASSISTANT' || (r === 'TEACHER' || r === 'ACCOUNTANT'))
                    .map((r) => (
                    <button 
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 rounded-2xl font-black transition-all duration-300 ${role === r ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-300'}`}
                    >
                      {getRoleLabel(r)}
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-5">
               <div className="space-y-1.5">
                  <label className=" font-black text-slate-500 mr-2">رقم الهاتف المحلي</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input ref={phoneRef} defaultValue={initialData?.phone} type="tel" dir="ltr" placeholder="07XXXXXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-blue-500 font-bold outline-none shadow-sm" />
                  </div>
               </div>

               {role === 'TEACHER' && (
                  <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-300">
                    <label className=" font-black text-slate-500 mr-2">التخصص الدراسي الرئيسي</label>
                    <div className="relative">
                      <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input ref={subjectRef} defaultValue={initialData?.subject} type="text" placeholder="مثال: الرياضيات المتقدمة" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-blue-500 font-bold outline-none" />
                    </div>
                  </div>
               )}

               {role === 'TEACHER' && (
                  <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-300">
                    <label className=" font-black text-slate-500 mr-2">
                       الصف الدراسي المرتبط (اختياري)
                    </label>
                    <div className="relative">
                      <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select ref={classNameRef} defaultValue={initialData?.className || ''} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-blue-500 font-bold appearance-none cursor-pointer outline-none">
                         <option value="">غير مرتبط بصف محدد</option>
                         {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
               )}
            </div>
        </div>
      </form>

      {/* Actions & Feedback */}
      <div className="p-8 pt-0 space-y-4">
        {(validationError || error) && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-black flex items-center gap-3 border border-red-100 animate-shake">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError || translateError(error)}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => step > 1 ? setStep(step - 1) : onCancel()} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black transition-colors hover:bg-slate-200">
            {step > 1 ? 'العودة للخلف' : 'إلغاء العملية'}
          </button>
          <button 
            type="button"
            onClick={() => {
              if (step === 1) handleNext();
              else handleSubmitInternal();
            }} 
            disabled={loading} 
            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             (step === 1 ? 'الخطوة التالية' : (initialData ? 'تحديث البيانات' : 'حفظ العضو الجديد'))}
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
