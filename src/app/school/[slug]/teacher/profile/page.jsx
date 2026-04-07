"use client";
import { teacherProfile, teacherSubjects, salaryHistory, teacherStats } from "@/data/teacherMockData";
import { User2, Mail, Phone, Calendar, BookOpen, Banknote, GraduationCap, Layers, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">الملف الشخصي</h1>
        <p className="text-sm font-bold text-slate-400 mt-1">معلوماتك الشخصية وسجل الرواتب</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Banner */}
            <div className="h-28 bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-600 relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center -mt-12 pb-6 px-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-xl shadow-indigo-200/50 border-4 border-white">
                <User2 className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-xl font-black text-slate-800 mt-4">
                {teacherProfile.firstName} {teacherProfile.lastName}
              </h2>

              <div className="inline-flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full mt-2">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-black text-indigo-600">معلم</span>
              </div>

              <p className="text-sm font-bold text-slate-400 mt-2">{teacherProfile.schoolName}</p>
            </div>

            {/* Info List */}
            <div className="border-t border-slate-100 px-6 py-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">البريد الإلكتروني</p>
                  <p className="text-sm font-bold text-slate-700" dir="ltr">{teacherProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">رقم الهاتف</p>
                  <p className="text-sm font-bold text-slate-700" dir="ltr">{teacherProfile.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">تاريخ الميلاد</p>
                  <p className="text-sm font-bold text-slate-700">{teacherProfile.birthDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                  <User2 className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">الجنس</p>
                  <p className="text-sm font-bold text-slate-700">{teacherProfile.gender === 'MALE' ? 'ذكر' : 'أنثى'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-black text-slate-700 text-sm mb-4">إحصائيات سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "الفصول", value: teacherStats.totalClasses, icon: Layers, color: "text-indigo-500 bg-indigo-50" },
                { label: "الطلاب", value: teacherStats.totalStudents, icon: User2, color: "text-emerald-500 bg-emerald-50" },
                { label: "المواد", value: teacherStats.totalSubjects, icon: BookOpen, color: "text-violet-500 bg-violet-50" },
                { label: "الدرجات", value: teacherStats.gradesEntered, icon: TrendingUp, color: "text-amber-500 bg-amber-50" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/50">
                    <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800">{stat.value}</p>
                      <p className="text-[10px] font-bold text-slate-400">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Subjects & Salary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subjects */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200/50">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">المواد التي أدرسها</h3>
                <p className="text-xs font-bold text-slate-400">{teacherSubjects.length} مواد</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teacherSubjects.map((subject, i) => {
                const colors = [
                  "from-indigo-500 to-blue-600 shadow-indigo-200/50",
                  "from-emerald-500 to-teal-600 shadow-emerald-200/50",
                  "from-violet-500 to-purple-600 shadow-violet-200/50",
                  "from-amber-500 to-orange-500 shadow-amber-200/50",
                ];
                return (
                  <div key={subject.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center shadow-lg`}>
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{subject.name}</h4>
                      <p className="text-xs font-semibold text-slate-400">{subject.className}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Salary History */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-200/50">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">سجل الرواتب</h3>
                <p className="text-xs font-bold text-slate-400">{salaryHistory.length} دفعات</p>
              </div>
            </div>

            <div className="space-y-3">
              {salaryHistory.map((salary, i) => (
                <div
                  key={salary.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${i === 0 ? 'bg-emerald-50' : 'bg-slate-50'} flex items-center justify-center`}>
                      <Banknote className={`w-5 h-5 ${i === 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-700">{salary.title}</h4>
                      <p className="text-xs font-semibold text-slate-400">{salary.date}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`text-base font-black ${i === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {salary.amount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-400 mr-1">د.ع</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-indigo-700">إجمالي الرواتب المستلمة</span>
                <div>
                  <span className="text-xl font-black text-indigo-600">
                    {salaryHistory.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-indigo-400 mr-1">د.ع</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
