import React from "react";
import { User2, X, Printer, Trophy } from "lucide-react";

const StudentResultModal = ({ 
  student, 
  studentGrades = [], 
  subjects = [], 
  examTypes = [], 
  schoolName = "اسم المدرسة", 
  onClose 
}) => {
  if (!student) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .my-receipt-print, .my-receipt-print * {
            visibility: visible;
          }
          .my-receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 20px;
            overflow: visible !important;
          }
          .my-receipt-print .custom-scrollbar {
             overflow: visible !important;
          }
        }
      `}} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0 print:static print:inset-auto">
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
          onClick={onClose}
        />

        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none my-receipt-print">
          
          {/* Header - Hidden in print */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 print:hidden">
            <h2 className="text-xl font-black text-slate-800">تفاصيل وسجل درجات الطالب</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-bold text-sm"
              >
                <Printer className="w-4 h-4" />
                طباعة
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 print:overflow-visible">
            
            {/* Print Header */}
            <div className="hidden print:flex justify-between items-center mb-8 border-b-2 border-slate-800 pb-6">
              <div className="text-right">
                <h1 className="text-2xl font-black text-slate-900">{schoolName}</h1>
                <p className="text-base font-bold text-slate-500 mt-1">سجل الدرجات الأكاديمي</p>
              </div>
              
              <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white overflow-hidden shadow-sm">
                 <span className="text-xs font-black text-slate-300">الشعار</span>
              </div>
              
              <div className="text-left" dir="ltr">
                <p className="text-sm font-black text-slate-800">العام الدراسي</p>
                <p className="text-sm font-bold text-slate-500 mt-1">2024 - 2025</p>
              </div>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-4 mb-8 bg-slate-50 border border-slate-100 p-5 rounded-2xl print:bg-transparent print:border-slate-300">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center print:border print:border-slate-300 ${student.gender === 'MALE' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                <User2 className={`w-7 h-7 flex-shrink-0 ${student.gender === 'MALE' ? 'text-blue-600' : 'text-pink-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800">{student.firstName} {student.lastName}</h3>
              </div>
            </div>

            {/* Grades */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-800">سجل الدرجات</h3>
              </div>

              {studentGrades.length > 0 ? (
                (() => {
                  // Group grades by subject
                  const subjectsGrouped = {};
                  studentGrades.forEach((g) => {
                    if (!subjectsGrouped[g.subjectId]) {
                      subjectsGrouped[g.subjectId] = {};
                    }
                    subjectsGrouped[g.subjectId][g.examType] = g.score;
                  });

                  return (
                    <div className="overflow-x-auto w-full">
                      <table className="w-full border-collapse whitespace-nowrap min-w-max">
                        <thead>
                          <tr className="bg-slate-100 print:bg-slate-200 leading-none">
                            <th className="border border-slate-300 px-3 align-middle text-center text-xs font-black text-slate-800 whitespace-nowrap">
                              المادة
                            </th>
                            
                            {/* Rotated Headers */}
                            {[
                              { label: 'تشرين الأول', color: 'text-slate-700', bg: '' },
                              { label: 'تشرين الثاني', color: 'text-slate-700', bg: '' },
                              { label: 'كانون الأول', color: 'text-slate-700', bg: '' },
                              { label: 'معدل الفصل الاول', color: 'text-indigo-700', bg: 'bg-indigo-50/50 print:bg-transparent' },
                              { label: 'نصف السنة', color: 'text-slate-700', bg: '' },
                              { label: 'آذار', color: 'text-slate-700', bg: '' },
                              { label: 'نيسان', color: 'text-slate-700', bg: '' },
                              { label: 'معدل الفصل الثاني', color: 'text-indigo-700', bg: 'bg-indigo-50/50 print:bg-transparent' },
                              { label: 'السعي', color: 'text-emerald-700', bg: 'bg-emerald-50/50 print:bg-transparent' },
                              { label: 'النهائي', color: 'text-slate-700', bg: '' },
                              { label: 'النتيجة', color: 'text-blue-700', bg: 'bg-blue-50/50 print:bg-transparent' },
                            ].map((th, index) => (
                              <th key={index} className={`border border-slate-300 w-10 px-1 py-2 align-bottom ${th.bg}`}>
                                <div className="flex justify-center items-center h-[120px]">
                                  <span className={`transform -rotate-90 whitespace-nowrap text-xs font-black ${th.color}`}>
                                    {th.label}
                                  </span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(subjectsGrouped).map((subjectId) => {
                            const exams = subjectsGrouped[subjectId];
                            const subjectName = subjects.find((s) => s.id === subjectId)?.name || 'غير معروف';

                            // Extract marks (return null if not exists)
                            const oct = exams['OCTOBER'];
                            const nov = exams['NOVEMBER'];
                            const dec = exams['DECEMBER'];
                            const midyear = exams['MIDYEAR'];
                            const mar = exams['MARCH'];
                            const apr = exams['APRIL'];
                            const finalExam = exams['FINAL_EXAM'];

                            // Helper to average available grades
                            const calcAvg = (...marks) => {
                              const valid = marks.filter(m => m !== undefined && m !== null);
                              if (valid.length === 0) return null;
                              return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
                            };

                            const firstAvg = calcAvg(oct, nov, dec);
                            const secondAvg = calcAvg(mar, apr);
                            const annualEffort = calcAvg(firstAvg, midyear, secondAvg);
                            const finalGrade = calcAvg(annualEffort, finalExam);

                            const renderCell = (val, isCalc = false, extraClass = "") => {
                              if (val === undefined || val === null) return <span className="text-slate-300">—</span>;
                              const numVal = Number(val);
                              const colorClass = numVal < 50 ? "text-red-500" : (isCalc ? "text-slate-800" : "text-slate-600");
                              return <span className={`font-black ${colorClass} ${extraClass}`}>{numVal}</span>;
                            };

                            return (
                              <tr key={subjectId} className="hover:bg-slate-50 transition-colors">
                                <td className="border border-slate-200 px-3 py-2 text-sm text-center font-bold text-slate-800 bg-slate-50 print:bg-transparent">
                                  {subjectName}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm">
                                  {renderCell(oct)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm">
                                  {renderCell(nov)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm">
                                  {renderCell(dec)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm bg-indigo-50/30 print:bg-transparent">
                                  {renderCell(firstAvg, true)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm">
                                  {renderCell(midyear)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm">
                                  {renderCell(mar)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm">
                                  {renderCell(apr)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm bg-indigo-50/30 print:bg-transparent">
                                  {renderCell(secondAvg, true)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm bg-emerald-50/30 print:bg-transparent">
                                  {renderCell(annualEffort, true, "text-emerald-700")}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm">
                                  {renderCell(finalExam)}
                                </td>
                                <td className="border border-slate-200 px-3 py-2 text-center text-base print:text-sm bg-blue-50/30 print:bg-transparent">
                                    {renderCell(finalGrade, true, "text-blue-700")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-500 font-bold">لم يتم رصد أي درجات لهذا الطالب حتى الآن.</p>
                </div>
              )}
            </div>

            {/* Print Footer */}
            <div className="hidden print:flex justify-between items-end mt-16 pt-8 border-t border-slate-200">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-600 mb-8">توقيع المعلم المادة</p>
                <div className="w-40 border-b border-slate-400"></div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-600 mb-8">توقيع ولي الأمر</p>
                <div className="w-40 border-b border-slate-400"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default StudentResultModal;
