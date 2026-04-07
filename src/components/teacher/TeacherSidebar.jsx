"use client";
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  LogOut,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Link from 'next/link';

const navItems = (slug) => [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: `/school/${slug}/teacher` },
  { icon: Users, label: "فصولي وطلابي", href: `/school/${slug}/teacher/my-classes` },
  { icon: ClipboardList, label: "رصد الدرجات", href: `/school/${slug}/teacher/grades` },
  { icon: CalendarCheck, label: "الحضور والغياب", href: `/school/${slug}/teacher/attendance` },
  { icon: UserCircle, label: "الملف الشخصي", href: `/school/${slug}/teacher/profile` },
];

const SidebarItem = ({ icon: Icon, label, isActive = false, href = "/", collapsed = false, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
      isActive
        ? 'bg-white/15 text-white shadow-lg shadow-indigo-900/20 border border-white/10'
        : 'text-indigo-200/70 hover:bg-white/8 hover:text-white'
    } ${collapsed ? 'justify-center px-3' : ''}`}
    title={collapsed ? label : undefined}
  >
    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-indigo-300/70 group-hover:text-white'} transition-colors`} />
    {!collapsed && <span className="font-bold text-sm tracking-wide">{label}</span>}
  </Link>
);

export default function TeacherSidebar({ slug }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم تسجيل خروجك من النظام.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
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
        toast.success("تم تسجيل الخروج بنجاح");
        router.push(`/school/${slug}/login`);
      } catch {
        router.push(`/school/${slug}/login`);
      }
    }
  };

  const actualUser = user?.userData || user;
  const displayUser = mounted ? {
    name: actualUser?.firstName ? `${actualUser.firstName} ${actualUser.lastName || ''}`.trim() : "معلم",
    email: actualUser?.email || "teacher@school.com",
  } : {
    name: "معلم",
    email: "teacher@school.com",
  };

  const items = navItems(slug);

  const sidebarContent = (
    <>
      {/* Profile Section */}
      <div className={`flex flex-col items-center mb-8 text-center ${collapsed ? 'px-2' : 'px-2'}`}>
        <div className={`${collapsed ? 'w-12 h-12' : 'w-20 h-20'} rounded-full bg-white/10 p-1 mb-4 shadow-xl border-2 border-white/20 transition-all duration-300`}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center">
            <BookOpen className={`${collapsed ? 'w-5 h-5' : 'w-9 h-9'} text-white transition-all`} />
          </div>
        </div>
        {!collapsed && (
          <>
            <h3 className="text-white font-black text-lg leading-tight mb-1">{displayUser.name}</h3>
            <div className="inline-flex items-center gap-1.5 bg-indigo-400/20 px-3 py-1 rounded-full mt-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-indigo-300 font-bold text-xs">معلم</span>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div className={`h-px bg-white/10 mb-6 ${collapsed ? 'mx-2' : 'mx-3'}`} />

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={
              item.href === `/school/${slug}/teacher`
                ? pathname === `/school/${slug}/teacher`
                : pathname?.startsWith(item.href)
            }
            collapsed={collapsed}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-indigo-200/60 hover:bg-red-500/15 hover:text-red-400 transition-all duration-300 font-bold text-sm ${collapsed ? 'justify-center px-3' : ''}`}
          title={collapsed ? 'تسجيل الخروج' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-[#1e1b4b] via-[#1e1b4b] to-[#312e81] z-40 flex flex-col p-6 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="mt-14">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex ${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-[#1e1b4b] via-[#1e1b4b] to-[#312e81] flex-col h-full overflow-hidden p-6 border-l border-indigo-800/30 transition-all duration-300 relative`}>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors z-10 border border-indigo-400/30"
        >
          {collapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
