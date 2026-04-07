"use client";
import { Users, BookOpen, Layers, Banknote, TrendingUp, CalendarCheck } from "lucide-react";

export default function TeacherStatsGrid({ statsOverride }) {
  // We use 0 as a default instead of mock data to ensure that 
  // if data is loading or missing from DB, it doesn't show confusing mock values.
  const stats = [
    {
      label: "الفصول الدراسية",
      value: statsOverride?.totalClasses ?? 0,
      icon: Layers,
      gradient: "from-indigo-500 to-blue-600",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      shadowColor: "shadow-indigo-200/50",
    },
    {
      label: "إجمالي الطلاب",
      value: statsOverride?.totalStudents ?? 0,
      suffix: "طالب",
      icon: Users,
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      shadowColor: "shadow-emerald-200/50",
    },
    {
      label: "المواد الدراسية",
      value: statsOverride?.totalSubjects ?? 0,
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-600",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
      shadowColor: "shadow-violet-200/50",
    },
    {
      label: "نسبة الحضور",
      value: `${statsOverride?.attendanceRate ?? 0}%`,
      icon: CalendarCheck,
      gradient: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      shadowColor: "shadow-amber-200/50",
    },
    {
      label: "الدرجات المرصودة",
      value: statsOverride?.gradesEnteredCount ?? 0,
      suffix: "درجة",
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-500",
      bgLight: "bg-cyan-50",
      textColor: "text-cyan-600",
      shadowColor: "shadow-cyan-200/50",
    },
    {
      label: "آخر راتب",
      value: statsOverride?.latestSalary?.toLocaleString() ?? "0",
      suffix: "د.ع",
      icon: Banknote,
      gradient: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600",
      shadowColor: "shadow-rose-200/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`group bg-white rounded-2xl p-5 border border-slate-100 hover:border-transparent transition-all duration-300 hover:shadow-xl ${stat.shadowColor} cursor-default`}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-800">{stat.value}</span>
              {stat.suffix && <span className="text-xs font-bold text-slate-400">{stat.suffix}</span>}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
