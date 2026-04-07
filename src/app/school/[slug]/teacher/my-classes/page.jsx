"use client";
import { useState } from "react";
import { teacherClasses } from "@/data/teacherMockData";
import { Users, Search, Phone, ChevronDown, ChevronUp, Layers, BookOpen, User2 } from "lucide-react";

const classColors = [
  { gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", shadow: "shadow-indigo-200/50", light: "bg-indigo-500" },
  { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", shadow: "shadow-emerald-200/50", light: "bg-emerald-500" },
  { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", shadow: "shadow-violet-200/50", light: "bg-violet-500" },
];

export default function MyClassesPage() {
  const [expandedClass, setExpandedClass] = useState(teacherClasses[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleClass = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">فصولي وطلابي</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            {teacherClasses.length} فصول · {teacherClasses.reduce((sum, c) => sum + c.studentsCount, 0)} طالب
          </p>
        </div>

        {/* Search */}
        <div className="relative group w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="ابحث عن طالب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-5">
        {teacherClasses.map((cls, i) => {
          const color = classColors[i % classColors.length];
          const isExpanded = expandedClass === cls.id;
          const filteredStudents = cls.students.filter((s) =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div
              key={cls.id}
              className={`bg-white rounded-2xl border ${isExpanded ? 'border-slate-200 shadow-lg' : 'border-slate-100'} overflow-hidden transition-all duration-300`}
            >
              {/* Class Header */}
              <button
                onClick={() => toggleClass(cls.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg ${color.shadow}`}>
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-black text-slate-800 text-lg">{cls.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {cls.studentsCount} طالب
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        {cls.subjects.map((s) => s.name).join("، ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown className={`w-4 h-4 ${color.text}`} />
                </div>
              </button>

              {/* Students Table */}
              {isExpanded && (
                <div className="border-t border-slate-100 animate-fadeIn">
                  {/* Subjects Tags */}
                  <div className="flex items-center gap-2 px-5 pt-4 pb-2 flex-wrap">
                    {cls.subjects.map((sub) => (
                      <span key={sub.id} className={`${color.bg} ${color.text} px-3 py-1 rounded-lg text-xs font-black`}>
                        {sub.name}
                      </span>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-right px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">#</th>
                          <th className="text-right px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">الاسم الكامل</th>
                          <th className="text-right px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">الجنس</th>
                          <th className="text-right px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider">رقم الهاتف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-8 text-sm font-bold text-slate-400">
                              لا يوجد طلاب مطابقون للبحث
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student, idx) => (
                            <tr
                              key={student.id}
                              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-5 py-3.5 text-sm font-bold text-slate-400">{idx + 1}</td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg ${student.gender === 'MALE' ? 'bg-blue-50' : 'bg-pink-50'} flex items-center justify-center`}>
                                    <User2 className={`w-4 h-4 ${student.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`} />
                                  </div>
                                  <span className="font-bold text-sm text-slate-700">
                                    {student.firstName} {student.lastName}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-black ${student.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                  {student.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500" dir="ltr">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  {student.phone}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
