'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Mail, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import AuthInput from '@/components/AuthInput';
import { validateLogin } from '@/lib/validation/authSchemas';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (mounted && isLoggedIn) {
      const userData = user?.userData || user;

      // 1. Check for Super Admin
      if (userData?.role === "SUPER_ADMIN") {
        router.replace('/super-admin');
        return;
      }

      // 2. Staff members → welcome page
      const staffRoles = ['TEACHER', 'ACCOUNTANT', 'ASSISTANT', 'STUDENT'];
      if (staffRoles.includes(userData?.role) && userData?.schoolSlug) {
        router.replace(`/school/${userData.schoolSlug}/welcome`);
        return;
      }

      // 3. Check for School Admin with slug
      if (userData?.schoolSlug) {
        router.replace(`/school/${userData.schoolSlug}`);
      } else {
        // 4. New School Admin without school yet
        router.replace('/create-school');
      }
    }
  }, [mounted, isLoggedIn, user, router]);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validation = validateLogin({ email, password });
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setIsLoading(true);

    dispatch(login(validation.data))
      .unwrap()
      .then((res) => {
        toast.success(
          res.message && res.message !== 'Login successful'
            ? res.message
            : 'تم تسجيل الدخول بنجاح'
        );
        
        setTimeout(() => {
          setIsLoading(false);
          const userData = res.userData;

          // 1. Handle Super Admin redirection
          if (userData?.role === "SUPER_ADMIN") {
            router.push('/super-admin');
          }
          // 2. Staff members → welcome page
          else if (['TEACHER', 'ACCOUNTANT', 'ASSISTANT', 'STUDENT'].includes(userData?.role) && userData?.schoolSlug) {
            router.push(`/school/${userData.schoolSlug}/welcome`);
          }
          // 3. Handle School Admin with slug
          else if (userData?.schoolSlug) {
            router.push(`/school/${userData.schoolSlug}`);
          } 
          // 4. Handle School Admin without school yet
          else {
            router.push('/create-school');
          }
        }, 1500);
      })
      .catch((err) => {
        toast.error(err.message || 'فشل تسجيل الدخول');
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex" dir="ltr">
      {/* Left Side — Decorative Panel */}
      <div dir="rtl" className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 items-center justify-center overflow-hidden">
        {/* Background blurs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-2xl" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-32 right-20 w-12 h-12 border-2 border-white/15 rounded-full animate-float-delayed" />
        <div className="absolute top-1/3 right-16 w-8 h-8 bg-white/10 rounded-lg rotate-45 animate-float" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl inline-flex mb-8">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-snug">
            مرحباً بك مجدداً في
            <span className="block text-blue-200 mt-2">EduFlow</span>
          </h2>
          <p className="text-blue-100/80 text-lg leading-relaxed">
            نظام الإدارة المدرسية المتكامل الذي يمنحك التحكم الكامل بمؤسستك التعليمية بذكاء وكفاءة.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-white">+50</div>
              <div className="text-blue-200/70 text-sm mt-1">مدرسة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">+5K</div>
              <div className="text-blue-200/70 text-sm mt-1">طالب</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">99%</div>
              <div className="text-blue-200/70 text-sm mt-1">رضا</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div dir="rtl" className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 text-right">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              EduFlow
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">تسجيل الدخول</h1>
            <p className="text-slate-500">أدخل بياناتك للوصول إلى لوحة التحكم</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2 animate-shake">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="login-email"
              label="البريد الإلكتروني"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              dir="ltr"
              className="text-right"
              autoComplete="email"
            />

            <AuthInput
              id="login-password"
              label="كلمة المرور"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-right"
              autoComplete="current-password"
            />

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="auth-btn w-full">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">أو</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Signup Link */}
          <p className="text-center text-slate-600">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
              أنشئ حساباً جديداً
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
