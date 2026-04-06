import React, { useState, useEffect, useCallback, memo } from 'react';
import { X, Calendar, Edit3, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const AddAcademicYearModal = ({ isOpen, onClose, onSave, editingYear }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editingYear) {
        setFormData({
          name: editingYear.name || '',
          startDate: editingYear.startDate ? format(new Date(editingYear.startDate), 'yyyy-MM-dd') : '',
          endDate: editingYear.endDate ? format(new Date(editingYear.endDate), 'yyyy-MM-dd') : '',
          isCurrent: editingYear.isCurrent || false
        });
      } else {
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
          isCurrent: false
        });
      }
      setErrors({});
    }
  }, [isOpen, editingYear]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // clear error for the field
    setErrors(prev => {
      if (prev[name]) {
        return { ...prev, [name]: null };
      }
      return prev;
    });
  }, []);

  const validate = () => {
    const nErrors = {};
    if (!formData.name.trim()) nErrors.name = 'اسم السنة مطلوب';
    if (!formData.startDate) nErrors.startDate = 'تاريخ البدء مطلوب';
    if (!formData.endDate) nErrors.endDate = 'تاريخ الانتهاء مطلوب';
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        nErrors.endDate = 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء';
      }
    }
    
    return nErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden" dir="rtl">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-600 to-blue-700 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              {editingYear ? <Edit3 className="w-5 h-5 text-white" /> : <PlusCircle className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold">{editingYear ? 'تعديل السنة الدراسية' : 'إضافة سنة دراسية'}</h2>
              <p className="text-blue-100 text-sm mt-1 opacity-90">
                {editingYear ? 'قم بتحديث بيانات السنة المختارة' : 'قم بإدخال بيانات السنة الأكاديمية الجديدة'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              اسم السنة الدراسية <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="name"
              placeholder="مثال: 2024 - 2025"
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'} bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                تاريخ البدء <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="date"
                  name="startDate"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.startDate ? 'border-red-500 bg-red-50' : 'border-slate-200'} bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 text-left cursor-text`}
                  value={formData.startDate}
                  onChange={handleChange}
                  dir="ltr"
                />
              </div>
              {errors.startDate && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                تاريخ الانتهاء <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="date"
                  name="endDate"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.endDate ? 'border-red-500 bg-red-50' : 'border-slate-200'} bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 text-left cursor-text`}
                  value={formData.endDate}
                  onChange={handleChange}
                  dir="ltr"
                />
              </div>
              {errors.endDate && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.endDate}</p>}
            </div>
          </div>

          {/* Is Current Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800">تعيين كسنة حالية</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">سيتم تفعيل هذه السنة كالسنة الافتراضية للنظام تلقائياً.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isCurrent"
                className="sr-only peer" 
                checked={formData.isCurrent}
                onChange={handleChange}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-[100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3 border-t border-slate-100 mt-4">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-500/30"
            >
              {editingYear ? 'حفظ التحديث الطارئ' : 'إضافة السنة الدراسية'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              إلغاء الأمر
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default memo(AddAcademicYearModal);
