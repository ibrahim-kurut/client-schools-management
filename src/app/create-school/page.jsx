'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SchoolIdentity from '@/components/CreateSchool/SchoolIdentity';
import SchoolContact from '@/components/CreateSchool/SchoolContact';
import PlanSelection from '@/components/CreateSchool/PlanSelection';
import { LayoutDashboard, Save, ArrowRight, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createSchool } from '@/redux/slices/createSchoolSlice';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';

const CreateSchoolPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    address: '',
    phone: '',
    logo: '',
    planId: '',
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Login check 
  useEffect(() => {
    if (mounted && !isLoggedIn) {
      toast.warning('يرجى تسجيل الدخول أولاً لإنشاء مدرسة', { toastId: 'auth-warning' });
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  const [errors, setErrors] = useState({});

  if (!mounted || !isLoggedIn) {
    return null; // نعرض صفحة بيضاء مؤقتاً أثناء التحويل لتجنب وميض المحتوى
  }





  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();

    // Protection: only allow submission on the 3rd (final) step
    if (step < 3) {
      nextStep();
      return;
    }

    // Build FormData for multipart/form-data
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.address) data.append('address', formData.address);
    if (formData.phone) data.append('phone', formData.phone);
    if (formData.slug) data.append('slug', formData.slug);
    if (formData.planId) data.append('planId', formData.planId);
    
    // Append the actual file as 'logo'
    if (formData.logoFile) {
      data.append('logo', formData.logoFile);
    }

    dispatch(createSchool(data))
      .unwrap()
      .then(() => {
        toast.success(
          'تم إنشاء المدرسة بنجاح! سيتم تسجيل خروجك لتسجيل الدخول من جديد وتحديث الجلسة بمعرّف المدرسة.'
        );
        return dispatch(logout())
          .unwrap()
          .then(() => router.push('/login'))
          .catch((logoutErr) => {
            console.error('Logout after school creation:', logoutErr);
            toast.warning(
              'تم إنشاء المدرسة. يرجى تسجيل الدخول من جديد؛ إن لزم الأمر أعد تحميل الصفحة بعد تسجيل الخروج.'
            );
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user');
              window.location.assign('/login');
            }
          });
      })
      .catch((error) => {
        console.error('Creation failed:', error);
        toast.error(error.message || 'حدث خطأ أثناء إنشاء المدرسة');
      });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-4 shadow-sm">
              <LayoutDashboard className="w-4 h-4" />
              <span>إعداد مدرستك الجديدة</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
              أنشئ نظام مدرستك <span className="text-blue-600">الآن</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              أكمل البيانات التالية لبدء إدارة مدرستك باستخدام <span className="font-bold text-blue-700">EduFlow</span> بكل سهولة واحترافية.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-10 max-w-lg mx-auto">
            <div className="relative flex justify-between items-center">
              <div className="absolute top-1/2 start-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 start-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />

              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs font-bold text-slate-500 px-1">
              <span>هوية المدرسة</span>
              <span className={step >= 2 ? 'text-blue-600' : ''}>معلومات التواصل</span>
              <span className={step >= 3 ? 'text-blue-600' : ''}>خطة الاشتراك</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-12 transition-all duration-500 overflow-hidden relative">
            <form>
              {step === 1 && (
                <SchoolIdentity
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {step === 2 && (
                <SchoolContact
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {step === 3 && (
                <PlanSelection
                  selectedPlanId={formData.planId}
                  onSelectPlan={(id) => setFormData({ ...formData, planId: id })}
                />
              )}

              {/* Navigation Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-slate-50 pt-8">
                <div className="flex gap-4 w-full sm:w-auto">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
                    >
                      <ArrowRight className="w-5 h-5 rtl:hidden" />
                      <ArrowLeft className="w-5 h-5 ltr:hidden" />
                      السابق
                    </button>
                  )}
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={step === 1 && !formData.name}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                    >
                      التالي
                      <ArrowLeft className="w-5 h-5 rtl:hidden" />
                      <ArrowRight className="w-5 h-5 ltr:hidden" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-1"
                    >
                      إتمام العملية
                      <Save className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-slate-400 text-sm">
            <p>جميع البيانات مشفرة وآمنة وفقاً لأحدث معايير الأمان العالمية</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateSchoolPage;