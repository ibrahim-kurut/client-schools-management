"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Users, Loader2 } from 'lucide-react';
import ClassModal from './ClassModal';
import Swal from 'sweetalert2';
import { fetchClasses, createClass, resetCreateStatus } from '@/redux/slices/classesSlice';

export default function ClassesManagement({ slug }) {
  const dispatch = useDispatch();
  const { classes, status, createStatus } = useSelector((state) => state.classes);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleAddClick = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (cls) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // For now, we only handle create and fetch based on user request.
    // The delete UI remains, but we use a SweetAlert to indicate it's not hooked up yet, or just local simulate.
    Swal.fire({
      title: 'ميزة الحذف',
      text: "سيتم تفعيل هذه الميزة في الخطوة القادمة.",
      icon: 'info',
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'حسناً',
      customClass: {
        popup: 'rounded-[32px] font-sans rtl border border-slate-100 shadow-2xl',
        confirmButton: 'rounded-2xl px-10 py-3 font-black text-sm'
      }
    });
  };

  const handleSave = async (classData) => {
    if (selectedClass) {
      // Edit is currently not hooked up per requirements, showing info message
      Swal.fire({
        title: 'ميزة التعديل',
        text: "سيتم تفعيل هذه الميزة في الخطوة القادمة.",
        icon: 'info',
        confirmButtonColor: '#2563eb',
        confirmButtonText: 'حسناً',
        customClass: {
          popup: 'rounded-[32px] font-sans rtl'
        }
      });
    } else {
      // Create new class
      try {
        const resultAction = await dispatch(createClass(classData)).unwrap();
        Swal.fire({
          title: 'تمت الإضافة',
          text: resultAction.message || 'تم إنشاء الصف بنجاح.',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[32px] font-sans rtl' }
        });
      } catch (err) {
        Swal.fire({
          title: 'خطأ',
          text: err.message || 'فشلت عملية الإضافة',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          customClass: { popup: 'rounded-[32px] font-sans rtl' }
        });
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800">إدارة الصفوف والمراحل</h1>
          <p className="text-slate-500 font-semibold mt-1">عرض وإدارة المراحل الدراسية والرسوم</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة صف جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes && classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-600 rounded-r-[32px]"></div>
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800 pr-4">{cls.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(cls)} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cls.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl">
                <span className="text-slate-500 font-semibold flex items-center gap-2">
                  <span className="text-xl">💰</span> القسط الدراسي
                </span>
                <span className="font-bold text-slate-800">{cls.tuitionFee || 0} <span className="text-sm text-slate-500">دولار</span></span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-2xl">
                <span className="text-blue-600 font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" /> عدد الطلاب
                </span>
                <span className="font-bold text-blue-700">{cls.studentsCount || 0}</span>
              </div>
            </div>
          </div>
        ))}

        {(!classes || classes.length === 0) && status === 'succeeded' && (
          <div className="col-span-full bg-white rounded-[32px] p-12 text-center border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد صفوف مضافة</h3>
            <p className="text-slate-500 mb-6">قم بإضافة الصفوف والمراحل الدراسية للبدء</p>
            <button 
              onClick={handleAddClick}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-bold inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة صف جديد</span>
            </button>
          </div>
        )}
      </div>

      <ClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedClass}
      />
    </div>
  );
}
