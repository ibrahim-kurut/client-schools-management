import { UserPlus, Wallet, ArrowLeftRight, BookOpen, FileText, Calendar } from 'lucide-react';

export default function QuickActions() {
  const quickActions = [
    { title: "إضافة طالب جديد", icon: UserPlus, desc: "تسجيل طالب في النظام الأكاديمي", href: "#", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "سداد دفعة جديدة", icon: Wallet, desc: "تسجيل قسط دراسي لطالب", href: "#", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "تسجيل مصروف", icon: ArrowLeftRight, desc: "إدارة الرواتب والصيانة والمصروفات", href: "#", color: "text-orange-600", bg: "bg-orange-50" },
    { title: "إدارة الصفوف", icon: BookOpen, desc: "عرض المراحل الأكاديمية والمواد", href: "#", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "تحديث الدرجات", icon: FileText, desc: "إدخال نتائج امتحانات الفصل الدراسي", href: "#", color: "text-rose-600", bg: "bg-rose-50" },
    { title: "إدارة السنة الدراسية", icon: Calendar, desc: "إعدادات والمواسم والتقويم للطلاب", href: "#", color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-slate-800">الوصول السريع والإدارة</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-all px-4 py-2 hover:bg-blue-50 rounded-xl">عرض الكل</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, idx) => (
          <a 
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
          </a>
        ))}
      </div>
    </section>
  );
}
