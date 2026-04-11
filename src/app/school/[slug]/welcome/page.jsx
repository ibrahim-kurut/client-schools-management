'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, LogOut, GraduationCap, Sparkles, BookOpen, Calculator, UserCheck, Users } from 'lucide-react';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const roleLabels = {
  TEACHER: { label: 'معلم', icon: BookOpen, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-600' },
  ACCOUNTANT: { label: 'محاسب', icon: Calculator, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  ASSISTANT: { label: 'مساعد', icon: UserCheck, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-600' },
  STUDENT: { label: 'طالب', icon: Users, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  SCHOOL_ADMIN: { label: 'مدير المدرسة', icon: GraduationCap, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

export default function WelcomePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug || '';
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not logged in or if the user should go to the dashboard
  useEffect(() => {
    if (mounted) {
      if (!isLoggedIn) {
        router.replace(`/school/${slug}/login`);
        return;
      }

      const userData = user?.userData || user;
      const role = userData?.role;

      // New Roles (ASSISTANT, ACCOUNTANT) should go to the dashboard
      // SCHOOL_ADMIN also goes to dashboard
      if (['ASSISTANT', 'ACCOUNTANT', 'SCHOOL_ADMIN'].includes(role)) {
        router.replace(`/school/${slug}`);
      }
      
      // Teacher has their own route handled by guard usually, 
      // but we can redirect them to /teacher if they land here
      if (role === 'TEACHER') {
        router.replace(`/school/${slug}/teacher`);
      }

      // Student has their own route
      if (role === 'STUDENT') {
        router.replace(`/school/${slug}/student`);
      }
    }
  }, [mounted, isLoggedIn, router, slug, user]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم تسجيل خروجك من النظام.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، خروج',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[32px] font-sans border border-slate-100 shadow-2xl',
        title: 'font-black text-slate-800',
        htmlContainer: 'text-slate-500 font-bold',
        confirmButton: 'rounded-2xl px-10 py-3 font-black text-sm',
        cancelButton: 'rounded-2xl px-10 py-3 font-black text-sm'
      }
    });

    if (result.isConfirmed) {
      try {
        await dispatch(logout()).unwrap();
        toast.success('تم تسجيل الخروج بنجاح');
        router.push(`/school/${slug}/login`);
      } catch {
        router.push(`/school/${slug}/login`);
      }
    }
  };

  if (!mounted || !isLoggedIn) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const userData = user?.userData || user;
  const firstName = userData?.firstName || 'المستخدم';
  const lastName = userData?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const role = userData?.role || 'TEACHER';
  const roleInfo = roleLabels[role] || roleLabels.TEACHER;
  const RoleIcon = roleInfo.icon;
  const schoolDisplayName = decodeURIComponent(slug).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6" dir="rtl">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-50/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Top Gradient Banner */}
          <div className={`bg-gradient-to-r ${roleInfo.color} p-8 text-center`}>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-4">
              <RoleIcon className="w-10 h-10 text-white" />
            </div>
            <div className={`inline-flex items-center gap-2 ${roleInfo.bg} px-4 py-1.5 rounded-full mb-4`}>
              <Sparkles className={`w-4 h-4 ${roleInfo.text}`} />
              <span className={`text-sm font-black ${roleInfo.text}`}>{roleInfo.label}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-3">
              مرحباً بك، {firstName}! 👋
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-2">
              أهلاً{' '}
              <span className="font-bold text-slate-700">{fullName}</span>
              {' '}في نظام{' '}
              <span className="font-bold text-emerald-600 capitalize">{schoolDisplayName}</span>
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              نحن نعمل بجد لتجهيز لوحة التحكم الخاصة بك. قريباً ستتمكن من الوصول إلى جميع الأدوات والموارد التي تحتاجها.
            </p>

            {/* Status Card */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-sm font-black text-slate-700">قيد التطوير</span>
              </div>
              <p className="text-slate-500 text-sm">
                صفحتك الخاصة كـ <span className="font-bold">{roleInfo.label}</span> ستكون جاهزة قريباً إن شاء الله.
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 font-bold text-sm border border-slate-200 hover:border-red-200"
            >
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
          <GraduationCap className="w-4 h-4" />
          <span className="text-xs font-bold">Powered by EduFlow</span>
        </div>
      </div>
    </div>
  );
}
