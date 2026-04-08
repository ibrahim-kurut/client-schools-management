"use client";
import { Users, GraduationCap, Layers, Wallet } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function StatsGrid() {
  const { user } = useSelector((state) => state.auth);
  const actualUser = user?.userData || user;
  const role = actualUser?.role || 'TEACHER';

  const allStats = [
    { label: "إجمالي الطلاب", value: "1,250", icon: Users, color: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", text: "text-blue-600", roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'ACCOUNTANT', 'SUPER_ADMIN'] },
    { label: "أعضاء كادر تدريسي", value: "84", icon: GraduationCap, color: "from-emerald-400 to-teal-500", bgLight: "bg-emerald-50", text: "text-emerald-600", roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] },
    { label: "الصفوف الدراسية", value: "32", icon: Layers, color: "from-amber-400 to-orange-500", bgLight: "bg-amber-50", text: "text-amber-600", roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] },
    { label: "الإيرادات الإجمالية", value: "12,400 $", icon: Wallet, color: "from-purple-500 to-pink-600", bgLight: "bg-purple-50", text: "text-purple-600", roles: ['SCHOOL_ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'] },
  ];

  const stats = allStats.filter(stat => stat.roles.includes(role));

  return (
    <section className={`grid grid-cols-1 md:grid-cols-2 ${stats.length === 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            {/* Icon Box */}
            <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} flex items-center justify-center ${stat.text} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            
            {/* Value and Label */}
            <div>
              <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</div>
              <div className="text-slate-400 font-bold text-sm mt-1">{stat.label}</div>
            </div>

            {/* Sub-stat / Indiciator (Optionally similar to the "i" in the image) */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
               <span className="text-emerald-500 text-xs font-bold">+12% من الشهر الماضي</span>
               <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 text-[10px] cursor-help">i</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
