"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Wallet, 
  TrendingUp, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';

const SidebarItem = ({ icon: Icon, label, isActive = false, href = "/" }) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </Link>
);

export default function DashboardSidebar({ slug }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم تسجيل خروجك من النظام الأكاديمي.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb', // blue-600
      cancelButtonColor: '#64748b',  // slate-500
      confirmButtonText: 'نعم، خروج',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl',
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
        router.push('/login');
      } catch (error) {
        toast.error("فشل تسجيل الخروج");
        // Even if it fails on server, we should probably clear local state
        router.push('/login');
      }
    }
  };

  const actualUser = user?.userData || user;


  // Use default mockup if not mounted to match server state and avoid hydration mismatch
  const displayUser = mounted ? {
    name: actualUser?.firstName ? `${actualUser.firstName} ${actualUser.lastName || ''}`.trim() : "مدير المدرسة",
    email: actualUser?.email || "admin@school.com",
    schoolLogo: actualUser?.schoolLogo || null
  } : {
    name: "مدير المدرسة",
    email: "admin@school.com",
    schoolLogo: null
  };

  return (
    <aside className="w-72 bg-[#1e293b] flex flex-col h-full lg:rounded-l-none overflow-hidden p-8 border-l border-slate-700 hidden lg:flex">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-700 p-1 mb-4 shadow-xl border-2 border-slate-600">
          <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
             {displayUser.schoolLogo ? (
               <Image src={displayUser.schoolLogo} alt={displayUser.name} width={80} height={80} className="w-full h-full object-cover" />
             ) : (
               <User className="w-10 h-10 text-blue-600" />
             )}
          </div>
        </div>
        <h3 className="text-white font-black text-lg leading-tight mb-1">{displayUser.name}</h3>
        <p className="text-slate-500 font-semibold">مدير المدرسة</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="لوحة التحكم" href={`/school/${slug}`} isActive={pathname === `/school/${slug}`} />
        <SidebarItem icon={Users} label="إدارة الطلاب" href={`/school/${slug}/students`} isActive={pathname === `/school/${slug}/students`} />
        <SidebarItem icon={BookOpen} label="المراحل والصفوف" href={`/school/${slug}/classes`} isActive={pathname === `/school/${slug}/classes`} />
        <SidebarItem icon={GraduationCap} label="إدارة الأعضاء" href={`/school/${slug}/members`} isActive={pathname === `/school/${slug}/members`} />
        <SidebarItem icon={Wallet} label="الشؤون المالية" href={`/school/${slug}/finance`} isActive={pathname === `/school/${slug}/finance`} />
        <SidebarItem icon={TrendingUp} label="التقارير والإحصائيات" href={`/school/${slug}/reports`} isActive={pathname === `/school/${slug}/reports`} />
        <SidebarItem icon={Settings} label="الإعدادات العامة" href={`/school/${slug}/settings`} isActive={pathname === `/school/${slug}/settings`} />
      </nav>

      {/* Logout */}
      <div className="mt-10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
