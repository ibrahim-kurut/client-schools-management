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
      setIsAuthorized(true); // eslint-disable-line react-hooks/set-state-in-effect -- ضروري لمنطق التحقق من الصلاحيات
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
    const normalizeSlug = (s) => decodeURIComponent(s || '').replace(/\s+/g, '-');
    const decodedCurrentSlug = normalizeSlug(currentSlug);
    const userSchoolSlug = normalizeSlug(userData?.schoolSlug);

    if (userSchoolSlug && decodedCurrentSlug === userSchoolSlug) {
      const role = userData.role;

      // 1. Super Admin: full access
      if (role === 'SUPER_ADMIN') {
        setIsAuthorized(true);
        return;
      }

      // 2. Teacher: specialized access
      if (role === 'TEACHER') {
        const isTeacherRoute = pathname?.includes(`/school/${currentSlug}/teacher`);
        if (isTeacherRoute || isWelcomePage) {
          setIsAuthorized(true);
        } else {
          router.replace(`/school/${currentSlug}/teacher`);
        }
        return;
      }

      // 3. Student: restricted to student dashboard
      if (role === 'STUDENT') {
        const isStudentRoute = pathname?.includes(`/school/${currentSlug}/student`);
        if (isStudentRoute) {
          setIsAuthorized(true);
        } else {
          router.replace(`/school/${currentSlug}/student`);
        }
        return;
      }

      // 4. Accountant: Financial + Students + Reports
      if (role === 'ACCOUNTANT') {
        const allowedPaths = [
          `/school/${currentSlug}/financial`,
          `/school/${currentSlug}/students`,
          `/school/${currentSlug}/reports`,
        ];
        
        const isExactDashboard = pathname === `/school/${currentSlug}` || pathname === `/school/${currentSlug}/`;
        const isAllowed = allowedPaths.some(path => pathname?.startsWith(path)) || isExactDashboard;

        if (isAllowed) {
          setIsAuthorized(true);
        } else {
          router.replace(`/school/${currentSlug}`);
        }
        return;
      }

      // 5. Assistant: Academic + Members (Add only) + Reports
      if (role === 'ASSISTANT') {
        const restrictedPaths = [
          `/school/${currentSlug}/financial`,
          `/school/${currentSlug}/settings`,
        ];

        const isRestricted = restrictedPaths.some(path => pathname?.startsWith(path));

        if (!isRestricted) {
          setIsAuthorized(true);
        } else {
          router.replace(`/school/${currentSlug}`);
        }
        return;
      }

      // 6. School Admin: Full Access
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

