"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherStudents } from "@/redux/slices/teacherProfileSlice";
import { fetchClassGrades, addGrade, updateGrade, deleteGrade } from "@/redux/slices/teacherGradesSlice";
import { examTypes } from "@/data/teacherMockData";
import { ClipboardList, PlusCircle, Save, Trash2, Edit2, AlertCircle, BookOpen, Layers, FileText, User2, Printer, CheckCircle2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import StudentResultModal from "@/components/students/StudentResultModal";
import AllStudentsGradesModal from "@/components/students/AllStudentsGradesModal";
import { fetchAcademicYears } from "@/redux/slices/academicYearsSlice";


export default function GradesPage() {
  const dispatch = useDispatch();
  const { classes, loading: profileLoading } = useSelector((state) => state.teacherProfile);
  const { grades, loading: gradesLoading, actionLoading } = useSelector((state) => state.teacherGrades);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { currentYear } = useSelector((state) => state.academicYears);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [drafts, setDrafts] = useState({}); // { [studentId]: { [examType]: score } }
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [showPrintAllModal, setShowPrintAllModal] = useState(false);




  const teacherName = currentUser?.firstName + " " + currentUser?.lastName;

  const FULL_MATRIX_COLUMNS = [
    { value: 'OCTOBER', label: 'تشرين الأول' },
    { value: 'NOVEMBER', label: 'تشرين الثاني' },
    { value: 'DECEMBER', label: 'كانون الأول' },
    { value: 'FIRST_SEMESTER_AVG', label: ' معدل الفصل الاول', isCalculated: true },
    { value: 'MIDYEAR', label: 'نصف السنة' },
    { value: 'MARCH', label: 'آذار' },
    { value: 'APRIL', label: 'نيسان' },
    { value: 'SECOND_SEMESTER_AVG', label: 'معدل الفصل الثاني', isCalculated: true },
    { value: 'ANNUAL_EFFORT', label: 'السعي', isCalculated: true },
    { value: 'FINAL_EXAM', label: 'النهائي' },
    { value: 'FINAL_GRADE', label: 'النتيجة', isCalculated: true },
  ];

  useEffect(() => {
    dispatch(fetchTeacherStudents());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  const handleSelectionChange = useCallback((classId, subjectId) => {
    if (classId && subjectId) {
      const cls = classes.find(c => c.id === classId);
      const academicYearId = cls?.academicYearId || classes[0]?.academicYearId;
      dispatch(fetchClassGrades({ classId, academicYearId, subjectId }));
    }
    setDrafts({});
  }, [dispatch, classes]);

  const handleClassChange = (e) => {
    const val = e.target.value;
    setSelectedClassId(val);
    setSelectedSubjectId("");
    handleSelectionChange(val, "");
  };

  const handleSubjectChange = (e) => {
    const val = e.target.value;
    setSelectedSubjectId(val);
    handleSelectionChange(selectedClassId, val);
  };

  // Extract selected class details
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const students = [...(selectedClass?.students || [])].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`;
    const nameB = `${b.firstName} ${b.lastName}`;
    return nameA.localeCompare(nameB, 'ar');
  });

  const availableSubjects = selectedClass?.subjects || [];
  const allSelected = selectedClassId && selectedSubjectId;

  // Sync Drafts
  const handleDraftChange = (studentId, examType, value) => {
    setDrafts((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examType]: value,
      },
    }));
  };

  // CRUD Actions
  const handleSaveGrade = async (studentId, examType, scoreValue) => {
    const existingGrade = grades.find(g => 
      g.studentId === studentId && 
      g.subject.id === selectedSubjectId && 
      g.examType === examType
    );

    if (scoreValue === "" || scoreValue === null || scoreValue === undefined) return;

    const payload = {
      studentId,
      subjectId: selectedSubjectId,
      academicYearId: selectedClass.academicYearId || classes[0]?.academicYearId,
      examType,
      score: Number(scoreValue),
      notes: "", 
    };

    if (existingGrade) {
      return dispatch(updateGrade({ studentId, gradeData: { gradeId: existingGrade.id, examType, score: Number(scoreValue) } }));
    } else {
      return dispatch(addGrade(payload));
    }
  };

  const handleSaveStudent = async (studentId) => {
    const studentDrafts = drafts[studentId];
    if (!studentDrafts) return;

    for (const [examType, score] of Object.entries(studentDrafts)) {
      await handleSaveGrade(studentId, examType, score);
    }

    setDrafts((prev) => {
      const next = { ...prev };
      delete next[studentId];
      return next;
    });

    Swal.fire({ icon: "success", title: "تم حفظ درجات الطالب", toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
  };

  const handleBulkSave = async () => {
    if (Object.keys(drafts).length === 0) return;
    
    setIsBulkSaving(true);
    try {
      for (const studentId of Object.keys(drafts)) {
        const studentDrafts = drafts[studentId];
        for (const [examType, score] of Object.entries(studentDrafts)) {
          await handleSaveGrade(studentId, examType, score);
        }
      }
      setDrafts({});
      Swal.fire({ icon: "success", title: "تم حفظ جميع الدرجات بنجاح", toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطأ", text: "حدث خطأ أثناء الحفظ الشامل" });
    } finally {
      setIsBulkSaving(false);
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
              <option key="default-class" value="">اختر الفصل...</option>
              {classes.map((cls, idx) => (
                <option key={cls.id || `class-${idx}`} value={cls.id}>{cls.name}</option>
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
              <option key="default-subject" value="">اختر المادة...</option>
              {availableSubjects.map((sub, idx) => (
                <option key={sub.id || `sub-${idx}`} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
             {allSelected && (
               <button
                onClick={handleBulkSave}
                disabled={isBulkSaving || Object.keys(drafts).length === 0}
                className="w-full h-[52px] flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
               >
                 {isBulkSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 حفظ جميع التعديلات
               </button>
             )}
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
                  لوحة الرصد الشاملة · {students.length} طالب
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPrintAllModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 border border-slate-200 text-white hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 rounded-xl transition-all font-black text-sm shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              طباعة درجات جميع الطلاب
            </button>
          </div>

          {gradesLoading ? (
            <div className="p-10 text-center text-slate-400 font-bold">جاري تحميل الدرجات...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b border-slate-100/80">
                    <th className="text-right px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider w-12">#</th>
                    <th className="text-right px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider min-w-[180px]">اسم الطالب</th>
                    
                    {FULL_MATRIX_COLUMNS.map((type, i) => (
                      <th key={i} className={`text-center px-1 py-4 w-16 ${type.isCalculated ? 'bg-slate-50/50' : ''}`}>
                        <div className="flex flex-col items-center justify-end h-24 pb-2">
                           <span className={`transform -rotate-90 whitespace-nowrap text-[14px] font-black uppercase tracking-tighter ${type.isCalculated ? 'text-indigo-600' : 'text-slate-500'}`}>
                             {type.label}
                           </span>
                        </div>
                      </th>
                    ))}

                    <th className="text-center px-5 py-4 text-xs font-black text-slate-400 uppercase tracking-wider min-w-[150px]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => {
                    const studentDraft = drafts[student.id] || {};
                    const isDirty = Object.keys(studentDraft).length > 0;

                    return (
                      <tr key={student.id || `student-${idx}`} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-4 text-sm font-bold text-slate-400 text-center">{idx + 1}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${student.gender === 'MALE' ? 'bg-blue-50' : 'bg-pink-50'} flex items-center justify-center`}>
                              <User2 className={`w-4 h-4 ${student.gender === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`} />
                            </div>
                            <span className="font-bold text-sm text-slate-700 whitespace-nowrap">
                              {student.firstName} {student.lastName}
                            </span>
                          </div>
                        </td>

                        {FULL_MATRIX_COLUMNS.map((type) => {
                          const existingGrade = grades.find(g => 
                            g.studentId === student.id && 
                            (g.subjectId === selectedSubjectId || g.subject?.id === selectedSubjectId) && 
                            g.examType === type.value
                          );
                          
                          const studentDraft = drafts[student.id] || {};
                          const currentScore = studentDraft[type.value] !== undefined ? studentDraft[type.value] : (existingGrade?.score ?? "");
                          const scoreColor = getScoreColor(currentScore);
                          const isLocked = type.isCalculated || !!existingGrade;

                          return (
                            <td key={type.value} className={`px-1 py-4 ${type.isCalculated ? 'bg-indigo-50/20' : ''}`}>
                              <div className="flex justify-center">
                                {isLocked ? (
                                  <div className={`w-12 h-10 flex items-center justify-center rounded-lg border-2 text-[11px] font-black transition-all ${
                                    type.isCalculated 
                                    ? (currentScore !== "" ? 'text-indigo-700 bg-indigo-50/50 border-indigo-200 border-dashed' : 'text-slate-300 border-slate-100 border-dashed')
                                    : (scoreColor || 'text-slate-700 bg-slate-50 border-slate-200 shadow-sm')
                                  }`}>
                                    {currentScore || "—"}
                                  </div>
                                ) : (
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={currentScore}
                                    onChange={(e) => handleDraftChange(student.id, type.value, e.target.value)}
                                    placeholder="—"
                                    className={`w-12 h-10 text-center rounded-lg border-2 text-[11px] font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                                      scoreColor || "border-slate-100 text-slate-600 bg-white"
                                    }`}
                                  />
                                )}
                              </div>
                            </td>
                          );
                        })}

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                             <button
                                onClick={() => handleSaveStudent(student.id)}
                                disabled={!isDirty || actionLoading}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                                  isDirty 
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-sm"
                                  : "bg-slate-50 text-slate-300 cursor-not-allowed"
                                }`}
                             >
                                <Save className="w-3.5 h-3.5" /> حفظ
                             </button>

                             <button
                                onClick={() => setSelectedStudentForModal(student)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg text-xs font-black transition-all"
                             >
                                <Printer className="w-3.5 h-3.5" />
                             </button>
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
      {/* Student Result Modal */}
      {selectedStudentForModal && (
        <StudentResultModal
          student={selectedStudentForModal}
          studentGrades={grades.filter((g) => g.studentId === selectedStudentForModal.id)}
          subjects={selectedClass?.subjects || []}
          examTypes={examTypes}
          schoolName={currentUser?.school?.name || "مدرستي"}
          onClose={() => setSelectedStudentForModal(null)}
        />
      )}

      {/* All Students Print Modal */}
      {showPrintAllModal && (
        <AllStudentsGradesModal
          students={students}
          grades={grades}
          selectedClass={selectedClass}
          selectedSubject={availableSubjects.find((s) => s.id === selectedSubjectId)}
          academicYear={currentYear?.name || "2024 - 2025"}
          teacherName={teacherName}
          onClose={() => setShowPrintAllModal(false)}
        />
      )}
    </div>
  );
}
