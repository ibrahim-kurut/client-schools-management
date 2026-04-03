"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { updateStudent, resetCreateStatus } from '../../../redux/slices/studentsSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import AddMemberForm from './AddMemberForm';

export default function EditStudentModal({ isOpen, onClose, student }) {
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
    if (!student?.id) return;

    // Prepare FormData for multipart/form-data
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'birthDate' && formData[key]) {
        data.append(key, new Date(formData[key]).toISOString());
      } else if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else if (key === 'password' && !formData[key]) {
        // Skip empty password on update
      } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    dispatch(updateStudent({ id: student.id, formData: data }));
  };

  if (!isOpen || !student) return null;

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
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1">تعديل بيانات الطالب</h2>
            <p className="text-blue-100 text-sm">تعديل معلومات {student.firstName} {student.lastName}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>

        {/* Reusable Form Component */}
        <AddMemberForm 
          role="STUDENT"
          initialData={{
            ...student,
            // AddMemberForm expects image preview if it exists
            image: student.image
          }}
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
