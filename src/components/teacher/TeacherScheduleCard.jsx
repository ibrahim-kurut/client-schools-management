"use client";
import { BookOpen } from "lucide-react";

const subjectColors = [
  { gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
  { gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
];

export default function TeacherScheduleCard({ subjects }) {
  // Use real subjects from DB. If undefined (still loading in parent), show nothing 
  // until data arrives. If [], show empty state.
  const displaySubjects = subjects || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">موادي الدراسية</h3>
            <p className="text-xs font-bold text-slate-400">{displaySubjects.length} مواد مسجلة</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {displaySubjects.length === 0 ? (
            <div className="text-center py-10 px-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-sm">لا توجد مواد مسجلة في جدولك حالياً</p>
            </div>
        ) : (
            displaySubjects.map((subject, i) => {
              const color = subjectColors[i % subjectColors.length];
              return (
                <div
                  key={subject.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${color.border} hover:shadow-md transition-all duration-300 group cursor-default`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <BookOpen className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{subject.name}</h4>
                      <p className="text-xs font-semibold text-slate-400">{subject.class?.name || "فصل غير معين"}</p>
                    </div>
                  </div>
                  <div className={`${color.bg} px-3 py-1.5 rounded-lg hidden sm:block`}>
                    <span className={`text-xs font-black ${color.text}`}>{subject.class?.name || "—"}</span>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
