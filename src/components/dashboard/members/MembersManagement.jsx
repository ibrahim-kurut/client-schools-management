"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, UserPlus, Search, Filter, MoreVertical, Edit, Trash2, 
  Eye, GraduationCap, Mail, Phone, MapPin, Activity, CheckCircle2, XCircle,
  BookOpen, Calendar, Award, Loader2
} from 'lucide-react';
import { fetchMembers, deleteMember, resetMembersStatus, createMember, updateMember } from '../../../redux/slices/membersSlice';
import { fetchClasses } from '../../../redux/slices/classesSlice';
import MembersModal from './MembersModal';
import Pagination from '../../ui/Pagination';
import SearchInput from '../../ui/SearchInput';
import Swal from 'sweetalert2';

export default function MembersManagement({ slug }) {
  const dispatch = useDispatch();
  
  // -- Redux State --
  const { user } = useSelector((state) => state.auth);
  const userData = user?.userData || user;
  
  const { classes, status: classesStatus } = useSelector((state) => state.classes);
  const { members, pagination, status, error, createStatus, createError } = useSelector((state) => state.members);
  
  // -- Local State --
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(''); // Empty means all staff
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // -- Initial Fetch --
  useEffect(() => {
    dispatch(fetchMembers({ page: currentPage, limit: itemsPerPage, search: searchTerm, role: roleFilter }));
  }, [dispatch, currentPage, searchTerm, roleFilter]);

  useEffect(() => {
    if (classesStatus === 'idle') {
      dispatch(fetchClasses());
    }
  }, [classesStatus, dispatch]);

  // -- Helpers --
  const getRoleLabel = (r) => {
    switch (r) {
      case 'TEACHER': return 'معلم';
      case 'ASSISTANT': return 'معاون';
      case 'ACCOUNTANT': return 'محاسب';
      default: return 'عضو';
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
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
        dispatch(deleteMember(id)).then((res) => {
          if (!res.error) {
            Swal.fire('تم الحذف!', 'تم حذف العضو من قاعدة البيانات بنجاح.', 'success');
          } else {
            Swal.fire('خطأ!', 'فشل حذف العضو، يرجى المحاولة لاحقاً.', 'error');
          }
        });
      }
    });
  };

  const handleSave = async (memberData) => {
    // Collect data into FormData for Multipart support
    const formData = new FormData();
    Object.keys(memberData).forEach(key => {
      if (memberData[key] !== null && memberData[key] !== undefined) {
        formData.append(key, memberData[key]);
      }
    });

    try {
      if (selectedMember) {
        await dispatch(updateMember({ id: selectedMember.id, formData })).unwrap();
        Swal.fire('تم التحديث!', 'تم تحديث بيانات العضو بنجاح.', 'success');
      } else {
        await dispatch(createMember(formData)).unwrap();
        Swal.fire('تمت الإضافة!', 'تم إضافة العضو الجديد بنجاح.', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      // Error is handled in the form normally, but we can log here
      console.error("Save Error:", err);
    }
  };

  // -- Render Helpers --
  const isLoading = status === 'loading';

  return (
    <div className="space-y-8">
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-lg shadow-blue-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px]">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-black mb-2 flex items-center gap-3">
              <Award className="w-8 h-8" />
              أعضاء المدرسة
            </h1>
            <p className="text-blue-100 font-medium">إدارة شؤون الطاقم الوظيفي</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 group transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">إجمالي الطاقم</p>
            <h3 className="text-3xl font-black text-slate-800">{pagination.totalMembers || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 group">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">الحسابات النشطة</p>
            <h3 className="text-3xl font-black text-slate-800">{pagination.totalMembers || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5 group">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 font-bold mb-1">الكفاءات المسجلة</p>
            <h3 className="text-3xl font-black text-slate-800">{classes.length} مادة</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between transition-all focus-within:shadow-md">
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl py-3 pr-10 pl-10 focus:outline-none focus:border-blue-500 font-bold cursor-pointer transition-all hover:bg-slate-100 min-w-[160px]"
            >
              <option value="">جميع الكادر</option>
              <option value="TEACHER">المعلمين</option>
              <option value="ASSISTANT">المعاونين</option>
              <option value="ACCOUNTANT">المحاسبين</option>
            </select>
          </div>

          {(userData?.role === 'SCHOOL_ADMIN' || userData?.role === 'ASSISTANT') && (
            <button 
              onClick={() => {
                setSelectedMember(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02]"
            >
              <UserPlus className="w-5 h-5" />
              عضو جديد
            </button>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="p-8 text-[1rem]">العضو</th>
                <th className="p-8 text-[1rem]">رقم الهاتف</th>
                <th className="p-8 text-[1rem]">البريد الإلكتروني</th>
                <th className="p-8 text-[1rem]">التخصص/الوظيفة</th>
                <th className="p-8 text-[1rem]">الحالة</th>
                <th className="p-8 text-[1rem] text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-100 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      {/* <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center font-black text-blue-600 text-lg overflow-hidden">
                         {member.image ? <img src={member.image} className="w-full h-full object-cover" /> : member.firstName[0]}
                      </div> */}
                      <div>
                        <div className="font-black text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                          {member.firstName} {member.lastName}
                        </div>
                        {/* <div className="text-[10px] font-bold text-slate-400 capitalize">{member.gender === 'MALE' ? 'ذكر' : 'أنثى'}</div> */}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-8">
                    <span dir="ltr" className="font-mono font-bold text-slate-600">{member.phone || '---'}</span>
                  </td>

                  <td className="p-8">
                    <div className="text-slate-500 font-bold" dir="ltr">{member.email}</div>
                  </td>
                  
                  <td className="p-8">
                    <div className="font-black text-slate-700 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${member.role === 'TEACHER' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                      {member.role === 'TEACHER' 
                        ? (member.subjects?.length > 0 ? member.subjects.map(s => s.name).join('، ') : 'لم يتم التعيين') 
                        : getRoleLabel(member.role)
                      }
                    </div>
                  </td>
                  
                  <td className="p-8">
                    <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                      نشط حالياً
                    </span>
                  </td>
                  
                  <td className="p-8">
                    <div className="flex items-center justify-center gap-3">
                      {(userData?.role === 'SCHOOL_ADMIN' || userData?.role === 'ASSISTANT') && (
                        <button 
                          onClick={() => handleEdit(member)}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all cursor-pointer shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {userData?.role === 'SCHOOL_ADMIN' && (
                        <button 
                          onClick={() => handleDelete(member.id, `${member.firstName} ${member.lastName}`)}
                          className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all cursor-pointer shadow-sm"
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

          {members.length === 0 && !isLoading && (
            <div className="p-20 text-center flex flex-col items-center animate-in fade-in slide-in-from-top-4">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-700 mb-2">لا يوجد أعضاء في هذا القسم</h3>
              <p className="text-slate-400 font-medium">ابدأ بإضافة أول عضو في طاقم مدرستك الآن</p>
            </div>
          )}
        </div>
        
        {/* Pagination Integration */}
        <Pagination 
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.totalMembers || 0}
          itemsPerPage={itemsPerPage}
          itemName="عضو"
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {isModalOpen && (
        <MembersModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          initialData={selectedMember}
          classes={classes}
          createStatus={createStatus}
          createError={createError}
        />
      )}
    </div>
  );
}
