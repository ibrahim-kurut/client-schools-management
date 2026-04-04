"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Layers, 
  User, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  fetchSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject, 
  resetSubjectsStatus 
} from '../../../redux/slices/subjectsSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import { fetchMembers } from '../../../redux/slices/membersSlice';
import SubjectsModal from './SubjectsModal';
import SearchInput from '../../ui/SearchInput';
import Pagination from '../../ui/Pagination';
import Swal from 'sweetalert2';

export default function SubjectsManagement() {
  const dispatch = useDispatch();
  
  // -- Redux State --
  const { subjects, status, createStatus, createError } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);
  const { members } = useSelector((state) => state.members);
  const { user } = useSelector((state) => state.auth);
  const userData = user?.userData || user;

  // -- Local State --
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // -- Initial Fetch --
  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
    // Fetch teachers (we use members slice with role filter)
    dispatch(fetchMembers({ role: 'TEACHER', limit: 100 }));
  }, [dispatch]);

  // -- Handlers --
  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف مادة "${name}" نهائياً. لا يمكن التراجع عن هذا الإجراء!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'نعم، احذف المادة',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSubject(id)).then((res) => {
          if (!res.error) {
            Swal.fire('تم الحذف!', 'تم حذف المادة بنجاح.', 'success');
          } else {
            Swal.fire('خطأ!', 'فشل حذف المادة، قد تكون مرتبطة ببيانات أخرى.', 'error');
          }
        });
      }
    });
  };

  const handleSave = async (subjectData) => {
    try {
      if (selectedSubject) {
        await dispatch(updateSubject({ id: selectedSubject.id, subjectData })).unwrap();
        Swal.fire('تم التحديث!', 'تم تحديث بيانات المادة بنجاح.', 'success');
      } else {
        await dispatch(createSubject(subjectData)).unwrap();
        Swal.fire('تمت الإضافة!', 'تم إضافة المادة الجديدة بنجاح.', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      // Handled in form
    }
  };

  // -- Filtered Data --
  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'ALL' || s.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // -- Stats --
  const totalSubjects = subjects.length;
  const subjectsWithoutTeachers = subjects.filter(s => !s.teacherId).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ─── Header & Stats ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-black mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              إدارة المواد
            </h1>
            <p className="text-blue-100 font-medium">تنظيم المناهج والخطط الدراسية</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">إجمالي المواد</p>
            <h3 className="text-3xl font-black text-slate-800">{totalSubjects}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">مواد بدون معلم</p>
            <h3 className="text-3xl font-black text-slate-800">{subjectsWithoutTeachers}</h3>
          </div>
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchInput 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن مادة..."
          className="w-full md:w-96"
        />

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3 pr-10 pl-10 font-bold cursor-pointer focus:outline-none focus:border-blue-500 transition-all min-w-[160px]"
            >
              <option value="ALL">جميع الصفوف</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {(userData?.role === 'SCHOOL_ADMIN' || userData?.role === 'ASSISTANT') && (
            <button 
              onClick={() => {
                setSelectedSubject(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              مادة جديدة
            </button>
          )}
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
        {status === 'loading' && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-300">
                <th className="p-8 text-[1rem]">المادة الدراسية</th>
                <th className="p-8 text-[1rem]">الصف الدراسي</th>
                <th className="p-8 text-[1rem]">المعلم المسؤول</th>
                <th className="p-8 text-[1rem] text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      {/* <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                        {subject.name[0].toUpperCase()}
                      </div> */}
                      <div className="font-black text-slate-800 text-lg group-hover:text-blue-700 transition-colors uppercase">
                        {subject.name}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-8">
                    <div className="flex items-center gap-2 text-slate-600 font-bold">
                       <Layers className="w-4 h-4 text-slate-400" />
                       {subject.class?.name || 'غير متوفر'}
                    </div>
                  </td>

                  <td className="p-8">
                    {subject.teacher ? (
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <User className="w-4 h-4 text-blue-500" />
                        {subject.teacher.firstName} {subject.teacher.lastName}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-medium text-sm italic">لم يتم التعيين</span>
                    )}
                  </td>
                  
                  <td className="p-8">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleEdit(subject)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(subject.id, subject.name)}
                        className="p-3 bg-red-50 text-red-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedSubjects.length === 0 && status !== 'loading' && (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                <BookOpen className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-700 mb-2">لا توجد مواد دراسية</h3>
              <p className="text-slate-400 font-medium">ابدأ بإضافة المناهج الدراسية لمدرستك الآن</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSubjects.length}
            itemsPerPage={itemsPerPage}
            itemName="مادة"
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {isModalOpen && (
        <SubjectsModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            dispatch(resetSubjectsStatus());
          }}
          onSave={handleSave}
          initialData={selectedSubject}
          classes={classes}
          teachers={members}
          loading={createStatus === 'loading'}
          error={createError}
        />
      )}
    </div>
  );
}
