"use client";
import TeacherStatsGrid from "@/components/teacher/TeacherStatsGrid";
import TeacherScheduleCard from "@/components/teacher/TeacherScheduleCard";
import TeacherRecentActivity from "@/components/teacher/TeacherRecentActivity";
import { teacherClasses } from "@/data/teacherMockData";
import { Users, ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TeacherDashboard() {
  const params = useParams();
  const slug = params?.slug || '';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">لوحة التحكم</h1>
        <p className="text-sm font-bold text-slate-400 mt-1">نظرة عامة على بياناتك الأكاديمية</p>
      </div>

      {/* Stats Grid */}
      <TeacherStatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Schedule + Quick Access Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {teacherClasses.map((cls, i) => {
              const colors = [
                { gradient: "from-indigo-500 to-blue-600", shadow: "shadow-indigo-200/50", bg: "bg-indigo-50", text: "text-indigo-600" },
                { gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-200/50", bg: "bg-emerald-50", text: "text-emerald-600" },
                { gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-200/50", bg: "bg-violet-50", text: "text-violet-600" },
              ];
              const color = colors[i % colors.length];

              return (
                <Link
                  key={cls.id}
                  href={`/school/${slug}/teacher/my-classes`}
                  className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center mb-4 shadow-lg ${color.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mb-1">{cls.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`${color.bg} px-2 py-0.5 rounded-md`}>
                      <span className={`text-xs font-black ${color.text}`}>{cls.studentsCount} طالب</span>
                    </div>
                    <div className={`${color.bg} px-2 py-0.5 rounded-md`}>
                      <span className={`text-xs font-black ${color.text}`}>{cls.subjectsCount} مادة</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <span>عرض التفاصيل</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Recent Activity */}
          <TeacherRecentActivity />
        </div>

        {/* Right: Schedule Card */}
        <div className="space-y-6">
          <TeacherScheduleCard />
        </div>
      </div>
    </div>
  );
}
