"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Upload, FileSpreadsheet, Download, X, CheckCircle2,
  AlertCircle, Loader2, Users, Info
} from 'lucide-react';
import { bulkImportStudents, resetImportStatus, fetchStudents } from '../../../redux/slices/studentsSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import Swal from 'sweetalert2';
import Select from '../../ui/Select';
import Button from '../../ui/Button';

export default function BulkStudentImport({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { importStatus, importError, importErrors } = useSelector((state) => state.students);
  const { classes, status: classesStatus } = useSelector((state) => state.classes);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // جلب الصفوف عند فتح المودال
  useEffect(() => {
    if (isOpen && classesStatus === 'idle') {
      dispatch(fetchClasses());
    }
  }, [isOpen, classesStatus, dispatch]);

  // إعادة تعيين الحالة عند الإغلاق
  useEffect(() => {
    if (!isOpen) {
      dispatch(resetImportStatus());
      setSelectedClassId('');
      setSelectedFile(null);
    }
  }, [isOpen, dispatch]);

  // التحقق من نوع الملف
  const isValidFileType = (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv',
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return validTypes.includes(file.type) || validExtensions.includes(extension);
  };

  // معالجة اختيار الملف
  const handleFileSelect = (file) => {
    if (!file) return;
    if (!isValidFileType(file)) {
      Swal.fire({
        title: 'صيغة غير مدعومة',
        text: 'يرجى رفع ملف بصيغة Excel (.xlsx) أو CSV (.csv) فقط.',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#059669',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }
    // حد الحجم 5MB
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'حجم الملف كبير',
        text: 'الحد الأقصى لحجم الملف هو 5 ميجابايت.',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#059669',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }
    setSelectedFile(file);
    dispatch(resetImportStatus());
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files?.[0]);
  };

  // --- Drag & Drop ---
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // تحميل النموذج الفارغ
  const handleDownloadTemplate = async () => {
    try {
      const { default: axiosInstance } = await import('../../../lib/axios');
      const res = await axiosInstance.get('/school-user/import-template', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      Swal.fire({
        title: 'خطأ',
        text: 'تعذر تحميل النموذج. حاول مرة أخرى.',
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#059669',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
    }
  };

  // بدء عملية الاستيراد
  const handleImport = async () => {
    if (!selectedClassId) {
      Swal.fire({
        title: 'تحديد الصف مطلوب',
        text: 'يرجى اختيار الصف الدراسي أولاً قبل رفع الملف.',
        icon: 'warning',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#059669',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }
    if (!selectedFile) {
      Swal.fire({
        title: 'لم يتم اختيار ملف',
        text: 'يرجى اختيار ملف Excel أو CSV لرفعه.',
        icon: 'warning',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#059669',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      return;
    }

    const result = await dispatch(bulkImportStudents({ classId: selectedClassId, file: selectedFile }));

    if (result.meta.requestStatus === 'fulfilled') {
      Swal.fire({
        title: 'تم الاستيراد بنجاح! 🎉',
        text: result.payload.message,
        icon: 'success',
        confirmButtonText: 'ممتاز',
        confirmButtonColor: '#16a34a',
        customClass: { popup: 'rounded-[2rem] font-sans' }
      });
      // إعادة تحميل قائمة الطلاب
      dispatch(fetchStudents({ page: 1, limit: 5, search: '' }));
      onClose();
    }
  };

  // إزالة الملف المختار
  const handleRemoveFile = () => {
    setSelectedFile(null);
    dispatch(resetImportStatus());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-t-[2rem] p-8 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-md"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-md"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black">استيراد جماعي للطلاب</h2>
                <p className="text-emerald-100 font-medium mt-1">رفع بيانات الطلاب من ملف إكسل</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">

          {/* الخطوة 1: اختيار الصف */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 font-bold text-lg mb-3">
              <span className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-emerald-600/20">1</span>
              اختر الصف الدراسي الموجه إليه
            </label>
            <Select
              value={selectedClassId}
              onChange={setSelectedClassId}
              placeholder="اختر الصف الدراسي..."
              disabled={importStatus === 'loading'}
              options={classes.map(c => ({ value: c.id, label: c.name }))}
            />
          </div>

          {/* الخطوة 2: رفع الملف */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 font-bold text-lg mb-3">
              <span className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-emerald-600/20">2</span>
              ارفع ملف الإكسل (XLSX, CSV)
            </label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group
                  ${isDragging
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                    : 'border-slate-200 bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/30'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDragging ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-600/40' : 'bg-slate-200 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'}`}>
                  <Upload className={`w-10 h-10 ${isDragging ? 'animate-bounce' : ''}`} />
                </div>
                <p className="text-slate-700 font-black text-xl mb-2">
                  {isDragging ? 'أفلت الملف هنا الآن' : 'اسحب الملف هنا أو اضغط للاختيار'}
                </p>
                <p className="text-slate-400 text-sm font-bold max-w-xs mx-auto">
                  تأكد من مطابقة الملف للنموذج المعتمد لضمان الاستيراد الصحيح
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-3xl p-6 flex items-center justify-between group animate-in slide-in-from-top-2">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg">{selectedFile.name}</p>
                    <p className="text-emerald-600 text-xs font-black uppercase tracking-wider">
                      {(selectedFile.size / 1024).toFixed(1)} KB • جاهز للرفع
                    </p>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={importStatus === 'loading'}
                  className="w-12 h-12 p-0 rounded-2xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* معلومات مساعدة */}
          <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600 font-bold leading-relaxed">
              <p className="text-slate-900 font-black mb-2 flex items-center gap-2">
                 تلميحات هامة لضمان نجاح الاستيراد:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 list-none">
                <li className="flex items-center gap-2 text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> الأعمدة الإجبارية: firstName, lastName</li>
                <li className="flex items-center gap-2 text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> رقم الهاتف: 10 أو 11 رقماً</li>
                <li className="flex items-center gap-2 text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> التاريخ: YYYY-MM-DD</li>
                <li className="flex items-center gap-2 text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> الجنس: ذكر / أنثى</li>
              </ul>
            </div>
          </div>

          {/* رسائل الأخطاء */}
          {importStatus === 'failed' && (
            <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-6 space-y-4 animate-in shake duration-500">
              <div className="flex items-center gap-3 text-red-700 font-black">
                <AlertCircle className="w-6 h-6" />
                <span>عذراً، حدثت أخطاء أثناء الاستيراد</span>
              </div>
              <p className="text-red-600 text-xs font-bold px-9">{importError}</p>
              {importErrors.length > 0 && (
                <div className="bg-white/50 rounded-2xl p-4 max-h-40 overflow-y-auto custom-scrollbar border border-red-100">
                   {importErrors.map((err, i) => (
                    <div key={i} className="text-[11px] text-red-500 font-bold flex items-start gap-2 mb-1.5 last:mb-0">
                       <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                       {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-50 p-8 flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-50/30 rounded-b-[2rem]">
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            disabled={importStatus === 'loading'}
            icon={Download}
          >
            تحميل النموذج
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={importStatus === 'loading'}
              fullWidth
            >
              إلغاء
            </Button>
            <Button
              variant="emerald"
              onClick={handleImport}
              loading={importStatus === 'loading'}
              disabled={!selectedClassId || !selectedFile}
              icon={Users}
              fullWidth
              className="sm:px-12"
            >
              بدء الاستيراد
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fee2e2;
          border-radius: 10px;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}
