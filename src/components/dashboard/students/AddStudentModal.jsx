"use client";
import React, { useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, GraduationCap } from 'lucide-react';
import { createStudent, resetCreateStatus } from '../../../redux/slices/studentsSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import AddStudentForm from './AddStudentForm';

const AddStudentModal = memo(function AddStudentModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { createStatus, createError } = useSelector((state) => state.students);
  const { classes, status: classesStatus } = useSelector((state) => state.classes);

  useEffect(() => {
    if (isOpen && classesStatus === 'idle') {
      dispatch(fetchClasses());
    }
  }, [isOpen, classesStatus, dispatch]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      dispatch(resetCreateStatus());
      onClose();
    }
  }, [createStatus, dispatch, onClose]);

  const handleSubmit = useCallback((formData) => {
    // Prepare FormData for multipart/form-data
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'birthDate' && formData[key]) {
        data.append(key, new Date(formData[key]).toISOString());
      } else if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    // Enforce role
    data.set('role', 'STUDENT');

    dispatch(createStudent(data));
  }, [dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]" 
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 sm:p-7 text-white relative overflow-hidden shrink-0">
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/15 flex items-center justify-center ring-1 ring-white/25">
                <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black mb-0.5">تسجيل طالب جديد</h2>
                <p className="text-emerald-100/80 text-[10px] font-bold">أدخل بيانات الطالب الشخصية والأكاديمية والمالية</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all relative z-20"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/15 rounded-full -ml-12 -mb-12 blur-xl"></div>
        </div>

        {/* Dedicated Student Form */}
        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <AddStudentForm 
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={createStatus === 'loading'}
            error={createError}
            classes={classes}
          />
        </div>
      </div>
    </div>
  );
});

AddStudentModal.displayName = 'AddStudentModal';

export default AddStudentModal;
