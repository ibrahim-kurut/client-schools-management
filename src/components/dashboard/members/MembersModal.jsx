"use client";
import React from 'react';
import { X, Sparkles } from 'lucide-react';
import AddMemberForm from '../students/AddMemberForm';

export default function MembersModal({ isOpen, onClose, onSave, initialData, classes, defaultRole = 'TEACHER', createStatus, createError }) {
  
  const handleSubmit = (formData) => {
    // We pass the data back to the parent (TeachersManagement) to update local state
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (Simplified to avoid GPU/Animation lag) */}
      <div 
        className="absolute inset-0 bg-slate-900/80 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" 
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center ring-1 ring-white/30">
                  <Sparkles className="w-7 h-7" />
               </div>
               <div>
                  <h2 className="text-xl font-black mb-1">
                    {initialData ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}
                  </h2>
                  <p className="text-blue-100/80 text-[10px] font-bold">يرجى إدخال المعلومات المهنية بدقة</p>
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all relative z-20"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Simplified shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>

        {/* Reusable Form Component */}
        <AddMemberForm 
          role={initialData?.role || defaultRole}
          onSubmit={onSave} // Passed directly to parent handleSave
          onCancel={onClose}
          initialData={initialData}
          loading={createStatus === 'loading'}
          error={createError}
          classes={classes}
        />
      </div>
    </div>
  );
}
