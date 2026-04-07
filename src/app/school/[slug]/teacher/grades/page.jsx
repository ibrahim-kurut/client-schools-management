"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherStudents } from "@/redux/slices/teacherProfileSlice";
import { fetchClassGrades, addGrade, updateGrade, deleteGrade } from "@/redux/slices/teacherGradesSlice";
import { examTypes } from "@/data/teacherMockData";
import { ClipboardList, PlusCircle, Save, Trash2, Edit2, AlertCircle, BookOpen, Layers, FileText, User2 } from "lucide-react";
import Swal from "sweetalert2";

export default function GradesPage() {
  const dispatch = useDispatch();
  const { classes, loading: profileLoading } = useSelector((state) => state.teacherProfile);
  const { grades, loading: gradesLoading, actionLoading } = useSelector((state) => state.teacherGrades);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    dispatch(fetchTeacherStudents());
  }, [dispatch]);

  const handleSelectionChange = useCallback((classId, subjectId, examType) => {
    if (classId && subjectId && examType) {
      dispatch(fetchClassGrades({ classId }));
    }
    // Clear drafts when changing filters
    setDrafts({});
  }, [dispatch]);

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

  // Extract selected class details
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const students = [...(selectedClass?.students || [])].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`;
    const nameB = `${b.firstName} ${b.lastName}`;
    return nameA.localeCompare(nameB, 'ar');
  });

  const availableSubjects = selectedClass?.subjects || [];

  const allSelected = selectedClassId && selectedSubjectId && selectedExamType;

  // Sync Drafts
  const handleDraftChange = (studentId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  // CRUD Actions
  const handleAdd = async (studentId) => {
    const draft = drafts[studentId];
    if (!draft || (draft.score === "" && !draft.notes)) {
      Swal.fire({ icon: "error", title: "خطأ", text: "قم بإدخال درجة أو ملاحظة (مؤجل/غائب) أولاً" });
      return;
    }

    const payload = {
      studentId,
      subjectId: selectedSubjectId,
      academicYearId: selectedClass.academicYearId || classes[0]?.academicYearId, // Assuming passed academic year or we rely on backend default if optional
      examType: selectedExamType,
      score: draft.score !== "" && draft.score !== undefined ? Number(draft.score) : null,
      notes: draft.notes || "",
    };

    const action = await dispatch(addGrade(payload));
    if (addGrade.fulfilled.match(action)) {
      Swal.fire({ icon: "success", title: "تم الإضافة", toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      setDrafts((prev) => { const newDrafts = { ...prev }; delete newDrafts[studentId]; return newDrafts; });
    } else {
      Swal.fire({ icon: "error", title: "خطأ", text: action.payload || "حدث خطأ أثناء الإضافة" });
    }
  };

  const handleUpdate = async (studentId, gradeId) => {
    const draft = drafts[studentId];
    if (!draft) return;
    
    const payload = {
      studentId,
      gradeData: {
        gradeId,
        examType: selectedExamType,
        score: draft.score !== "" && draft.score !== undefined ? Number(draft.score) : null,
        notes: draft.notes || "",
      }
    };

    const action = await dispatch(updateGrade(payload));
    if (updateGrade.fulfilled.match(action)) {
      Swal.fire({ icon: "success", title: "تم التعديل", toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      setDrafts((prev) => { const newDrafts = { ...prev }; delete newDrafts[studentId]; return newDrafts; });
    } else {
      Swal.fire({ icon: "error", title: "خطأ", text: action.payload || "حدث خطأ أثناء التعديل" });
    }
  };

  const handleDelete = async (gradeId) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف الدرجة نهائياً من سجل الطالب!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      const action = await dispatch(deleteGrade(gradeId));
      if (deleteGrade.fulfilled.match(action)) {
         Swal.fire({ icon: "success", title: "تم الحذف", toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      } else {
         Swal.fire({ icon: "error", title: "خطأ", text: action.payload || "حدث خطأ أثناء الحذف" });
      }
    }
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined || score === "") return "";
    if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-300";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-300";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-300";
    return "text-red-600 bg-red-50 border-red-300";
  };

  if (profileLoading) {
    return <div className="flex items-center justify-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">رصد الدرجات</h1>
        <p className="text-sm font-bold text-slate-400 mt-1">اختر الفصل والمادة ونوع الامتحان ثم أدخل الدرجات</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              الفصل الدراسي
            </label>
            <select
              value={selectedClassId}
              onChange={handleClassChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer"
            >
              <option value="">اختر الفصل...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              المادة الدراسية
            </label>
            <select
              value={selectedSubjectId}
              onChange={handleSubjectChange}
              disabled={!selectedClassId}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">اختر المادة...</option>
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
              <FileText className="w-4 h-4 text-amber-500" />
              نوع الامتحان
            </label>
            <select
              value={selectedExamType}
              onChange={handleExamTypeChange}
              disabled={!selectedSubjectId}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">
                  {selectedClass?.name} — {availableSubjects.find((s) => s.id === selectedSubjectId)?.name}
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {examTypes.find((t) => t.value === selectedExamType)?.label} · {students.length} طالب
                </p>
              </div>
            </div>
          </div>

          {gradesLoading ? (
            <div className="p-10 text-center text-slate-400 font-bold">جاري تحميل الدرجات...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-slate-100/80">
                    <th className="text-right px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider w-12">#</th>
                    <th className="text-right px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">اسم الطالب</th>
                    <th className="text-center px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider w-32">الدرجة (100)</th>
                    <th className="text-center px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider w-40">ملاحظة (غياب/مؤجل)</th>
                    <th className="text-center px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider w-40">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const existingGrade = grades.find(g => 
                      g.studentId === student.id && 
                      g.subject.id === selectedSubjectId && 
                      g.examType === selectedExamType
                    );
                    
                    const draft = drafts[student.id] || {};
                    const currentScore = draft.score !== undefined ? draft.score : (existingGrade?.score ?? "");
                    const currentNotes = draft.notes !== undefined ? draft.notes : (existingGrade?.notes ?? "");
                    
                    const scoreColor = getScoreColor(currentScore);
                    const isDraftDirty = draft.score !== undefined || draft.notes !== undefined;

                    return (
                      <tr key={student.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
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
                          <div className="flex justify-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={currentScore}
                              onChange={(e) => handleDraftChange(student.id, 'score', e.target.value)}
                              placeholder="—"
                              className={`w-20 text-center py-2 px-2 rounded-xl border-2 text-sm font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                                scoreColor || "border-slate-200 text-slate-700 bg-white"
                              }`}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center">
                             <input
                              type="text"
                              value={currentNotes}
                              onChange={(e) => handleDraftChange(student.id, 'notes', e.target.value)}
                              placeholder="مثال: مؤجل"
                              className="w-full min-w-[100px] text-center py-2 px-3 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                             {!existingGrade ? (
                               <button 
                                  onClick={() => handleAdd(student.id)}
                                  disabled={actionLoading}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-black transition-colors disabled:opacity-50"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" /> حفظ
                               </button>
                             ) : (
                               <>
                                 <button
                                    onClick={() => handleUpdate(student.id, existingGrade.id)}
                                    disabled={!isDraftDirty || actionLoading}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                                      isDraftDirty 
                                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                      : "bg-slate-50 text-slate-400 cursor-not-allowed"
                                    }`}
                                 >
                                    <Edit2 className="w-3.5 h-3.5" /> تعديل
                                 </button>
                                 <button
                                    onClick={() => handleDelete(existingGrade.id)}
                                    disabled={actionLoading}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-black transition-colors disabled:opacity-50"
                                 >
                                    <Trash2 className="w-3.5 h-3.5" /> حذف
                                 </button>
                               </>
                             )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="font-black text-lg text-slate-700 mb-2">اختر البيانات لبدء رصد الدرجات</h3>
          <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">
            قم باختيار الفصل الدراسي والمادة ونوع الامتحان من القوائم أعلاه لعرض جدول الطلاب وإدخال أو تعديل الدرجات بشكل مباشر.
          </p>
        </div>
      )}
    </div>
  );
}
