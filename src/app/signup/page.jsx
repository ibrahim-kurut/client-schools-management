'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, User, Phone, Mail, Lock,
  ArrowLeft, Loader2, CheckCircle2, Users
} from 'lucide-react';
import AuthInput from '@/components/AuthInput';
import { validateSignupStep1, validateSignupStep2 } from '@/lib/validation/authSchemas';
import { useDispatch } from 'react-redux';
import { register } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    birthDate: '',
  });


  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    setError('');
    const validation = validateSignupStep1(formData);
    if (validation.ok) setStep(2);
    else setError(validation.error);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validation = validateSignupStep2(formData);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    // send data to server
    const { confirmPassword, ...dataToSubmit } = formData;
    dispatch(register(dataToSubmit))
      .unwrap()
      .then((res) => {
        toast.success(
          res.message && res.message !== "User created successfully"
            ? res.message
            : "تم إنشاء الحساب بنجاح"
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          gender: "",
          birthDate: "",
        });
        setTimeout(() => {
          setIsLoading(false);
          // Redirect to login with a success parameter (we'll handle the UI there if needed)
          router.push('/login?registered=true');
        }, 2000);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.message || 'فشل إنشاء الحساب');
      });
  };

  return (
    <div className="min-h-screen flex" dir="ltr">
      {/* Left Side — Decorative Panel */}
      <div dir="rtl" className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 items-center justify-center overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl" />

        {/* Floating shapes */}
        <div className="absolute top-24 right-20 w-14 h-14 border-2 border-white/20 rounded-xl rotate-12 animate-float" />
        <div className="absolute bottom-40 left-16 w-10 h-10 border-2 border-white/15 rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 right-12 w-6 h-6 bg-white/10 rounded-md rotate-45 animate-float" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl inline-flex mb-8">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-snug">
            ابدأ رحلتك مع
            <span className="block text-indigo-200 mt-2">EduFlow</span>
          </h2>
          <p className="text-indigo-100/80 text-lg leading-relaxed mb-10">
            أنشئ حسابك الآن واحصل على نظام إدارة مدرسية متكامل يساعدك في أتمتة جميع عملياتك.
          </p>

          {/* Benefits */}
          <div className="text-right space-y-4">
            {['إعداد سريع خلال دقائق', 'دعم فني متواصل 24/7', 'تجربة مجانية كاملة'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-indigo-100/90">
                <CheckCircle2 className="w-5 h-5 text-indigo-300 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Signup Form */}
      <div dir="rtl" className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 text-right">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              EduFlow
            </span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">إنشاء حساب جديد</h1>
            <p className="text-slate-500">أنشئ حسابك كمدير مدرسة وابدأ إدارة مؤسستك</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                1
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>البيانات الشخصية</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'} transition-colors`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>بيانات الحساب</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2 animate-shake">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* ──── Step 1: Personal Info ──── */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                {/* Names */}
                <div className="grid grid-cols-2 gap-4">
                  <AuthInput
                    id="signup-firstName"
                    label="الاسم الأول"
                    icon={User}
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="أحمد"
                    className="text-right"
                  />
                  <AuthInput
                    id="signup-lastName"
                    label="الاسم الأخير"
                    icon={User}
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="محمد"
                    className="text-right"
                  />
                </div>

                {/* Phone */}
                <AuthInput
                  id="signup-phone"
                  label="رقم الهاتف"
                  type="tel"
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="07701234567"
                  dir="ltr"
                  className="text-right"
                />

                {/* Gender */}
                <div>
                  <label htmlFor="signup-gender" className="block text-sm font-semibold text-slate-700 mb-2">الجنس</label>
                  <div className="relative">
                    <Users className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      id="signup-gender"
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      dir="rtl"
                      className="auth-input ps-12 appearance-none cursor-pointer text-right"
                    >
                      <option value="">اختر الجنس</option>
                      <option value="MALE">ذكر</option>
                      <option value="FEMALE">أنثى</option>
                    </select>
                  </div>
                </div>

                <AuthInput
                  id="signup-birthDate"
                  label="تاريخ الميلاد"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateField('birthDate', e.target.value)}
                  className="text-right"
                />

                <button type="button" onClick={handleNextStep} className="auth-btn w-full">التالي</button>
              </div>
            )}

            {/* ──── Step 2: Account Info ──── */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <AuthInput
                  id="signup-email"
                  label="البريد الإلكتروني"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  className="text-right"
                  autoComplete="email"
                />

                <div className="space-y-1">
                  <AuthInput
                    id="signup-password"
                    label="كلمة المرور"
                    type="password"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="••••••••"
                    dir="rtl"
                    className="text-right"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-slate-400 mt-1">يجب أن تكون 6 أحرف على الأقل</p>
                </div>

                <AuthInput
                  id="signup-confirmPassword"
                  label="تأكيد كلمة المرور"
                  type="password"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  dir="rtl"
                  className="text-right"
                  autoComplete="new-password"
                />

                {/* Buttons */}
                <div dir="ltr" className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    dir="rtl"
                    className="flex-1 py-3.5 px-6 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl font-semibold transition-all text-right"
                  >
                    السابق
                  </button>
                  <button type="submit" disabled={isLoading} dir="rtl" className="auth-btn flex-[2] text-right">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري إنشاء الحساب...
                      </span>
                    ) : (
                      'إنشاء الحساب'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">أو</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
              تسجيل الدخول
            </Link>
          </p>

          {/* Back to Home */}
          <Link href="/" className="mt-6 flex flex-row-reverse items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
