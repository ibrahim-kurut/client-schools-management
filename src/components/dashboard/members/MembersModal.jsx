"use client";
import React from 'react';
import { X, Sparkles } from 'lucide-react';
import AddMemberForm from '../students/AddMemberForm';

export default function MembersModal({ isOpen, onClose, onSave, initialData, classes, subjects = [], defaultRole = 'TEACHER', createStatus, createError, currentUserRole }) {
  
  const handleSubmit = (formData) => {
    // We pass the data back to the parent (TeachersManagement) to update local state
    onSave(formData);
    onClose();
  };

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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 sm:p-8 text-white relative overflow-hidden shrink-0">
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center ring-1 ring-white/30">
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
               </div>
               <div>
                  <h2 className="text-lg sm:text-xl font-black mb-0.5">
                    {initialData ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}
                  </h2>
                  <p className="text-blue-100/80 text-[10px] font-bold">يرجى إدخال المعلومات المهنية بدقة</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all relative z-20"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>

        {/* Reusable Form Component */}
        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <AddMemberForm 
            role={initialData?.role || defaultRole}
            currentUserRole={currentUserRole}
            onSubmit={onSave}
            onCancel={onClose}
            initialData={initialData}
            loading={createStatus === 'loading'}
            error={createError}
            classes={classes}
            subjects={subjects}
          />
        </div>
      </div>
    </div>
  );
}
