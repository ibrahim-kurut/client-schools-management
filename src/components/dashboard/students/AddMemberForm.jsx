"use client";
import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, GraduationCap, Calendar, Users, Loader2, Camera, XCircle, X, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

/**
 * @description Reusable form for Adding or Editing School Members (Students, Teachers, Assistants, Accountants)
 * @param {string} role - The role of the member being added ('STUDENT', 'TEACHER', 'ASSISTANT', 'ACCOUNTANT')
 */
export default function AddMemberForm({ 
  role = 'STUDENT',
  onSubmit, 
  onCancel, 
  initialData = null, 
  loading = false, 
  error = null, 
  classes = [] 
}) {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [validationError, setValidationError] = useState('');

  // Determine role-based labels
  const getRoleLabel = (roleName) => {
    switch (roleName) {
      case 'STUDENT': return 'طالب';
      case 'TEACHER': return 'معلم';
      case 'ASSISTANT': return 'معاون';
      case 'ACCOUNTANT': return 'محاسب';
      default: return 'عضو';
    }
  };

  const roleLabel = getRoleLabel(role);

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    password: '', 
    birthDate: initialData?.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
    gender: initialData?.gender || 'MALE',
    phone: initialData?.phone || '',
    className: initialData?.className || '',
    image: null
  });

  // No longer auto-assigning class to let the user pick from the placeholder

 // No auto-assign in useEffect either

  // Translate common backend errors
  const translateError = (errorMsg) => {
    if (!errorMsg) return '';
    const errorMap = {
      "User with this email already exists": "هذا البريد الإلكتروني مسجل مسبقاً لمستخدم آخر",
      "School not found for this user": "لم يتم العثور على المدرسة الخاصة بك",
      "School plan is not active": "اشتراك المدرسة غير نشط حالياً",
      "Assistants can only add Teachers or Students": "المعاون يمكنه إضافة معلمين أو طلاب فقط",
      "Class name is required for students": "يجب اختيار الصف الدراسي للطالب",
      "Class not found in this school": "الصف الدراسي المختار غير موجود في هذه المدرسة",
      "Plan limit reached for Students. Upgrade your plan.": "تم الوصول للحد الأقصى للطلاب في خطتك الحالية. يرجى الترقية.",
      "Plan limit reached for Teachers. Upgrade your plan.": "تم الوصول للحد الأقصى للمعلمين/الموظفين. يرجى الترقية.",
      "failed to create user": "فشلت العملية، حاول مرة أخرى"
    };
    return errorMap[errorMsg] || errorMsg;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (step === 1) {
      // Step 1 Validation
      if (!formData.firstName.trim()) return setValidationError(`يرجى إدخال الاسم الأول ل${roleLabel}`);
      if (!formData.lastName.trim()) return setValidationError(`يرجى إدخال اسم العائلة`);
      if (!formData.email.trim()) return setValidationError('يجب إدخال البريد الإلكتروني');
      
      if (!initialData && !formData.password.trim()) return setValidationError('كلمة المرور مطلوبة للعضو الجديد');
      if (formData.password && formData.password.length < 6) return setValidationError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      
      if (!formData.birthDate) return setValidationError('تاريخ الميلاد مطلوب');

      setStep(2);
      return;
    }

    // Step 2 Validation: Phone is always required for all roles
    if (!formData.phone.trim()) return setValidationError('يرجى إدخال رقم الهاتف للتواصل');
    
    // Class name validation ONLY if role is STUDENT
    if (role === 'STUDENT' && !formData.className) {
      return setValidationError('يرجى اختيار الصف الدراسي');
    }

    onSubmit(formData);
  };

  return (
    <div className="relative">
      {/* Dynamic Header Badge/Text can be added here if needed, but the Modal usually handles the Title */}
      
      {/* Stepper */}
      <div className="flex p-6 border-b border-slate-100 bg-slate-50">
        <div className="flex-1 flex flex-col items-center gap-2 relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-300 ${step >= 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-200 text-slate-500'}`}>
            1
          </div>
          <span className={`text-sm font-bold ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>بيانات ال{roleLabel}</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 relative">
          <div className="absolute top-5 right-1/2 w-full h-[2px] bg-slate-200 -z-0 -translate-y-1/2">
            <div className={`h-full bg-blue-600 transition-all duration-500 ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-300 ${step >= 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
            2
          </div>
          <span className={`text-sm font-bold ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>بيانات التواصل {role === 'STUDENT' && 'والأكاديمية'}</span>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-all overflow-hidden relative group"
              >
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    width={96} 
                    height={96} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-500 mt-1">صورة الشخصية</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="hidden" 
              />
              <p className="text-[10px] text-red-400 mt-2 font-medium">(اختياري) اختر صورة شخصية لل{roleLabel}</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الأول</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="أحمد" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم العائلة</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="العلي" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني لل{roleLabel}</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    dir="ltr" 
                    required
                    placeholder="example@edu.com" 
                    className="w-full text-right bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور {initialData && "(اختياري)"}</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">***</span>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    dir="ltr" 
                    minLength={6}
                    placeholder="••••••••" 
                    className="w-full text-right bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ الميلاد</label>
                <div className="relative">
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="date" 
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-600 font-sans" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الجنس</label>
                <div className="relative">
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-600 cursor-pointer"
                  >
                    <option value="MALE">ذكر</option>
                    <option value="FEMALE">أنثى</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Contact Section */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mb-6">
              <h3 className="text-sm font-black text-emerald-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                بيانات التواصل الأساسية
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">رقم الهاتف (للضرورة)</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="ltr" 
                    placeholder="077xxxxxxxxx" 
                    className="w-full text-right bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" 
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific: Academic Section (ONLY FOR STUDENTS) */}
            {role === 'STUDENT' && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                <h3 className="text-sm font-black text-blue-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  المسار التعليمي والصف
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">توزيع الصف الدراسي</label>
                  <select 
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm cursor-pointer"
                  >
                    <option value="" disabled>اختر الصف الدراسي</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    {classes.length === 0 && (
                      <option value="" disabled>لا توجد صفوف مدخلة بعد</option>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* If Teacher, could add specialization or other fields here in future */}
            {role !== 'STUDENT' && (
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 flex items-center gap-4 text-slate-500 shadow-inner">
                 <ShieldCheck className="w-10 h-10 text-blue-600" />
                 <div>
                    <p className="text-sm font-bold text-slate-700">بيانات الصلاحيات</p>
                    <p className="text-[10px]">سيتم إنشاء الحساب بصلاحية **{roleLabel}** لهذا القسم.</p>
                 </div>
              </div>
            )}

          </div>
        )}
      </form>

      {/* Error Displays */}
      <div className="px-8 pb-4">
        {validationError && (
          <div className="mb-2 p-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {validationError}
            </div>
            <button onClick={() => setValidationError('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {error && (
          <div className="mb-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {translateError(error)}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
        <button 
          type="button"
          onClick={() => {
            if (step === 2) setStep(1);
            else onCancel();
          }}
          className="px-6 py-3 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl font-bold transition-colors cursor-pointer"
        >
          {step === 2 ? 'السابق' : 'إلغاء العملية'}
        </button>
        
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center min-w-[140px] px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            step === 1 ? 'متابعة' : (initialData ? `تحديث ${roleLabel}` : `حفظ وتثبيت ال${roleLabel}`)
          )}
        </button>
      </div>
    </div>
  );
}
