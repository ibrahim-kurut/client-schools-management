"use client";
import { useState, useCallback } from "react";
import { teacherClasses, teacherSubjects, examTypes, existingGrades } from "@/data/teacherMockData";
import { ClipboardList, Save, CheckCircle2, AlertCircle, BookOpen, Layers, FileText, User2 } from "lucide-react";
import Swal from "sweetalert2";

export default function GradesPage() {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [grades, setGrades] = useState({});
  const [saved, setSaved] = useState(false);

  // Get available subjects for selected class
  const availableSubjects = selectedClassId
    ? teacherSubjects.filter((s) => s.classId === selectedClassId)
    : [];

  // Get students for selected class
  const selectedClass = teacherClasses.find((c) => c.id === selectedClassId);
  const students = selectedClass?.students || [];

  // Load existing grades when selections change
  const handleSelectionChange = useCallback(
    (classId, subjectId, examType) => {
      if (classId && subjectId && examType) {
        const cls = teacherClasses.find((c) => c.id === classId);
        if (cls) {
          const newGrades = {};
          cls.students.forEach((student) => {
            const existing = existingGrades.find(
              (g) => g.studentId === student.id && g.subjectId === subjectId && g.examType === examType
            );
            if (existing) {
              newGrades[student.id] = existing.score;
            }
          });
          setGrades(newGrades);
        }
      } else {
        setGrades({});
      }
      setSaved(false);
    },
    []
  );

  const handleClassChange = (e) => {
    const val = e.target.value;
    setSelectedClassId(val);
    setSelectedSubjectId("");
    setSelectedExamType("");
    handleSelectionChange(val, "", "");
  };

  const handleSubjectChange = (e) => {
    const val = e.target.value;
    setSelectedSubjectId(val);
    handleSelectionChange(selectedClassId, val, selectedExamType);
  };

  const handleExamTypeChange = (e) => {
    const val = e.target.value;
    setSelectedExamType(val);
    handleSelectionChange(selectedClassId, selectedSubjectId, val);
  };

  const handleGradeChange = (studentId, value) => {
    const numValue = value === "" ? "" : Math.min(100, Math.max(0, Number(value)));
    setGrades((prev) => ({ ...prev, [studentId]: numValue }));
    setSaved(false);
  };

  const handleSave = () => {
    const filledGrades = Object.entries(grades).filter(([_, v]) => v !== "" && v !== undefined);
    if (filledGrades.length === 0) {
      Swal.fire({
        title: "لا توجد درجات!",
        text: "يرجى إدخال درجة واحدة على الأقل قبل الحفظ.",
        icon: "warning",
        confirmButtonText: "حسناً",
        confirmButtonColor: "#4f46e5",
        customClass: {
          popup: "rounded-[32px] font-sans rtl",
          confirmButton: "rounded-2xl px-8 py-3 font-black text-sm",
        },
      });
      return;
    }

    Swal.fire({
      title: "تم الحفظ بنجاح!",
      text: `تم حفظ ${filledGrades.length} درجة.`,
      icon: "success",
      confirmButtonText: "ممتاز",
      confirmButtonColor: "#4f46e5",
      customClass: {
        popup: "rounded-[32px] font-sans rtl",
        confirmButton: "rounded-2xl px-8 py-3 font-black text-sm",
      },
    });
    setSaved(true);
  };

  const allSelected = selectedClassId && selectedSubjectId && selectedExamType;

  const getScoreColor = (score) => {
    if (score === "" || score === undefined) return "";
    if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-300";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-300";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-300";
    return "text-red-600 bg-red-50 border-red-300";
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">رصد الدرجات</h1>
        <p className="text-sm font-bold text-slate-400 mt-1">اختر الفصل والمادة ونوع الامتحان ثم أدخل الدرجات</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Class Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              الفصل الدراسي
            </label>
            <select
              value={selectedClassId}
              onChange={handleClassChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none cursor-pointer"
            >
              <option value="">اختر الفصل...</option>
              {teacherClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              المادة الدراسية
            </label>
            <select
              value={selectedSubjectId}
              onChange={handleSubjectChange}
              disabled={!selectedClassId}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">اختر المادة...</option>
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Exam Type Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <FileText className="w-4 h-4 text-amber-500" />
              نوع الامتحان
            </label>
            <select
              value={selectedExamType}
              onChange={handleExamTypeChange}
              disabled={!selectedSubjectId}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">اختر نوع الامتحان...</option>
              {examTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      {allSelected ? (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">
                  {selectedClass?.name} — {teacherSubjects.find((s) => s.id === selectedSubjectId)?.name}
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {examTypes.find((t) => t.value === selectedExamType)?.label} · {students.length} طالب
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${
                saved
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  تم الحفظ
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ الدرجات
                </>
              )}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider w-12">#</th>
                  <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider">اسم الطالب</th>
                  <th className="text-right px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider w-32">الجنس</th>
                  <th className="text-center px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider w-40">الدرجة (100)</th>
                  <th className="text-center px-5 py-3.5 text-xs font-black text-slate-400 uppercase tracking-wider w-28">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const score = grades[student.id];
                  const scoreColor = getScoreColor(score);

                  return (
                    <tr key={student.id} className="border-t border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="px-5 py-4 text-sm font-bold text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${student.gender === 'MALE' ? 'bg-blue-50' : 'bg-pink-50'} flex items-center justify-center`}>
                            <User2 className={`w-4 h-4 ${student.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`} />
                          </div>
                          <span className="font-bold text-sm text-slate-700">
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black ${student.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                          {student.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={score ?? ""}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            placeholder="—"
                            className={`w-24 text-center py-2 px-3 rounded-xl border-2 text-sm font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                              scoreColor || "border-slate-200 text-slate-700 bg-white"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {score !== undefined && score !== "" ? (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                            score >= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {score >= 50 ? (
                              <><CheckCircle2 className="w-3 h-3" /> ناجح</>
                            ) : (
                              <><AlertCircle className="w-3 h-3" /> راسب</>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="font-black text-lg text-slate-700 mb-2">اختر البيانات لبدء رصد الدرجات</h3>
          <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">
            قم باختيار الفصل الدراسي والمادة ونوع الامتحان من القوائم أعلاه لعرض جدول الطلاب وإدخال الدرجات.
          </p>
        </div>
      )}
    </div>
  );
}
