"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, UserPlus, Search, Filter, MoreVertical, Edit, Trash2, 
  Eye, GraduationCap, Mail, Phone, MapPin, Activity, CheckCircle2, XCircle
} from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import Pagination from '../../ui/Pagination';
import SearchInput from '../../ui/SearchInput';
import { fetchStudents, deleteStudent } from '../../../redux/slices/studentsSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import { fetchAcademicYears } from '../../../redux/slices/academicYearsSlice';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

// Mock data has been removed and replaced by real API connection
// Mock data has been removed and replaced by real API connection

export default function StudentsManagement({ slug }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { students, pagination, status } = useSelector((state) => state.students);
  const { classes, status: classesStatus } = useSelector((state) => state.classes);
  const { years, currentYear, status: yearsStatus } = useSelector((state) => state.academicYears);
  const { user } = useSelector((state) => state.auth);
  const userData = user?.userData || user;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchStudents({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);

  useEffect(() => {
    if (classesStatus === 'idle') {
      dispatch(fetchClasses());
    }
    if (yearsStatus === 'idle') {
      dispatch(fetchAcademicYears());
    }
  }, [classesStatus, yearsStatus, dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setClassFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleAddStudentClick = () => {
    // 1. Check for current academic year
    if (!currentYear) {
      Swal.fire({
        title: 'تنبيه: السنة الدراسية غير محددة',
        text: 'لا يمكن إضافة طلاب قبل تحديد "السنة الدراسية الحالية". يرجى إعداد السنة الدراسية أولاً.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'الذهاب لإدارة السنوات',
        cancelButtonText: 'إغلاق',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'rounded-[2rem] font-sans',
          confirmButton: 'rounded-xl px-6 py-3 font-bold',
          cancelButton: 'rounded-xl px-6 py-3 font-bold'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/school/${slug}/academic-years`);
        }
      });
      return;
    }

    // 2. Check for classes
    if (classes.length === 0) {
      Swal.fire({
        title: 'تنبيه: لا توجد صفوف دراسية',
        text: 'يجب إنشاء "صف دراسي" واحد على الأقل قبل تسجيل الطلاب.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'إضافة صفوف',
        cancelButtonText: 'إغلاق',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'rounded-[2rem] font-sans',
          confirmButton: 'rounded-xl px-6 py-3 font-bold',
          cancelButton: 'rounded-xl px-6 py-3 font-bold'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/school/${slug}/classes`);
        }
      });
      return;
    }

    setIsAddModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف الطالب ${name} نهائياً من النظام!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteStudent(id)).then((action) => {
          if (action.meta.requestStatus === 'fulfilled') {
            Swal.fire('تم الحذف!', 'تم حذف الطالب بنجاح.', 'success');
          }
        });
      }
    });
  };

  // Filter mainly on backend, but if there's a local class filter:
  const filteredStudents = students.filter(student => 
    classFilter === 'ALL' || student.className === classFilter
  );


  // Computed Stats
  const totalStudents = pagination.totalMembers || 0;
  const activeStudents = filteredStudents.filter(s => !s.isDeleted).length;
  const femaleCount = filteredStudents.filter(s => s.gender === 'FEMALE').length;

  return (
    <div className="space-y-8">
      
      {/* ─── Header & Stats ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Users className="w-8 h-8" />
              سجل الطلاب
            </h1>
            <p className="text-blue-100 font-medium">إدارة بيانات الطلاب والتسجيل</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">إجمالي الطلاب</p>
            <h3 className="text-3xl font-black text-slate-800">{totalStudents}</h3>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">الطلاب النشطين</p>
            <h3 className="text-3xl font-black text-slate-800">{activeStudents}</h3>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">طالبات (إناث)</p>
            <h3 className="text-3xl font-black text-slate-800">{femaleCount}</h3>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* ─── Controls & Filters ─── */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <SearchInput 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="ابحث عن طالب بالاسم أو الإيميل..."
          className="w-full md:w-96"
        />

        {/* Filters & Actions */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={classFilter}
              onChange={handleFilterChange}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer transition-all hover:bg-slate-100"
            >
              <option value="ALL">جميع الصفوف</option>
              {classes.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleAddStudentClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
          >
            <UserPlus className="w-5 h-5" />
            إضافة طالب
          </button>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm font-bold">
                <th className="p-6 whitespace-nowrap">الطالب</th>
                <th className="p-6 whitespace-nowrap">اسم الأم</th>
                <th className="p-6 whitespace-nowrap">رقم الهاتف</th>
                <th className="p-6 whitespace-nowrap">البريد الإلكتروني</th>
                <th className="p-6 whitespace-nowrap">الصف الدراسي</th>
                <th className="p-6 whitespace-nowrap">الجنس</th>
                <th className="p-6 whitespace-nowrap text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr 
                  key={student.id} 
                  className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group ${idx === filteredStudents.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="font-bold text-slate-700">{student.studentProfile?.motherName || 'غير محدد'}</div>
                  </td>
                  
                  <td className="p-6">
                    <div className="text-sm font-medium text-slate-400 flex items-center gap-1">
                         <span dir="ltr" className="font-mono">{student.phone || 'غير محدد'}</span>
                        </div>
                  </td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-2 text-slate-600 font-medium text-sm" dir="ltr">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {student.email}
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <div className="font-bold text-slate-700">{student.className}</div>
                  </td>
                  
                  <td className="p-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${student.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                      {student.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                    </span>
                  </td>
                  
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2 transition-opacity">
                      {(userData?.role === 'SCHOOL_ADMIN' || userData?.role === 'ASSISTANT') && (
                        <button 
                          onClick={() => handleEdit(student)}
                          className="p-2 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {userData?.role === 'SCHOOL_ADMIN' && (
                        <button 
                          onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {status === 'loading' && (
            <div className="p-12 text-center text-slate-500 font-bold">
              جاري تحميل بيانات الطلاب...
            </div>
          )}

          {status !== 'loading' && filteredStudents.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">لا يوجد طلاب</h3>
              <p className="text-slate-400">لم يتم إضافة أي طلاب بعد أو أنه لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <Pagination 
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.totalMembers || 0}
          itemsPerPage={itemsPerPage}
          itemName="طالب"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <EditStudentModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStudent(null);
          }} 
          student={selectedStudent} 
        />
      )}
    </div>

  );
}
