"use client";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SchoolGuard({ children }) {
  const { user, isLoggedIn, status } = useSelector((state) => state.auth);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const isLoginPage = pathname?.endsWith('/login');

    // Login page is PUBLIC — always accessible, skip all auth checks
    if (isLoginPage) {
      setIsAuthorized(true);
      return;
    }

    // Wait for Redux to initialize if checking localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser && !isLoggedIn && status !== 'loading') {
      router.replace('/login');
      return;
    }

    // Safely get user properties
    const userData = user?.userData || user;
    if (!userData) return;

    const currentSlug = params?.slug;
    const isWelcomePage = pathname?.endsWith('/welcome');

    // Super Admin has access to everything
    if (userData?.role === 'SUPER_ADMIN') {
      setIsAuthorized(true);
      return;
    }

    // Check slug match
    const decodedCurrentSlug = currentSlug ? decodeURIComponent(currentSlug) : null;
    const userSchoolSlug = userData?.schoolSlug ? decodeURIComponent(userData.schoolSlug) : null;

    if (userSchoolSlug && decodedCurrentSlug === userSchoolSlug) {
      // Staff members (non SCHOOL_ADMIN) have restricted access
      const staffRoles = ['TEACHER', 'ACCOUNTANT', 'ASSISTANT', 'STUDENT'];
      if (staffRoles.includes(userData.role)) {
        // Teacher can access /teacher/* routes
        const isTeacherRoute = pathname?.includes(`/school/${currentSlug}/teacher`);
        if (userData.role === 'TEACHER' && isTeacherRoute) {
          setIsAuthorized(true);
          return;
        }

        if (isWelcomePage) {
          setIsAuthorized(true);
        } else if (userData.role === 'TEACHER') {
          // Redirect teacher to their dashboard
          router.replace(`/school/${currentSlug}/teacher`);
        } else {
          // Redirect other staff to welcome page
          router.replace(`/school/${currentSlug}/welcome`);
        }
        return;
      }

      // School Admin has full access
      setIsAuthorized(true);
    } else {
      // Unauthorized! Attempting to access another school
      Swal.fire({
        title: 'غير مصرح!',
        text: 'هذا الرابط خاص بمدرسة أخرى، لا تملك صلاحية الدخول إليه.',
        icon: 'error',
        confirmButtonText: 'عودة لمدرستك',
        confirmButtonColor: '#2563eb',
        allowOutsideClick: false,
        customClass: {
          popup: 'rounded-[32px] font-sans rtl',
          confirmButton: 'rounded-2xl px-8 py-3 font-black text-sm'
        }
      }).then(() => {
        if (userData?.schoolSlug) {
          router.replace(`/school/${userData.schoolSlug}`);
        } else {
          router.replace('/create-school'); // Fallback
        }
      });
    }
  }, [user, isLoggedIn, status, router, params, pathname]);

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold text-lg animate-pulse">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

