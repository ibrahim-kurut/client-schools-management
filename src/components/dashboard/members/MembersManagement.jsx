"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, UserPlus, Search, Filter, MoreVertical, Edit, Trash2, 
  Eye, GraduationCap, Mail, Phone, MapPin, Activity, CheckCircle2, XCircle,
  BookOpen, Calendar, Award
} from 'lucide-react';
import MembersModal from './MembersModal';
import Pagination from '../../ui/Pagination';
import SearchInput from '../../ui/SearchInput';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import Swal from 'sweetalert2';

// Mock data for members (to simulate backend response structure)
const MOCK_MEMBERS = [
  {
    id: '1',
    firstName: 'زياد',
    lastName: 'أحمد',
    email: 'ziad.ahmed@eduflow.app',
    phone: '07701234567',
    subject: 'الرياضيات',
    role: 'TEACHER',
    status: 'ACTIVE',
    joinDate: '2023-09-01',
    gender: 'MALE'
  },
  {
    id: '2',
    firstName: 'سارة',
    lastName: 'محمود',
    email: 'sara.m@eduflow.app',
    phone: '07809876543',
    subject: 'اللغة الإنجليزية',
    role: 'TEACHER',
    status: 'ACTIVE',
    joinDate: '2022-10-15',
    gender: 'FEMALE'
  },
  {
    id: '3',
    firstName: 'عمر',
    lastName: 'علي',
    email: 'omar.ali@eduflow.app',
    phone: '07504445566',
    subject: '',
    role: 'ASSISTANT',
    status: 'INACTIVE',
    joinDate: '2024-01-10',
    gender: 'MALE'
  },
  {
    id: '4',
    firstName: 'ليلى',
    lastName: 'خالد',
    email: 'layla.k@eduflow.app',
    phone: '07712223344',
    subject: '',
    role: 'ACCOUNTANT',
    status: 'ACTIVE',
    joinDate: '2021-08-20',
    gender: 'FEMALE'
  },
  {
    id: '5',
    firstName: 'يوسف',
    lastName: 'إبراهيم',
    email: 'youssef.i@eduflow.app',
    phone: '07908887766',
    subject: 'الكيمياء',
    role: 'TEACHER',
    status: 'ACTIVE',
    joinDate: '2023-11-05',
    gender: 'MALE'
  }
];

export default function MembersManagement({ slug }) {
  const { user } = useSelector((state) => state.auth);
  const userData = user?.userData || user;
  
  const { classes, status: classesStatus } = useSelector((state) => state.classes);
  const dispatch = useDispatch();
  
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (classesStatus === 'idle') {
      dispatch(fetchClasses());
    }
  }, [classesStatus, dispatch]);

  const getRoleLabel = (r) => {
    switch (r) {
      case 'TEACHER': return 'معلم';
      case 'ASSISTANT': return 'معاون';
      case 'ACCOUNTANT': return 'محاسب';
      default: return 'عضو';
    }
  };

  // Filter Logic (Mocking backend filtering)
  const filteredMembers = members.filter(m => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    const roleLabel = getRoleLabel(m.role).toLowerCase();
    const subject = (m.subject || '').toLowerCase();
    
    const matchesSearch = fullName.includes(search) || 
                          m.email.toLowerCase().includes(search) ||
                          subject.includes(search) ||
                          roleLabel.includes(search);

    const matchesSubject = subjectFilter === 'ALL' || m.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['ALL', ...new Set(MOCK_MEMBERS.map(m => m.subject).filter(Boolean))];

  const handleEdit = (member) => {
    setSelectedTeacher(member); // Kept state variable name for brevity or rename to selectedMember
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف العضو ${name} نهائياً من سجل المدرسة!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl'
    }).then((result) => {
      if (result.isConfirmed) {
        setMembers(prev => prev.filter(m => m.id !== id));
        Swal.fire('تم الحذف!', 'تم حذف العضو بنجاح.', 'success');
      }
    });
  };

  const handleSave = (memberData) => {
    if (selectedTeacher) {
      setMembers(prev => prev.map(m => m.id === selectedTeacher.id ? { ...m, ...memberData } : m));
    } else {
      const newMember = {
        ...memberData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'ACTIVE',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setMembers(prev => [newMember, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Computed Stats
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter(m => m.status === 'ACTIVE').length;
  const femaleCount = members.filter(m => m.gender === 'FEMALE').length;

  return (
    <div className="space-y-8">
      
      {/* ─── Header & Stats ─── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-black mb-2 flex items-center gap-3">
              <Award className="w-8 h-8" />
              أعضاء المدرسة
            </h1>
            <p className="text-blue-100 font-medium">إدارة شؤون الموظفين</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">إجمالي الأعضاء</p>
            <h3 className="text-3xl font-black text-slate-800">{totalMembersCount}</h3>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">الأعضاء النشطين</p>
            <h3 className="text-3xl font-black text-slate-800">{activeMembersCount}</h3>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">كادر (إناث)</p>
            <h3 className="text-3xl font-black text-slate-800">{femaleCount}</h3>
          </div>
          <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* ─── Controls & Filters ─── */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <SearchInput 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث بالاسم، التخصص، أو الوظيفة..."
          className="w-full md:w-96"
        />

        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium cursor-pointer transition-all hover:bg-slate-100"
            >
              <option value="ALL">جميع التخصصات</option>
              {subjects.filter(s => s !== 'ALL').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => {
              setSelectedTeacher(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
          >
            <UserPlus className="w-5 h-5" />
            إضافة عضو
          </button>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm font-bold">
                <th className="p-6 whitespace-nowrap">العضو</th>
                <th className="p-6 whitespace-nowrap">رقم الهاتف</th>
                <th className="p-6 whitespace-nowrap">البريد الإلكتروني</th>
                <th className="p-6 whitespace-nowrap">التخصص/الوظيفة</th>
                <th className="p-6 whitespace-nowrap">الجنس</th>
                <th className="p-6 whitespace-nowrap text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, idx) => (
                <tr 
                  key={member.id} 
                  className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group ${idx === filteredMembers.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                          {member.firstName} {member.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <div className="text-sm font-medium text-slate-400 flex items-center gap-1">
                          <span dir="ltr" className="font-mono">{member.phone || 'غير محدد'}</span>
                        </div>
                  </td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-2 text-slate-600 font-medium text-sm" dir="ltr">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {member.email}
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <div className="font-bold text-slate-700">
                      {member.role === 'TEACHER' ? member.subject : getRoleLabel(member.role)}
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${member.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                      {member.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                    </span>
                  </td>
                  
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2 transition-opacity">
                      {(userData?.role === 'SCHOOL_ADMIN' || userData?.role === 'ASSISTANT') && (
                        <button 
                          onClick={() => handleEdit(member)}
                          className="p-2 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {userData?.role === 'SCHOOL_ADMIN' && (
                        <button 
                          onClick={() => handleDelete(member.id, `${member.firstName} ${member.lastName}`)}
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

          {filteredMembers.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">لا يوجد أعضاء</h3>
              <p className="text-slate-400">لم يتم إضافة أي أعضاء بعد أو أنه لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={1}
          totalItems={filteredMembers.length}
          itemsPerPage={itemsPerPage}
          itemName="عضو"
          onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <MembersModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          initialData={selectedTeacher}
          classes={classes}
        />
      )}
    </div>
  );
}
