"use client";
import React, { useState, useRef, useCallback, memo } from 'react';
import { User, Phone, Mail, Calendar, Loader2, XCircle, Layers, DollarSign, FileText, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { checkStudentCode } from '../../../redux/slices/studentsSlice';
import { toast } from 'react-toastify';

/**
 * @description Dedicated Form for Adding/Editing Students
 * @notice Aligned with backend: firstName, lastName, email, password, phone, gender, birthDate,
 *         className (required), customTuitionFee (optional), discountAmount (optional), discountNotes (optional)
 * @performance Optimized with React.memo and Specific Transitions
 */
const AddStudentForm = memo(function AddStudentForm({ 
  onSubmit, 
  onCancel, 
  initialData = null, 
  loading = false, 
  error = null, 
  classes = [] 
}) {
  // --- Refs (For Lag-Free Input) ---
  const studentCodeRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const birthDateRef = useRef(null);
  const phoneRef = useRef(null);
  const classNameRef = useRef(null);
  const customTuitionFeeRef = useRef(null);
  const discountAmountRef = useRef(null);
  const discountNotesRef = useRef(null);
  const motherNameRef = useRef(null);
  const guardianMaritalStatusRef = useRef(null);

  // --- UI State ---
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [gender, setGender] = useState(initialData?.gender || 'MALE');
  const [validationError, setValidationError] = useState('');
  const [displayClassFee, setDisplayClassFee] = useState(null);

  // Get selected class tuition fee logic
  const getSelectedClassFee = useCallback(() => {
    const selectedName = classNameRef.current?.value;
    if (!selectedName) return null;
    const cls = classes.find(c => c.name === selectedName);
    return cls?.tuitionFee || null;
  }, [classes]);

  const handleClassChange = useCallback(() => {
    const fee = getSelectedClassFee();
    setDisplayClassFee(fee);
  }, [getSelectedClassFee]);

  // --- Step 1 Validation ---
  const handleNext = useCallback(async () => {
    const code = studentCodeRef.current?.value.trim();
    if (!code) return setValidationError('كود الطالب مطلوب');
    if (!firstNameRef.current?.value.trim()) return setValidationError('الاسم الأول مطلوب');
    if (!lastNameRef.current?.value.trim()) return setValidationError('اسم العائلة مطلوب');
    if (!birthDateRef.current?.value) return setValidationError('تاريخ الميلاد مطلوب');
    
    setValidationError('');
    
    // Check code availability via API (only on creation)
    if (!initialData) {
        setIsVerifying(true);
        try {
            const result = await dispatch(checkStudentCode(code)).unwrap();
            if (!result.available) {
                setValidationError(`كود الطالب (${code}) مستخدم بالفعل في هذه المدرسة`);
                setIsVerifying(false);
                return;
            }
        } catch (err) {
            setValidationError('فشل التحقق من الكود، حاول مرة أخرى');
            setIsVerifying(false);
            return;
        }
        setIsVerifying(false);
    }

    setStep(2);
  }, [initialData, dispatch]);

  // --- Step 2 Validation ---
  const handleNextToFinancial = useCallback(() => {
    if (!phoneRef.current?.value.trim()) return setValidationError('رقم هاتف ولي الأمر مطلوب');
    if (!classNameRef.current?.value) return setValidationError('الصف الدراسي مطلوب للطالب');
    if (!motherNameRef.current?.value.trim()) return setValidationError('اسم الأم مطلوب');
    
    setValidationError('');
    setStep(3);
  }, []);

  // --- Final Submit ---
  const handleSubmitInternal = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const finalData = {
      studentCode: studentCodeRef.current.value,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      birthDate: birthDateRef.current.value,
      gender,
      role: 'STUDENT',
      phone: phoneRef.current.value,
      className: classNameRef.current.value,
      motherName: motherNameRef.current.value,
      guardianMaritalStatus: guardianMaritalStatusRef.current.value,
      customTuitionFee: customTuitionFeeRef.current?.value || '',
      discountAmount: discountAmountRef.current?.value || '',
      discountNotes: discountNotesRef.current?.value || '',
    };

    onSubmit(finalData);
  }, [gender, onSubmit]);

  const translateError = (errorMsg) => {
    if (!errorMsg) return '';
    const errorMap = {
      "User with this email already exists": "البريد الإلكتروني مسجل مسبقاً",
      "Plan limit reached for Students. Upgrade your plan.": "تم الوصول للحد الأقصى لعدد الطلاب في خطة الاشتراك",
      "Class name is required for students": "الصف الدراسي مطلوب للطالب",
      "Class not found in this school": "الصف الدراسي غير موجود في المدرسة",
      "School plan is not active": "خطة الاشتراك غير مفعلة",
      "failed to create user": "فشلت العملية، حاول مرة أخرى"
    };
    return errorMap[errorMsg] || errorMsg;
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    return Number(num).toLocaleString('en-US');
  };

  const totalSteps = 3;

  return (
    <div className="relative">
      {/* Stepper */}
      <div className="flex p-6 border-b border-slate-100 bg-slate-50/30">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-2 relative">
             <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black transition-all duration-500 z-10 ${step >= s ? 'bg-emerald-600 text-white shadow-xl scale-110' : 'bg-slate-200 text-slate-500'}`}>
                {s}
             </div>
             <span className={`text-[11px] font-black ${step >= s ? 'text-emerald-600' : 'text-slate-400'}`}>
                {s === 1 ? 'البيانات الشخصية' : s === 2 ? 'بيانات الدراسة' : 'البيانات المالية'}
             </span>
             {s < totalSteps && (
               <div className="absolute top-4.5 right-1/2 w-full h-[2px] bg-slate-200 -z-0">
                  <div className={`h-full bg-emerald-600 transition-property-[width] duration-700 ${step > s ? 'w-full' : 'w-0'}`}></div>
               </div>
             )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitInternal} className="p-8 max-h-[55vh] overflow-y-auto no-scrollbar">
        
        {/* ═══════════════ STEP 1 ═══════════════ */}
        <div className={`space-y-6 animate-in fade-in zoom-in-95 duration-400 ${step === 1 ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 transition-colors duration-200">
                <label className="text-xs font-black text-slate-500 mr-2">الاسم الأول</label>
                <div className="relative">
                   <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input ref={firstNameRef} defaultValue={initialData?.firstName} type="text" placeholder="مثال: يوسف" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold transition-colors outline-none" />
                </div>
              </div>
              <div className="space-y-1.5 transition-colors duration-200">
                <label className="text-xs font-black text-slate-500 mr-2">اسم العائلة</label>
                <div className="relative">
                   <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input ref={lastNameRef} defaultValue={initialData?.lastName} type="text" placeholder="اللقب" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold transition-colors outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 transition-colors duration-200">
               <label className="text-xs font-black text-slate-500 mr-2">كود الطالب <span className="text-slate-400 text-[10px]">(المعرف الأساسي للدخول)</span></label>
               <div className="relative">
                  <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input ref={studentCodeRef} defaultValue={initialData?.studentCode} type="text" placeholder="مثال: 100" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 font-bold transition-colors outline-none" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5 ">
                 <label className="text-xs font-black text-slate-500 mr-2">تاريخ الميلاد</label>
                 <div className="relative">
                   <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input ref={birthDateRef} defaultValue={initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : ''} type="date" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-emerald-500 font-bold outline-none" />
                 </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 mr-2">الجنس</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 px-5 focus:border-emerald-500 font-bold appearance-none cursor-pointer outline-none">
                     <option value="MALE">ذكر</option>
                     <option value="FEMALE">أنثى</option>
                  </select>
               </div>
            </div>
        </div>

        {/* ═══════════════ STEP 2 ═══════════════ */}
        <div className={`space-y-6 animate-in fade-in slide-in-from-left-6 duration-500 ${step === 2 ? 'block' : 'hidden'}`}>
            <div className="p-6 bg-emerald-50/40 rounded-3xl border border-emerald-100/50">
              <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2 mb-4">
                  <GraduationCap className="w-4 h-4" />
                  تسجيل الصف الدراسي
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-black text-slate-500 mr-2">الصف الدراسي <span className="text-red-400">(إجباري)</span></label>
                   <div className="relative">
                     <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                     <select 
                       ref={classNameRef} 
                       defaultValue={initialData?.class?.name || ''} 
                       onChange={handleClassChange}
                       className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-emerald-500 font-bold appearance-none cursor-pointer outline-none"
                     >
                        <option value="">اختر الصف الدراسي...</option>
                        {classes.map(c => (
                          <option key={c.id} value={c.name}>
                            {c.name} {c.tuitionFee ? `— القسط: ${formatNumber(c.tuitionFee)} IQD` : ''}
                          </option>
                        ))}
                     </select>
                   </div>
                </div>

                {displayClassFee !== null && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">قسط الصف الدراسي الافتراضي</p>
                      <p className="text-lg font-black text-emerald-700">{formatNumber(displayClassFee)} <span className="text-xs text-slate-400">IQD</span></p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 mr-2">اسم الأم <span className="text-red-400">(إجباري)</span></label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input ref={motherNameRef} defaultValue={initialData?.studentProfile?.motherName} type="text" placeholder="اسم الأم الكامل" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-emerald-500 font-bold outline-none shadow-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 mr-2">رقم هاتف ولي الأمر</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input ref={phoneRef} defaultValue={initialData?.phone} type="tel" dir="ltr" placeholder="07XXXXXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-emerald-500 font-bold outline-none shadow-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 mr-2">الحالة الاجتماعية لولي الأمر</label>
              <select ref={guardianMaritalStatusRef} defaultValue={initialData?.studentProfile?.guardianMaritalStatus || ''} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 focus:border-emerald-500 font-bold appearance-none cursor-pointer outline-none shadow-sm">
                 <option value="">اختر الحالة الاجتماعية...</option>
                 <option value="متزوج">متزوج</option>
                 <option value="أعزب">أعزب</option>
                 <option value="مطلق">مطلق</option>
                 <option value="أرمل">أرمل</option>
                 <option value="منفصل">منفصل</option>
              </select>
            </div>
        </div>

        {/* ═══════════════ STEP 3 ═══════════════ */}
        <div className={`space-y-6 animate-in fade-in slide-in-from-left-6 duration-500 ${step === 3 ? 'block' : 'hidden'}`}>
            <div className="p-6 bg-amber-50/40 rounded-3xl border border-amber-100/50">
              <h3 className="text-sm font-black text-amber-800 flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4" />
                  البيانات المالية للطالب
              </h3>
              <p className="text-amber-600 text-[11px] mb-5 font-bold">هذه البيانات اختيارية</p>
              
              <div className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 mr-2">قسط الطالب السنوي المخصص</label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">IQD</span>
                      <input 
                        ref={customTuitionFeeRef} 
                        defaultValue={initialData?.studentProfile?.customTuitionFee || ''} 
                        type="number" 
                        min="0"
                        placeholder="مثال: 900000" 
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-14 pl-4 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 font-bold outline-none shadow-sm transition-colors" 
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 mr-2">مبلغ الخصم</label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs">IQD</span>
                      <input 
                        ref={discountAmountRef} 
                        defaultValue={initialData?.studentProfile?.discountAmount || ''} 
                        type="number" 
                        min="0"
                        placeholder="مثال: 100000" 
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-14 pl-4 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 font-bold outline-none shadow-sm transition-colors" 
                      />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 mr-2">سبب الخصم</label>
                    <div className="relative">
                      <FileText className="absolute right-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea 
                        ref={discountNotesRef} 
                        defaultValue={initialData?.studentProfile?.discountNotes || ''} 
                        placeholder="..." 
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 font-bold outline-none shadow-sm min-h-[90px] resize-none transition-colors"
                      />
                    </div>
                 </div>
              </div>
            </div>

            {/* Financial Summary Preview - Optimized: No ref access in render body */}
            {displayClassFee !== null && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-xs font-black text-slate-500">ملخص مالي</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold">قسط الصف</span>
                  <span className="font-black text-slate-600">{`${formatNumber(displayClassFee)} IQD`}</span>
                </div>
              </div>
            )}
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
          <button 
            type="button" 
            onClick={() => step > 1 ? setStep(step - 1) : onCancel()} 
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black transition-colors hover:bg-slate-200"
          >
            {step > 1 ? 'العودة للخلف' : 'إلغاء العملية'}
          </button>
          <button 
            type="button"
            onClick={() => {
              if (step === 1) handleNext();
              else if (step === 2) handleNextToFinancial();
              else handleSubmitInternal();
            }} 
            disabled={loading || isVerifying} 
            className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {(loading || isVerifying) ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             (step < totalSteps ? 'الخطوة التالية' : (initialData ? 'تحديث بيانات الطالب' : 'تسجيل الطالب الجديد'))}
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

AddStudentForm.displayName = 'AddStudentForm';

export default AddStudentForm;
