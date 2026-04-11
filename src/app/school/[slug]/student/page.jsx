"use client";

import {
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Award,
  Wallet,
  Megaphone,
  ChevronLeft,
  GraduationCap
} from "lucide-react";

export default function StudentDashboardPage() {
  // Mock Data
  const stats = [
    {
      label: "النسبة العامة",
      value: "92%",
      trend: "+2.5%",
      isPositive: true,
      icon: Award,
      color: "emerald"
    },
    {
      label: "نسبة الحضور",
      value: "96%",
      trend: "-1.0%",
      isPositive: false,
      icon: Clock,
      color: "blue"
    },
    {
      label: "مجموع الرسوم",
      value: "8,500",
      currency: "د.ع",
      status: "مدفوع بالكامل",
      icon: Wallet,
      color: "indigo"
    }
  ];

  const todaySchedule = [
    { time: "08:00 ص", subject: "الرياضيات", teacher: "أ. أحمد محمد", type: "class", status: "مكتمل" },
    { time: "09:00 ص", subject: "العلوم", teacher: "أ. محمود رجب", type: "class", status: "الآن" },
    { time: "10:00 ص", subject: "استراحة", teacher: "", type: "break", status: "قادم" },
    { time: "10:30 ص", subject: "اللغة العربية", teacher: "أ. خالد النجار", type: "class", status: "قادم" },
    { time: "11:30 ص", subject: "التاريخ", teacher: "أ. سعد علي", type: "class", status: "قادم" }
  ];

  const recentGrades = [
    { subject: "العلوم", exam: "امتحان نصف الفصل", score: 45, total: 50, date: "10 أبريل 2026" },
    { subject: "الرياضيات", exam: "اختبار قصير", score: 18, total: 20, date: "08 أبريل 2026" },
    { subject: "اللغة الإنجليزية", exam: "تعبير كتابي", score: 28, total: 30, date: "05 أبريل 2026" }
  ];

  const announcements = [
    { title: "رحلة مدرسية", content: "سجل الآن في رحلة معرض الكتاب القادمة يوم الخميس.", date: "11 أبريل", type: "info" },
    { title: "تأجيل اختبار التاريخ", content: "تم تأجيل اختبار التاريخ إلى الأسبوع القادم بسبب ضيق الوقت.", date: "09 أبريل", type: "warning" }
  ];

  const attendanceData = {
    present: 42,
    absent: 2,
    late: 1,
    total: 45
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Prompt */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black mb-2 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 opacity-80" />
              مرحباً بك مجدداً في لوحتك التعليمية!
            </h1>
            <p className="text-emerald-50 text-sm lg:text-base font-semibold">
              هنا تجد ملخصاً لكل معلوماتك الأكاديمية والمالية. انطلق بثقة نحو التفوق.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 flex items-center gap-4">
            <div className="text-right">
              <div className="text-emerald-50 text-xs font-bold mb-1">التقييم المستمر</div>
              <div className="text-xl font-black tracking-tight">امتياز</div>
            </div>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorStyles = {
            emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
            blue: "bg-blue-50 text-blue-600 border-blue-100",
            indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
          }[stat.color];

          return (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl border ${colorStyles} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.trend && (
                  <span className={`text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="text-slate-500 text-sm font-bold mb-1">{stat.label}</div>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</span>
                {stat.currency && <span className="text-sm font-bold text-slate-500 mb-1">{stat.currency}</span>}
              </div>
              {stat.status && (
                <div className="mt-3 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {stat.status}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                جدول اليوم
              </h2>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                الجدول الكامل <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {todaySchedule.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border ${item.status === 'الآن' ? 'bg-emerald-50 border-emerald-200 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`shrink-0 w-20 text-center text-sm font-black ${item.status === 'الآن' ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {item.time}
                  </div>
                  
                  <div className={`w-1 h-12 rounded-full ${item.type === 'break' ? 'bg-amber-400' : (item.status === 'الآن' ? 'bg-emerald-500' : 'bg-slate-300')}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-black truncate ${item.status === 'الآن' ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {item.subject}
                    </h3>
                    <p className={`text-xs font-semibold truncate ${item.status === 'الآن' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {item.teacher || "استراحة قصيرة"}
                    </p>
                  </div>

                  <div className="hidden sm:block shrink-0">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full ${
                      item.status === 'مكتمل' ? 'bg-slate-200 text-slate-600' :
                      item.status === 'الآن' ? 'bg-emerald-500 text-white animate-pulse' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right/Side Column */}
        <div className="flex flex-col gap-6">
          {/* Announcements */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                إعلانات المدرسة
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {announcements.map((ann, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${ann.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <h3 className="font-bold text-sm text-slate-800">{ann.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 mr-auto">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium pl-4 border-r-2 border-transparent group-hover:border-slate-200 transition-colors">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 p-3 rounded-xl border border-slate-200 border-dashed text-slate-500 text-sm font-bold hover:bg-slate-50 hover:text-slate-700 transition-colors">
              عرض المزيد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
