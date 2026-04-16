"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Layers,
  Wallet, 
  TrendingUp, 
  Settings, 
  LogOut,
  User,
  CalendarDays,
  Archive,
  PieChart,
  ArrowLeftRight,
  FileText
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';

const SidebarItem = ({ icon: Icon, label, isActive = false, href = "/", iconColor = "text-blue-500" }) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-slate-800/50 group-hover:bg-slate-700'}`}>
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : iconColor}`} />
    </div>
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

  const normalizedSlug = slug ? slug.toString().replace(/\s+/g, '-') : '';
  const actualUser = user?.userData || user;
  const role = actualUser?.role || 'TEACHER';

  const menuItems = [
    { icon: LayoutDashboard, label: "لوحة التحكم", href: `/school/${normalizedSlug}`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'ACCOUNTANT', 'SUPER_ADMIN'], color: 'text-blue-400' },
    { icon: GraduationCap, label: "إدارة الأعضاء", href: `/school/${normalizedSlug}/members`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'], color: 'text-violet-400' },
    { icon: Users, label: "إدارة الطلاب", href: `/school/${normalizedSlug}/students`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'], color: 'text-emerald-400' },
    { icon: Layers, label: "المراحل والصفوف", href: `/school/${normalizedSlug}/classes`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'], color: 'text-indigo-400' },
    { icon: BookOpen, label: "إدارة المواد الدراسية", href: `/school/${normalizedSlug}/subjects`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'], color: 'text-amber-400' },
    { icon: CalendarDays, label: "جداول الحصص", href: `/school/${normalizedSlug}/schedules`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'], color: 'text-rose-400' },
    
    // Financial Links
    ...(role === 'ACCOUNTANT' ? [
      { icon: PieChart, label: "لوحة التحكم المالية", href: `/school/${normalizedSlug}/financial/dashboard`, roles: ['ACCOUNTANT'], color: 'text-cyan-400' },
      { icon: Wallet, label: "رسوم الطلاب", href: `/school/${normalizedSlug}/financial/fees`, roles: ['ACCOUNTANT'], color: 'text-orange-400' },
      { icon: ArrowLeftRight, label: "المصاريف", href: `/school/${normalizedSlug}/financial/expenses`, roles: ['ACCOUNTANT'], color: 'text-red-400' },
    ] : [
      { icon: Wallet, label: "الشؤون المالية", href: `/school/${normalizedSlug}/financial`, roles: ['SCHOOL_ADMIN', 'SUPER_ADMIN'], color: 'text-yellow-400' }
    ]),

    { icon: CalendarDays, label: "إدارة السنوات الدراسية", href: `/school/${normalizedSlug}/academic-years`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'], color: 'text-teal-400' },
    { icon: Archive, label: "الأرشيف", href: `/school/${normalizedSlug}/archive`, roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'], color: 'text-slate-400' },
    { icon: FileText, label: "الاشتراك والفوترة", href: `/school/${normalizedSlug}/subscription`, roles: ['SCHOOL_ADMIN', 'SUPER_ADMIN'], color: 'text-orange-400' },
    { icon: Settings, label: "الإعدادات العامة", href: `/school/${normalizedSlug}/settings`, roles: ['SCHOOL_ADMIN', 'SUPER_ADMIN'], color: 'text-pink-400' },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  const roleLabels = {
    SCHOOL_ADMIN: "مدير المدرسة",
    ASSISTANT: "معاون المدرسة",
    ACCOUNTANT: "المحاسب",
    TEACHER: "معلم",
    SUPER_ADMIN: "مدير عام"
  };

  // Use default mockup if not mounted to match server state and avoid hydration mismatch
  const displayUser = mounted ? {
    name: actualUser?.firstName ? `${actualUser.firstName} ${actualUser.lastName || ''}`.trim() : "المستخدم",
    email: actualUser?.email || "user@school.com",
    schoolLogo: actualUser?.schoolLogo || null,
    roleLabel: roleLabels[role] || "موظف"
  } : {
    name: "جاري التحميل...",
    email: "...",
    schoolLogo: null,
    roleLabel: "..."
  };

  return (
    <aside className="w-72 bg-[#1e293b] flex flex-col h-full lg:rounded-l-none overflow-hidden p-8 border-l border-slate-700 hidden lg:flex shadow-2xl z-20">
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
        <p className="text-blue-400 font-bold text-xs bg-blue-500/10 px-3 py-1 rounded-full">{displayUser.roleLabel}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {filteredItems.map((item, index) => (
          <SidebarItem 
            key={index}
            icon={item.icon} 
            label={item.label} 
            href={item.href} 
            isActive={pathname === item.href || (item.href !== `/school/${slug}` && pathname.startsWith(item.href))} 
            iconColor={item.color}
          />
        ))}
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
