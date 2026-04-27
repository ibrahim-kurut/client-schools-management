'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GraduationCap, Mail, Lock, Loader2, School } from 'lucide-react';
import AuthInput from '@/components/AuthInput';
import { useDispatch } from 'react-redux';
import { loginWithSchoolSlug } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';

export default function SchoolLoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug || '';
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Countdown timer for Rate Limit lockout
  useEffect(() => {
    let timer;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const schoolDisplayName = decodeURIComponent(slug).replace(/-/g, ' ');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError("البريد الإلكتروني أو كود الطالب مطلوب");
      return;
    }
    if (!password.trim()) {
      setError("كلمة المرور مطلوبة");
      return;
    }

    setIsLoading(true);

    const isEmail = identifier.includes('@');
    const loginPayload = {
      slug: decodeURIComponent(slug),
      password,
      ...(isEmail ? { email: identifier } : { studentCode: identifier })
    };

    dispatch(loginWithSchoolSlug(loginPayload))
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

          // School Admin, Accountant, or Assistant → Dashboard
          if (['SCHOOL_ADMIN', 'ACCOUNTANT', 'ASSISTANT'].includes(userData?.role)) {
            router.push(`/school/${slug}`);
          }
          // Teacher → Teacher Dashboard
          else if (userData?.role === 'TEACHER') {
            router.push(`/school/${slug}/teacher`);
          }
          // Others (e.g. Student) → Student Dashboard
          else {
            router.push(`/school/${slug}/student`);
          }
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);

        // Handle Rate Limit (429)
        if (err.status === 429) {
          const retryAfter = parseInt(err.retryAfter) || 300;
          setLockoutTimer(retryAfter);
          setError(''); // Clear normal error
          return;
        }

        toast.error(err.message || 'فشل تسجيل الدخول');
        // Increment failed attempts if it's an authentication error
        if (err.status === 401 || (err.response && err.response.status === 401)) {
          setFailedAttempts(prev => prev + 1);
        }
      });
  };

  return (
    <div className="min-h-screen flex" dir="ltr">
      {/* Left Side — School Branded Panel */}
      <div dir="rtl" className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 items-center justify-center overflow-hidden">
        {/* Background blurs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-2xl" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 border-2 border-white/20 rounded-2xl rotate-12 animate-float" />
        <div className="absolute bottom-32 right-20 w-12 h-12 border-2 border-white/15 rounded-full animate-float-delayed" />
        <div className="absolute top-1/3 right-16 w-8 h-8 bg-white/10 rounded-lg rotate-45 animate-float" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="bg-white/15 backdrop-blur-sm p-5 rounded-3xl inline-flex mb-8">
            <School className="h-14 w-14 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-snug capitalize">
            {schoolDisplayName}
          </h2>
          <div className="w-16 h-1 bg-emerald-300/50 rounded-full mx-auto mb-6" />
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            مرحباً بك في بوابة الدخول الخاصة بمدرستك.
            <br />
            سجّل دخولك للوصول إلى نظام الإدارة المدرسية.
          </p>

          {/* Powered by Badge */}
          <div className="mt-16 flex items-center justify-center gap-2 text-emerald-200/60">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-bold">Powered by نقطة</span>
          </div>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div dir="rtl" className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 text-right">
        <div className="w-full max-w-md">
          {/* Mobile School Header */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-10">
            <div className="bg-emerald-600 p-3 rounded-2xl text-white">
              <School className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-700 capitalize">
              {schoolDisplayName}
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">تسجيل الدخول</h1>
            <p className="text-slate-500">
              أدخل بياناتك للوصول إلى نظام{' '}
              <span className="font-bold text-emerald-600 capitalize">{schoolDisplayName}</span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2 animate-shake">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Rate Limit Lockout Message */}
          {lockoutTimer > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              <span>
                لقد تجاوزت حد المحاولات. يرجى المحاولة مرة أخرى بعد {formatTime(lockoutTimer)} دقيقة.
              </span>
            </div>
          )}

          {/* Failed Attempts Warning */}
          {failedAttempts >= 7 && failedAttempts < 10 && lockoutTimer === 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
              <span>
                تبقت لك {10 - failedAttempts} محاولات فقط قبل أن يتم حظر الدخول مؤقتاً لمدة 5 دقائق.
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="school-login-id"
              label="البريد الإلكتروني أو كود الطالب"
              type="text"
              icon={Mail}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="البريد الإلكتروني أو كود الطالب"
              dir="ltr"
              className="text-right"
              autoComplete="username"
            />

            <AuthInput
              id="school-login-password"
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
            <button type="submit" disabled={isLoading || lockoutTimer > 0} className="auth-btn w-full !from-emerald-600 !to-teal-600 hover:!from-emerald-700 hover:!to-teal-700 hover:!shadow-emerald-900/20">
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

        </div>
      </div>
    </div>
  );
}
