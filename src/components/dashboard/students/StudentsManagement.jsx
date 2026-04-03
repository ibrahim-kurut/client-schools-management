"use client";
import React, { useState } from 'react';
import { 
  Users, UserPlus, Search, Filter, MoreVertical, Edit, Trash2, 
  Eye, GraduationCap, Mail, Phone, MapPin, Activity, CheckCircle2, XCircle
} from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import Pagination from '../../ui/Pagination';
import SearchInput from '../../ui/SearchInput';

// Mock data for initial frontend view
// Mock data matching exact Prisma schema ('User' with role='STUDENT' and 'StudentProfile')
const MOCK_STUDENTS = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    firstName: "أحمد",
    lastName: "محمود",
    email: "ahmed.s@example.com",
    phone: "07712345678",
    gender: "MALE",
    className: "الصف العاشر", // From relation Class
    birthDate: "2008-05-14",
    createdAt: "2023-09-01T10:00:00.000Z",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=Ahmed&backgroundColor=e2e8f0",
    isDeleted: false,
    discountAmount: 0 // From StudentProfile
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    firstName: "سارة",
    lastName: "أحمد",
    email: "sarah@example.com",
    phone: "07898765432",
    gender: "FEMALE",
    className: "الصف العاشر",
    birthDate: "2008-11-20",
    createdAt: "2023-09-02T08:30:00.000Z",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=fee2e2",
    isDeleted: false,
    discountAmount: 50
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    firstName: "علي",
    lastName: "محمد",
    email: "ali.s@example.com",
    phone: "07712345678",
    gender: "MALE",
    className: "الصف العاشر", // From relation Class
    birthDate: "2008-05-14",
    createdAt: "2023-09-01T10:00:00.000Z",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=Ahmed&backgroundColor=e2e8f0",
    isDeleted: false,
    discountAmount: 0 // From StudentProfile
  },
   {
    id: "550e8400-e29b-41d4-a716-446655440021",
    firstName: "علي",
    lastName: "محمد",
    email: "ali.s@example.com",
    phone: "07712345678",
    gender: "MALE",
    className: "الصف العاشر", // From relation Class
    birthDate: "2008-05-14",
    createdAt: "2023-09-01T10:00:00.000Z",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=Ahmed&backgroundColor=e2e8f0",
    isDeleted: false,
    discountAmount: 0 // From StudentProfile
  },
  {
      id: "550e8400-e29b-41d4-a716-446655440031",
    firstName: "علي",
    lastName: "محمد",
    email: "ali.s@example.com",
    phone: "07712345678",
    gender: "MALE",
    className: "الصف العاشر", // From relation Class
    birthDate: "2008-05-14",
    createdAt: "2023-09-01T10:00:00.000Z",
    image: "https://api.dicebear.com/7.x/notionists/svg?seed=Ahmed&backgroundColor=e2e8f0",
    isDeleted: false,
    discountAmount: 0 // From StudentProfile
  }
];

export default function StudentsManagement({ slug }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setClassFilter(e.target.value);
    setCurrentPage(1);
  };

  // Filter students
  const filteredStudents = MOCK_STUDENTS.filter(student => 
    (searchTerm === '' || 
      `${student.firstName} ${student.lastName}`.includes(searchTerm) || 
      student.email.includes(searchTerm)
    ) &&
    (classFilter === 'ALL' || student.className === classFilter)
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Computed Stats
  const totalStudents = MOCK_STUDENTS.length;
  const activeStudents = MOCK_STUDENTS.filter(s => !s.isDeleted).length;
  const femaleCount = MOCK_STUDENTS.filter(s => s.gender === 'FEMALE').length;

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
              <option value="الصف العاشر">الصف العاشر</option>
              <option value="الصف التاسع">الصف التاسع</option>
            </select>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
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
                <th className="p-6 whitespace-nowrap">البريد الإلكتروني</th>
                <th className="p-6 whitespace-nowrap">الصف الدراسي</th>
                <th className="p-6 whitespace-nowrap">الجنس</th>
                <th className="p-6 whitespace-nowrap">المعلومات المالية</th>
                <th className="p-6 whitespace-nowrap text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, idx) => (
                <tr 
                  key={student.id} 
                  className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors group ${idx === paginatedStudents.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={student.image} 
                          alt={student.firstName} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm bg-white"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm font-medium text-slate-400 flex items-center gap-1">
                          رقم الهاتف: <span dir="ltr" className="font-mono">{student.phone || 'غير محدد'}</span>
                        </div>
                      </div>
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
                    {student.discountAmount > 0 ? (
                      <div className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                        خصم: ${student.discountAmount}
                      </div>
                    ) : (
                      <div className="text-slate-400 font-medium text-sm">
                        لا يوجد خصم مالي
                      </div>
                    )}
                  </td>
                  
                  <td className="p-6">
                    <div className="flex items-center justify-center gap-2 transition-opacity">
                      <button className="p-2 bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {paginatedStudents.length === 0 && (
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
          currentPage={currentPage}
          totalPages={Math.ceil(filteredStudents.length / itemsPerPage) || 1}
          totalItems={filteredStudents.length}
          itemsPerPage={itemsPerPage}
          itemName="طالب"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
