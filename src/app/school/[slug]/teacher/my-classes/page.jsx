"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherStudents } from "@/redux/slices/teacherProfileSlice";
import { fetchClassGrades } from "@/redux/slices/teacherGradesSlice";
import { examTypes } from "@/data/teacherMockData";
import { Users, Search, Phone, ChevronDown, Layers, BookOpen, User2, Trophy } from "lucide-react";
import StudentResultModal from "@/components/students/StudentResultModal";

const classColors = [
  { gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", shadow: "shadow-indigo-200/50", light: "bg-indigo-500" },
  { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", shadow: "shadow-emerald-200/50", light: "bg-emerald-500" },
  { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", shadow: "shadow-violet-200/50", light: "bg-violet-500" },
];

export default function MyClassesPage() {
  const dispatch = useDispatch();
  const { classes, loading: profileLoading } = useSelector((state) => state.teacherProfile);
  const { grades, loading: gradesLoading } = useSelector((state) => state.teacherGrades);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [expandedClass, setExpandedClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchTeacherStudents());
  }, [dispatch]);

  // Set first class as expanded by default once loaded
  useEffect(() => {
    if (classes.length > 0 && expandedClass === null) {
      setExpandedClass(classes[0].id);
      dispatch(fetchClassGrades({ classId: classes[0].id }));
    }
  }, [classes, expandedClass, dispatch]);

  const toggleClass = (classId) => {
    const isExpanding = expandedClass !== classId;
    setExpandedClass(isExpanding ? classId : null);
    if (isExpanding) {
      dispatch(fetchClassGrades({ classId }));
    }
  };

  const totalStudents = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);

  if (profileLoading && classes.length === 0) {
    return <div className="flex items-center justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">فصولي وطلابي</h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            {classes.length} فصول · {totalStudents} طالب
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
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-bold"
          />
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-5">
        {classes.length === 0 && !profileLoading && (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
             <Layers className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold">لا توجد فصول دراسية مرتبطة بك حالياً.</p>
          </div>
        )}

        {classes.map((cls, i) => {
          const color = classColors[i % classColors.length];
          const isExpanded = expandedClass === cls.id;
          const filteredStudents = (cls.students || [])
            .filter((s) =>
              `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
              const nameA = `${a.firstName} ${a.lastName}`;
              const nameB = `${b.firstName} ${b.lastName}`;
              return nameA.localeCompare(nameB, 'ar');
            });

          return (
            <div
              key={cls.id}
              className={`bg-white rounded-2xl border ${isExpanded ? 'border-slate-200 shadow-xl shadow-slate-200/40' : 'border-slate-100'} overflow-hidden transition-all duration-300`}
            >
              {/* Class Header */}
              <button
                onClick={() => toggleClass(cls.id)}
                className={`w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors ${isExpanded ? 'bg-slate-50/30' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg ${color.shadow}`}>
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-black text-slate-800 text-lg">{cls.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="flex items-center gap-1 font-bold text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        {cls.students?.length || 0} طالب
                      </span>
                      <span className="flex items-center gap-1 font-bold text-slate-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        {cls.subjects?.map((s) => s.name).join("، ")}
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
                    {(cls.subjects || []).map((sub, j) => (
                      <span key={j} className={`${color.bg} ${color.text} px-3 py-1 rounded-lg text-xs font-black`}>
                        {sub.name}
                      </span>
                    ))}
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100 text-right">
                          <th className="w-16 px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider text-center">#</th>
                          <th className="px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider text-right">اسم الطالب</th>
                          <th className="px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider text-center">الجنس</th>
                          <th className="px-5 py-3 text-xs font-black text-slate-400 uppercase tracking-wider text-center">رقم الهاتف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-10 text-sm font-bold text-slate-300">
                               {searchQuery ? "لم يتم العثور على نتائج" : "لا يوجد طلاب في هذا الفصل"}
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student, idx) => (
                            <tr
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                            >
                              <td className="px-5 py-4 text-sm font-bold text-slate-400 text-center">{idx + 1}</td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg ${student.gender === 'MALE' ? 'bg-blue-50' : 'bg-pink-50'} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <User2 className={`w-4 h-4 ${student.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`} />
                                  </div>
                                  <span className="font-bold text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">
                                    {student.firstName} {student.lastName}
                                  </span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black ${student.gender === 'MALE' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-pink-50 text-pink-600 border border-pink-100'}`}>
                                  {student.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-500" dir="ltr">
                                  {student.phone || "—"}
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

      {selectedStudent && (
        <StudentResultModal
          student={selectedStudent}
          studentGrades={grades.filter((g) => g.studentId === selectedStudent?.id)}
          subjects={classes.find(c => c.id === expandedClass)?.subjects || []}
          examTypes={examTypes}
          schoolName={currentUser?.school?.name || 'مدرستي'}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
