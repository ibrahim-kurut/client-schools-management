"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatusBadge from "@/components/dashboard/super-admin/StatusBadge";
import UserEditModal from "@/components/dashboard/super-admin/UserEditModal";
import DeleteUserConfirmationModal from "@/components/dashboard/super-admin/DeleteUserConfirmationModal";
import SuperAdminDashboardTable from "@/components/dashboard/super-admin/SuperAdminDashboardTable";
import DashboardSelect from "@/components/dashboard/DashboardSelect";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`admin/users`, {
        params: {
          page,
          search: searchTerm,
          role: roleFilter
        }
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, roleFilter]);

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(`admin/users/${selectedUser.id}`);
      setIsDeleteModalOpen(false);
      fetchUsers(pagination.currentPage);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = async (userId, data) => {
    try {
      await axiosInstance.put(`admin/users/${userId}`, data);
      setIsEditModalOpen(false);
      fetchUsers(pagination.currentPage);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const roleOptions = [
    { label: "جميع المسؤلين", value: "" },
    { label: "مدير منصة", value: "SUPER_ADMIN" },
    { label: "مدير مدرسة", value: "SCHOOL_ADMIN" },
  ];

  // Define Columns for the Table
  const columns = [
    {
      header: "المستخدم",
      render: (user) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff`} 
              className="w-12 h-12 rounded-2xl shadow-sm object-cover transition-transform duration-300 group-hover:scale-110" 
              alt="" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[14px] text-slate-900 dark:text-white leading-none">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-[14px] font-bold text-slate-400 mt-1.5">{user.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "الرتبة",
      render: (user) => (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-bold uppercase tracking-widest",
          user.role === "SUPER_ADMIN" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" :
          user.role === "SCHOOL_ADMIN" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        )}>
          <Shield className="w-4 h-4" />
          {user.role}
        </div>
      )
    },
    {
      header: "رقم الهاتف",
      headerClassName: "text-right",
      render: (user) => (
        <span className="font-bold text-[14px] text-slate-600 dark:text-slate-400 font-mono" dir="ltr">
          {user.phone || "—"}
        </span>
      )
    },
    {
      header: "المدرسة",
      render: (user) => (
        <div className="flex flex-col">
          <span className="font-black text-[14px] text-slate-700 dark:text-slate-300">
            {user.schoolName || "—"}
          </span>
        </div>
      )
    },
    {
      header: "الحالة",
      render: () => <StatusBadge status={"ACTIVE"} />
    },
    {
      header: "تاريخ الانضمام",
      render: (user) => (
        <span className="text-[14px] font-black text-slate-500 uppercase tracking-widest">
          {new Date(user.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      )
    },
    {
      header: "الإجراءات",
      headerClassName: "text-center",
      render: (user) => (
        <div className="relative flex justify-center">
          <button 
            onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
            className="p-3 bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {activeMenu === user.id && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setActiveMenu(null)}
              />
              <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-[100] py-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 mb-1 border-b border-slate-50 dark:border-slate-800/50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">إجراءات المستخدم</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditModalOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit className="w-5 h-5 text-indigo-500" />
                  تعديل البيانات
                </button>
                <div className="h-px bg-slate-50 dark:bg-slate-800 my-1 mx-2" />
                <button 
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDeleteModalOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  حذف المستخدم
                </button>
              </div>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      <DashboardPageHeader 
        title="إدارة المستخدمين"
        description="عرض وإدارة جميع حسابات المستخدمين في كافة المدارس."
        primaryAction={{
          label: "إضافة مدير نظام",
          icon: UserPlus,
          variant: "indigo",
          onClick: () => console.log("Add User - Future Scope")
        }}
      />

      {/* Filters Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث عن مستخدم (الاسم أو البريد)..." 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition-all font-medium text-slate-900 dark:text-white"
            />
            {loading && (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />
            )}
         </div>
         <div className="flex items-center gap-3">
            <DashboardSelect 
              value={roleFilter}
              onChange={setRoleFilter}
              options={roleOptions}
              placeholder="جميع المسؤولين"
              className="w-56"
            />
         </div>
      </div>

      {/* The Table */}
      <SuperAdminDashboardTable 
        columns={columns}
        data={users || []}
        loading={loading}
        emptyMessage="لم يتم العثور على مستخدمين بهذا البحث"
      />

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
           <p className="text-sm font-bold text-slate-400">
             عرض {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} إلى {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalUsers)} من أصل {pagination.totalUsers} مستخدم
           </p>
           <div className="flex items-center gap-2">
             <button 
               onClick={() => fetchUsers(pagination.currentPage - 1)}
               disabled={!pagination.hasPreviousPage}
               className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-arabic"
             >
               <ChevronRight className="w-6 h-6" />
             </button>
             {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchUsers(i + 1)}
                  className={cn(
                    "w-12 h-12 rounded-xl text-sm font-black transition-all",
                    pagination.currentPage === i + 1 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                      : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  {i + 1}
                </button>
             ))}
             <button 
               onClick={() => fetchUsers(pagination.currentPage + 1)}
               disabled={!pagination.hasNextPage}
               className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-arabic"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>
           </div>
        </div>
      )}

      {/* Modals */}
      <UserEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateUser}
        user={selectedUser}
      />

      <DeleteUserConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        userName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""}
      />
    </div>
  );
}
