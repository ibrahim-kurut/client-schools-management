"use client";
import { UserPlus, Wallet, ArrowLeftRight, BookOpen, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function QuickActions({slug}) {
  const { user } = useSelector((state) => state.auth);
  const actualUser = user?.userData || user;
  const role = actualUser?.role || 'TEACHER';

  const allActions = [
    { title: "إضافة طالب جديد", icon: UserPlus, desc: "تسجيل طالب في النظام الأكاديمي", href: `/school/${slug}/students`, color: "text-blue-600", bg: "bg-blue-50", roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] },
    { title: "سداد دفعة جديدة", icon: Wallet, desc: "تسجيل قسط دراسي لطالب", href: `/school/${slug}/financial/fees`, color: "text-emerald-600", bg: "bg-emerald-50", roles: ['SCHOOL_ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'] },
    { title: "تسجيل مصروف", icon: ArrowLeftRight, desc: "إدارة الرواتب والصيانة والمصروفات", href: `/school/${slug}/financial/expenses`, color: "text-orange-600", bg: "bg-orange-50", roles: ['SCHOOL_ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'] },
    { title: "إدارة الصفوف", icon: BookOpen, desc: "عرض المراحل الأكاديمية والمواد", href: `/school/${slug}/classes`, color: "text-purple-600", bg: "bg-purple-50", roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] },
    { title: "نتائج الطلاب", icon: FileText, desc: "معاينة وطباعة الشهادات والنتائج", href: `/school/${slug}/grades`, color: "text-rose-600", bg: "bg-rose-50", roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] },
    { title: "إدارة السنة الدراسية", icon: Calendar, desc: "إعدادات والمواسم والتقويم للطلاب", href: `/school/${slug}/academic-years`, color: "text-amber-600", bg: "bg-amber-50", roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] },
  ];

  const quickActions = allActions.filter(action => action.roles.includes(role));

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-slate-800">الوصول السريع والإدارة</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-all px-4 py-2 hover:bg-blue-50 rounded-xl">عرض الكل</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, idx) => (
          <Link 
            href={action.href} 
            key={idx} 
            className="group flex flex-col gap-4 p-8 bg-white rounded-[32px] shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-14 h-14 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">{action.title}</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed font-medium">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
