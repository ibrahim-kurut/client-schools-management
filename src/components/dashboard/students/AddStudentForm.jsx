"use client";
import React, { useState, useRef, useCallback, memo } from 'react';
import { User, Phone, Mail, Calendar, Loader2, XCircle, Layers, DollarSign, FileText, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { checkStudentCode } from '../../../redux/slices/studentsSlice';
import { toast } from 'react-toastify';

import Select from '../../ui/Select';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

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
  
  // Custom Class Select State
  const [isClassSelectOpen, setIsClassSelectOpen] = useState(false);
  const [classSearch, setClassSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState(
    initialData?.className ? classes.find(c => c.name === initialData.className) : null
  );

  const handleClassChange = useCallback((cls) => {
    // This is now called with the class object from the custom select
    if (cls) {
      // Any additional logic when class changes
    }
  }, []);

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
    const phoneVal = phoneRef.current?.value.trim();
    if (!phoneVal) return setValidationError('رقم هاتف ولي الأمر مطلوب');
    if (!/^\d{10,11}$/.test(phoneVal)) return setValidationError('يجب أن يكون رقم الهاتف 10 أو 11 رقماً');
    
    if (!selectedClass) return setValidationError('الصف الدراسي مطلوب للطالب');
    if (!motherNameRef.current?.value.trim()) return setValidationError('اسم الأم مطلوب');
    
    setValidationError('');
    setStep(3);
  }, [selectedClass]);

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
      className: selectedClass?.name || '',
      motherName: motherNameRef.current.value,
      guardianMaritalStatus: guardianMaritalStatusRef.current.value,
      customTuitionFee: customTuitionFeeRef.current?.value || '',
      discountAmount: discountAmountRef.current?.value || '',
      discountNotes: discountNotesRef.current?.value || '',
    };

    onSubmit(finalData);
  }, [gender, selectedClass, onSubmit]);

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
    <div className="relative flex flex-col flex-1 min-h-0 max-h-[85vh]">
      {/* Stepper */}
      <div className="flex p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 shrink-0 px-4 sm:px-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-2 relative">
             <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 z-10 ${step >= s ? 'bg-emerald-600 text-white shadow-xl scale-110' : 'bg-slate-200 text-slate-500'}`}>
                {s}
             </div>
             <span className={`text-[9px] md:text-xs font-black ${step >= s ? 'text-emerald-600' : 'text-slate-400'}`}>
                {s === 1 ? 'البيانات الشخصية' : s === 2 ? 'بيانات الدراسة' : 'البيانات المالية'}
             </span>
             {s < totalSteps && (
               <div className="absolute top-4 md:top-5 right-1/2 w-full h-[2px] bg-slate-200 -z-0">
                  <div className={`h-full bg-emerald-600 transition-all duration-700 ${step > s ? 'w-full' : 'w-0'}`}></div>
               </div>
             )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitInternal} className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 space-y-6 px-6 sm:px-10">
        
        {/* ═══════════════ STEP 1 ═══════════════ */}
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

            <Input 
              ref={studentCodeRef} 
              defaultValue={initialData?.studentCode} 
              label="كود الطالب" 
              placeholder="مثال: 100" 
              icon={Layers} 
            />

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

        {/* ═══════════════ STEP 2 ═══════════════ */}
        <div className={`space-y-6 animate-in fade-in slide-in-from-left-6 duration-500 ${step === 2 ? 'block' : 'hidden'}`}>
            <div className="p-5 sm:p-6 bg-emerald-50/40 rounded-3xl border border-emerald-100/50">
              <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2 mb-4">
                  <GraduationCap className="w-4 h-4" />
                  تسجيل الصف الدراسي
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5 relative">
                   <label className="text-xs font-black text-slate-500 mr-2">الصف الدراسي <span className="text-red-400">(إجباري)</span></label>
                   
                   {/* Custom Professional Select */}
                   <div className="relative group">
                      <div 
                        onClick={() => setIsClassSelectOpen(!isClassSelectOpen)}
                        className={`w-full bg-white border-2 cursor-pointer rounded-2xl py-3.5 pr-11 pl-4 flex items-center justify-between transition-all ${isClassSelectOpen ? 'border-emerald-500 ring-4 ring-emerald-500/5 shadow-lg' : 'border-slate-100 hover:border-emerald-200 shadow-sm'}`}
                      >
                         <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                         <span className={`font-bold text-sm ${selectedClass ? 'text-slate-800' : 'text-slate-400'}`}>
                           {selectedClass ? selectedClass.name : 'اختر الصف الدراسي...'}
                         </span>
                         <div className={`transition-transform duration-300 ${isClassSelectOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                         </div>
                      </div>

                      {/* Dropdown Menu */}
                      {isClassSelectOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="p-3 border-b border-slate-50 bg-slate-50/30">
                              <input 
                                type="text"
                                placeholder="ابحث عن صف..."
                                value={classSearch}
                                onChange={(e) => setClassSearch(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:border-emerald-500 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              />
                           </div>
                           <div className="max-h-60 overflow-y-auto custom-scrollbar">
                              {classes.filter(c => c.name.toLowerCase().includes(classSearch.toLowerCase())).length > 0 ? (
                                classes.filter(c => c.name.toLowerCase().includes(classSearch.toLowerCase())).map((c) => (
                                  <div 
                                    key={c.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedClass(c);
                                      setIsClassSelectOpen(false);
                                      setClassSearch('');
                                      handleClassChange(c);
                                    }}
                                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between group/item ${selectedClass?.id === c.id ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedClass?.id === c.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-600'}`}>
                                        <Layers className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <p className={`font-black text-sm ${selectedClass?.id === c.id ? 'text-emerald-700' : 'text-slate-700'}`}>{c.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">المرحلة الدراسية</p>
                                      </div>
                                    </div>
                                    {c.tuitionFee && (
                                      <div className="text-left">
                                        <p className="text-[10px] text-slate-400 font-black">القسط</p>
                                        <p className="text-xs font-black text-emerald-600">{formatNumber(c.tuitionFee)} IQD</p>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="p-8 text-center text-slate-400 font-bold text-xs">لا توجد نتائج مطابقة</div>
                              )}
                           </div>
                        </div>
                      )}
                   </div>
                </div>

                {selectedClass && selectedClass.tuitionFee && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-600 rounded-2xl border border-emerald-500 shadow-lg shadow-emerald-600/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md ring-1 ring-white/30">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-100">قسط الصف الدراسي المعتمد</p>
                      <p className="text-lg font-black text-white">{formatNumber(selectedClass.tuitionFee)} <span className="text-xs opacity-70">IQD</span></p>
                    </div>
                    <div className="mr-auto">
                       <CheckCircle2 className="w-6 h-6 text-white/40" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                ref={motherNameRef} 
                defaultValue={initialData?.studentProfile?.motherName} 
                label="اسم الأم (إجباري)" 
                placeholder="اسم الأم الكامل" 
                icon={User} 
              />
              <Input 
                ref={phoneRef} 
                defaultValue={initialData?.phone} 
                label="رقم هاتف ولي الأمر" 
                placeholder="07XXXXXXXX" 
                icon={Phone} 
              />
            </div>

            <Select 
              label="الحالة الاجتماعية لولي الأمر" 
              value={initialData?.studentProfile?.guardianMaritalStatus || ''} 
              onChange={(val) => {
                if (guardianMaritalStatusRef.current) guardianMaritalStatusRef.current.value = val;
              }} 
              placeholder="اختر الحالة الاجتماعية..."
              options={[
                { value: 'متزوج', label: 'متزوج' },
                { value: 'أعزب', label: 'أعزب' },
                { value: 'مطلق', label: 'مطلق' },
                { value: 'أرمل', label: 'أرمل' },
                { value: 'منفصل', label: 'منفصل' }
              ]} 
            />
            {/* Hidden ref for guardianMaritalStatus */}
            <input type="hidden" ref={guardianMaritalStatusRef} defaultValue={initialData?.studentProfile?.guardianMaritalStatus || ''} />
        </div>

        {/* ═══════════════ STEP 3 ═══════════════ */}
        <div className={`space-y-6 animate-in fade-in slide-in-from-left-6 duration-500 ${step === 3 ? 'block' : 'hidden'}`}>
            <div className="p-5 sm:p-6 bg-amber-50/40 rounded-3xl border border-amber-100/50">
              <h3 className="text-sm font-black text-amber-800 flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4" />
                  البيانات المالية للطالب
              </h3>
              <p className="text-amber-600 text-[10px] mb-5 font-bold">هذه البيانات اختيارية</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <Input 
                   ref={customTuitionFeeRef} 
                   defaultValue={initialData?.studentProfile?.customTuitionFee || ''} 
                   type="number" 
                   label="قسط الطالب السنوي المخصص" 
                   placeholder="مثال: 900000" 
                   dir="ltr"
                 />
                 <Input 
                   ref={discountAmountRef} 
                   defaultValue={initialData?.studentProfile?.discountAmount || ''} 
                   type="number" 
                   label="مبلغ الخصم" 
                   placeholder="مثال: 100000" 
                   dir="ltr"
                 />
              </div>

              <div className="mt-5 space-y-1.5">
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

            {selectedClass && selectedClass.tuitionFee && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-[11px] font-black text-slate-500">ملخص مالي</h4>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400 font-bold">قسط الصف</span>
                  <span className="font-black text-slate-600">{`${formatNumber(selectedClass.tuitionFee)} IQD`}</span>
                </div>
              </div>
            )}
        </div>
      </form>

      {/* Actions & Feedback */}
      <div className="p-8 sm:p-10 pb-10 pt-6 border-t border-slate-50 bg-slate-50/30 shrink-0 space-y-4">
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
            variant="emerald" 
            loading={loading || isVerifying}
            onClick={() => {
              if (step === 1) handleNext();
              else if (step === 2) handleNextToFinancial();
              else handleSubmitInternal();
            }} 
            disabled={loading || isVerifying} 
            className="w-full sm:w-2/3 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {(loading || isVerifying) ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             (step < totalSteps ? 'الخطوة التالية' : (initialData ? 'تحديث بيانات الطالب' : 'تسجيل الطالب الجديد'))}
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

AddStudentForm.displayName = 'AddStudentForm';

export default AddStudentForm;
