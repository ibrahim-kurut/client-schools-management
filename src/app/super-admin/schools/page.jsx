"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ArchiveX,
  Plus,
  Crown,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { DOMAIN } from "@/lib/domain";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatusBadge from "@/components/dashboard/super-admin/StatusBadge";
import SchoolEditModal from "@/components/dashboard/super-admin/SchoolEditModal";
import ArchiveConfirmationModal from "@/components/dashboard/super-admin/ArchiveConfirmationModal";

export default function SchoolsManagement() {
  const [schools, setSchools] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totleSchools: 0
  });

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolToArchive, setSchoolToArchive] = useState(null);

  const fetchData = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const [schoolsRes, plansRes] = await Promise.all([
        axios.get(`${DOMAIN}/schools?page=${page}&limit=10&search=${search}`, { withCredentials: true }),
        axios.get(`${DOMAIN}/admin/plans`, { withCredentials: true })
      ]);

      setSchools(schoolsRes.data.schools);
      setPagination(schoolsRes.data.pagination);
      setPlans(plansRes.data);
    } catch (error) {
      console.error("Error fetching schools data:", error);
      toast.error("فشل في تحميل بيانات المدارس");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pagination.currentPage, searchTerm);
  }, [fetchData, pagination.currentPage, searchTerm]);

  const confirmArchive = async () => {
    if (!schoolToArchive) return;
    try {
      await axios.delete(`${DOMAIN}/schools/${schoolToArchive.id}`, { withCredentials: true });
      toast.success("تم أرشفة المدرسة بنجاح");
      fetchData(pagination.currentPage, searchTerm);
      setIsArchiveModalOpen(false);
      setSchoolToArchive(null);
    } catch (error) {
      console.error("Error archiving school:", error);
      toast.error("فشل في أرشفة المدرسة");
    }
  };

  const handleDeleteClick = (school) => {
    setSchoolToArchive(school);
    setIsArchiveModalOpen(true);
  };

  const openEditModal = (school) => {
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <DashboardPageHeader 
        title="إدارة المدارس"
        description="عرض وإدارة جميع المدارس المسجلة في المنصة بنظام SaaS."
      />

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 group hover:shadow-md transition-all duration-300">
         <div className="relative w-full md:w-96 group/search">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="البحث باسم المدرسة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-indigo-500/10"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border-dashed">
               <Filter className="w-4 h-4" />
               تصفية
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden md:block" />
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden md:block whitespace-nowrap">إجمالي المدارس: {pagination.totleSchools}</span>
         </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
             <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">المدرسة</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">المالك</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الباقة</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الطلاب</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الحالة</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">تاريخ الانضمام</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {schools.length > 0 ? (
                schools.map((school) => (
                  <tr 
                    key={school.id} 
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all duration-300"
                  >
                    <td className="px-6 py-6 font-arabic">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center p-0.5 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800 group-hover:scale-110 transition-transform duration-500 relative">
                          {school.logo ? (
                            <Image src={school.logo} alt={school.name} fill className="object-cover rounded-xl" />
                          ) : (
                            <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-lg">
                              {school.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate tracking-tight">{school.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider lowercase mt-0.5">{school.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                          {school.owner ? `${school.owner.firstName} ${school.owner.lastName}` : "غير محدد"}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">{school.owner?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                         <Crown className={cn("w-3.5 h-3.5", 
                            school.subscription?.plan?.price > 0 ? "text-amber-500" : "text-slate-400"
                         )} />
                         <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                           {school.subscription?.plan?.name || "بدون باقة"}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        {school._count?.members || 0}
                      </span>
                    </td>
                    <td className="px-6 py-6 font-bold">
                      <StatusBadge status={school.subscription?.status || "INACTIVE"} />
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {new Date(school.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-left">
                      <div className="flex items-center justify-end gap-2 transition-all duration-300">
                        <button 
                          onClick={() => openEditModal(school)}
                          title="تعديل الاشتراك"
                          className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-indigo-500 shadow-sm border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all active:scale-90 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <Link 
                          href={`/super-admin/debts?schoolId=${school.id}`}
                          title="إدارة الديون"
                          className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-amber-500 transition-all active:scale-90 border border-transparent hover:border-amber-100"
                        >
                          <Wallet className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(school)}
                          title="أرشفة المدرسة"
                          className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-red-400 shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-500/30 transition-all active:scale-90 cursor-pointer"
                        >
                          <ArchiveX className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                          <Search className="w-10 h-10" />
                       </div>
                       <div className="space-y-1">
                          <p className="font-extrabold text-slate-900 dark:text-white">لا توجد مدارس حالياً</p>
                          <p className="text-xs text-slate-500">لم يتم العثور على أي مدارس مسجلة في النظام.</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-arabic">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              الصفحة {pagination.currentPage} من {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={!pagination.hasPreviousPage}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <SchoolEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        school={selectedSchool}
        plans={plans}
        onUpdate={() => fetchData(pagination.currentPage, searchTerm)}
      />

      {/* Archive Modal */}
      <ArchiveConfirmationModal 
        isOpen={isArchiveModalOpen}
        onClose={() => {
          setIsArchiveModalOpen(false);
          setSchoolToArchive(null);
        }}
        onConfirm={confirmArchive}
        schoolName={schoolToArchive?.name}
      />
    </div>
  );
}
