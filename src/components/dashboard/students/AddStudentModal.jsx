"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { createStudent, resetCreateStatus } from '../../../redux/slices/studentsSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import AddMemberForm from './AddMemberForm';

export default function AddStudentModal({ isOpen, onClose }) {
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

  const handleSubmit = (formData) => {
    // Prepare FormData for multipart/form-data
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'birthDate' && formData[key]) {
        data.append(key, new Date(formData[key]).toISOString());
      } else if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    // Enforce role
    data.append('role', 'STUDENT');

    dispatch(createStudent(data));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" 
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1">إضافة طالب جديد</h2>
            <p className="text-blue-100 text-sm">أدخل بيانات الطالب الشخصية وولي الأمر لتسجيله بالنظام</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
        </div>

        {/* Reusable Form Component */}
        <AddMemberForm 
          role="STUDENT"
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={createStatus === 'loading'}
          error={createError}
          classes={classes}
        />
      </div>
    </div>
  );
}
