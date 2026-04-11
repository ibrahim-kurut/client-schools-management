"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";

export default function StudentSchedulePage() {
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  
  // Weekly Schedule Mock Data
  const schedule = {
    "الأحد": [
      { id: 1, subject: "الرياضيات", teacher: "أ. أحمد محمد", time: "08:00 - 08:45", room: "قاعة 101", color: "emerald" },
      { id: 2, subject: "اللغة العربية", teacher: "أ. خالد النجار", time: "08:50 - 09:35", room: "قاعة 101", color: "blue" },
      { id: 3, subject: "استراحة", type: "break", time: "09:35 - 10:00" },
      { id: 4, subject: "العلوم", teacher: "أ. محمود رجب", time: "10:00 - 10:45", room: "مختبر العلوم", color: "indigo" },
      { id: 5, subject: "اللغة الإنجليزية", teacher: "أ. ياسر أمين", time: "10:50 - 11:35", room: "قاعة 101", color: "amber" },
    ],
    "الإثنين": [
      { id: 1, subject: "التاريخ", teacher: "أ. سعد علي", time: "08:00 - 08:45", room: "قاعة 101", color: "rose" },
      { id: 2, subject: "الفيزياء", teacher: "أ. سعيد عمر", time: "08:50 - 09:35", room: "مختبر الفيزياء", color: "teal" },
      { id: 3, subject: "استراحة", type: "break", time: "09:35 - 10:00" },
      { id: 4, subject: "الرياضيات", teacher: "أ. أحمد محمد", time: "10:00 - 10:45", room: "قاعة 101", color: "emerald" },
      { id: 5, subject: "التربية الإسلامية", teacher: "أ. عمر حسن", time: "10:50 - 11:35", room: "قاعة 101", color: "slate" },
    ],
    "الثلاثاء": [
      { id: 1, subject: "اللغة العربية", teacher: "أ. خالد النجار", time: "08:00 - 08:45", room: "قاعة 101", color: "blue" },
      { id: 2, subject: "اللغة الإنجليزية", teacher: "أ. ياسر أمين", time: "08:50 - 09:35", room: "قاعة 101", color: "amber" },
      { id: 3, subject: "استراحة", type: "break", time: "09:35 - 10:00" },
      { id: 4, subject: "الرياضيات", teacher: "أ. أحمد محمد", time: "10:00 - 10:45", room: "قاعة 101", color: "emerald" },
      { id: 5, subject: "الحاسوب", teacher: "أ. رامي جمال", time: "10:50 - 11:35", room: "معمل الحاسوب", color: "purple" },
    ],
    "الأربعاء": [
      { id: 1, subject: "الجغرافيا", teacher: "أ. سعد علي", time: "08:00 - 08:45", room: "قاعة 101", color: "orange" },
      { id: 2, subject: "العلوم", teacher: "أ. محمود رجب", time: "08:50 - 09:35", room: "مختبر العلوم", color: "indigo" },
      { id: 3, subject: "استراحة", type: "break", time: "09:35 - 10:00" },
      { id: 4, subject: "اللغة العربية", teacher: "أ. خالد النجار", time: "10:00 - 10:45", room: "قاعة 101", color: "blue" },
      { id: 5, subject: "الرياضيات", teacher: "أ. أحمد محمد", time: "10:50 - 11:35", room: "قاعة 101", color: "emerald" },
    ],
    "الخميس": [
      { id: 1, subject: "التربية الرياضية", teacher: "أ. كريم محمد", time: "08:00 - 08:45", room: "الملعب", color: "cyan" },
      { id: 2, subject: "اللغة الإنجليزية", teacher: "أ. ياسر أمين", time: "08:50 - 09:35", room: "قاعة 101", color: "amber" },
      { id: 3, subject: "استراحة", type: "break", time: "09:35 - 10:00" },
      { id: 4, subject: "العلوم", teacher: "أ. محمود رجب", time: "10:00 - 10:45", room: "مختبر العلوم", color: "indigo" },
      { id: 5, subject: "النشاط الحر", teacher: "موجهي الأنشطة", time: "10:50 - 11:35", room: "المكتبة", color: "pink" },
    ],
  };

  const currentDayStr = "الأحد"; // Mock current day

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
            <CalendarDays className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">الجدول الدراسي الثابت</h1>
            <p className="text-sm font-semibold text-slate-400">تابع مواعيد حصصك الأسبوعية والقاعات</p>
          </div>
        </div>
      </div>

      {/* Grid Schedule List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {days.map((day) => {
          const isToday = day === currentDayStr;
          
          return (
            <div key={day} className={`flex flex-col rounded-3xl overflow-hidden border ${isToday ? 'border-blue-200 shadow-lg shadow-blue-500/10' : 'border-slate-100 shadow-sm'}`}>
              <div className={`p-4 text-center ${isToday ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-slate-50 text-slate-700'}`}>
                <h3 className="text-lg font-black">{day}</h3>
                {isToday && <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">اليوم</span>}
              </div>
              
              <div className="p-3 bg-white flex-1 flex flex-col gap-3">
                {schedule[day].map((session, idx) => {
                  if (session.type === 'break') {
                    return (
                      <div key={idx} className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-black text-amber-600">استراحة</span>
                        <div className="text-[10px] font-semibold text-amber-500/70 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {session.time}
                        </div>
                      </div>
                    );
                  }

                  const colors = {
                    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
                    blue: "bg-blue-50 border-blue-100 text-blue-700",
                    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
                    amber: "bg-amber-50 border-amber-100 text-amber-700",
                    rose: "bg-rose-50 border-rose-100 text-rose-700",
                    teal: "bg-teal-50 border-teal-100 text-teal-700",
                    slate: "bg-slate-50 border-slate-100 text-slate-700",
                    purple: "bg-purple-50 border-purple-100 text-purple-700",
                    orange: "bg-orange-50 border-orange-100 text-orange-700",
                    cyan: "bg-cyan-50 border-cyan-100 text-cyan-700",
                    pink: "bg-pink-50 border-pink-100 text-pink-700",
                  };
                  
                  const bgClass = colors[session.color] || colors.slate;

                  return (
                    <div key={idx} className={`rounded-xl p-3 border ${bgClass} transition-transform hover:-translate-y-1 duration-300 relative group`}>
                      <div className="font-black text-sm mb-1">{session.subject}</div>
                      <div className="text-[11px] font-bold opacity-80 mb-2 truncate" title={session.teacher}>
                        {session.teacher}
                      </div>

                      <div className="flex flex-col gap-1.5 mt-auto border-t border-black/5 pt-2">
                         <div className="flex items-center gap-1.5 text-[10px] font-semibold opacity-70">
                            <Clock className="w-3 h-3" />
                            {session.time}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] font-semibold opacity-70">
                            <MapPin className="w-3 h-3" />
                            {session.room}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
