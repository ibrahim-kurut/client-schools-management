'use client';

import Link from 'next/link';
import { GraduationCap, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    setShowLogoutConfirm(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <Link href={"/"} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              EduFlow
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">المميزات</Link>
            <Link href="#about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">عن النظام</Link>
            <Link href="/prices" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">الأسعار</Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            {!mounted ? (
              <div className="w-32 h-10 animate-pulse bg-slate-200 rounded-full hidden md:block" />
            ) : isLoggedIn ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-full font-semibold transition-all"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-slate-600 hover:text-blue-800 font-bold transition-colors">
                  تسجيل الدخول
                </Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
                  انضم الآن
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">تسجيل الخروج</h3>
            <p className="text-center text-slate-500 mb-8">هل أنت متأكد أنك تريد تسجيل الخروج من الحساب؟</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-0.5"
              >
                نعم، خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
