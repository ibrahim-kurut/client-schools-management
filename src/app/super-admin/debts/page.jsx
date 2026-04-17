"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Wallet,
  ArrowUpRight,
  HandCoins,
  AlertCircle,
  CheckCircle2,
  Users,
  Calendar,
  Layers,
  SearchX
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import StatusBadge from "@/components/dashboard/super-admin/StatusBadge";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "@/lib/axios";

export default function DebtsManagement() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDebtOnly, setFilterDebtOnly] = useState(true);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/schools?limit=100");
      setSchools(response.data.schools || []);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      toast.error("فشل في تحميل بيانات المدارس");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSettleDebt = async (schoolId, schoolName, debtAmount) => {
    const result = await Swal.fire({
      title: 'تسديد دفعة مِن الدين',
      html: `
        <div class="mb-4 text-sm text-slate-600">
          المبلغ المتبقي على <b>"${schoolName}"</b> هو <b>$${debtAmount}</b>.
          <br/>أدخل المبلغ الذي تم استلامه ليتم خصمه من إجمالي الدين:
        </div>
        <input id="swal-amount" type="number" step="0.01" min="0.01" max="${debtAmount}" class="swal2-input" placeholder="مثال: 150">
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'تأكيد الخصم',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      preConfirm: () => {
        const amount = document.getElementById('swal-amount').value;
        if (!amount || amount <= 0 || amount > debtAmount) {
          Swal.showValidationMessage('الرجاء إدخال مبلغ صحيح لا يزيد عن إجمالي الدين');
        }
        return amount;
      }
    });

    if (result.isConfirmed) {
      const amountPaid = result.value;
      try {
        await axios.post(`/subscriptions/settle-debt/${schoolId}`, { amount: amountPaid });
        toast.success(`تم تسديد $${amountPaid} مِن ديون ${schoolName} بنجاح`);
        fetchSchools(); // Refresh data
      } catch (error) {
        console.error("Failed to settle debt:", error);
        toast.error(error.response?.data?.message || "فشل في تسوية الدين");
      }
    }
  };

  const handleAddDebt = async (schoolId, schoolName) => {
    const result = await Swal.fire({
      title: 'إضافة دين للمدرسة',
      html: `
        <div class="mb-4 text-sm text-slate-600">
          سيتم إضافة الدين الجديد إلى رصيد ديون <b>"${schoolName}"</b> الحالي.
          <br/>أدخل قيمة الدين المراد إضافته (مثلاً قيمة اشتراك باقة):
        </div>
        <input id="swal-add-amount" type="number" step="0.01" min="1" class="swal2-input" placeholder="مبلغ الدين (مثال: 500)">
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'إضافة الدين',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      preConfirm: () => {
        const amount = document.getElementById('swal-add-amount').value;
        if (!amount || amount <= 0) {
          Swal.showValidationMessage('الرجاء إدخال مبلغ صحيح أكبر من الصفر');
        }
        return amount;
      }
    });

    if (result.isConfirmed) {
      const newDebtAmount = result.value;
      try {
        await axios.post(`/subscriptions/add-debt/${schoolId}`, { amount: newDebtAmount });
        toast.success(`تم إضافة دين بقيمة $${newDebtAmount} للمدرسة ${schoolName} بنجاح`);
        fetchSchools(); // Refresh data
      } catch (error) {
        console.error("Failed to add debt:", error);
        toast.error(error.response?.data?.message || "فشل في إضافة الدين");
      }
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      school.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const debt = school.subscription?.currentDebt || 0;
    const matchesDebtFilter = filterDebtOnly ? debt > 0 : true;

    return matchesSearch && matchesDebtFilter;
  });

  const totalDebt = schools.reduce((sum, school) => sum + (school.subscription?.currentDebt || 0), 0);
  const schoolsWithDebtCount = schools.filter(s => (s.subscription?.currentDebt || 0) > 0).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <DashboardPageHeader 
        title="إدارة ديون المدارس"
        description="متابعة المبالغ المستحقة من المدارس نتيجة تجاوز سعة الطلاب وتسويتها."
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <HandCoins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الديون المعلقة</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">${totalDebt.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">مدارس مديونة</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{schoolsWithDebtCount} مدرسة</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">حالة المنصة</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">مستقر</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="relative w-full md:w-96 group/search">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="البحث باسم المدرسة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:border-indigo-500 rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition-all duration-200"
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setFilterDebtOnly(!filterDebtOnly)}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border",
                filterDebtOnly 
                  ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm" 
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
              )}
            >
               <Filter className="w-4 h-4" />
               {filterDebtOnly ? "عرض المديونية فقط" : "تصفية حسب الدين"}
            </button>
         </div>
      </div>

      {/* Debts Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-400">جاري تحميل البيانات...</p>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300">
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">لا توجد نتائج</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">لم نجد مديونية تطابق اختياراتك الحالية.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">المدرسة</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الباقة الحالية</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">استهلاك الطلاب</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الديون المتراكمة</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">نهاية الاشتراك</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {filteredSchools.map((school) => {
                  const debt = school.subscription?.currentDebt || 0;
                  const plan = school.subscription?.plan;
                  const expiryDate = school.subscription?.endDate ? new Date(school.subscription.endDate).toLocaleDateString('ar-EG') : 'غير متوفر';
                  
                  return (
                    <tr 
                      key={school.id} 
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-all duration-300"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center p-0.5 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
                            {school.logo ? (
                              <img src={school.logo} alt={school.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <Users className="w-5 h-5 text-indigo-500" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate tracking-tight">{school.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider lowercase mt-0.5">eduflow.app/{school.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                              <Layers className="w-3.5 h-3.5" />
                           </div>
                           <span className="text-xs font-black text-slate-600 dark:text-slate-300">{plan?.name || "بدون خطة"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-bold">
                        {/* We don't have the current student count here easily without more includes, but the debt is already calculated in backend */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-600 dark:text-slate-400">السعة الأساسية: {plan?.maxStudents || 0}</span>
                            <span className="text-[10px] text-slate-400 font-medium">الهدية: {plan?.bufferStudents || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-black text-sm">
                        <div className={cn(
                          "inline-flex items-center px-3 py-1.5 rounded-xl border",
                          debt > 0 
                            ? "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400"
                        )}>
                          ${debt.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-bold">{expiryDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleAddDebt(school.id, school.name)}
                              title="إضافة دين جديد (اشتراك وغيرها)"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-[10px] font-black transition-all border border-blue-200"
                            >
                              <Wallet className="w-3.5 h-3.5" />
                              إضافة دين
                            </button>
                            {debt > 0 && (
                              <button 
                                onClick={() => handleSettleDebt(school.id, school.name, debt)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                              >
                                <HandCoins className="w-3.5 h-3.5" />
                                تسديد دفعة
                              </button>
                            )}
                            {debt <= 0 && (
                              <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                 <CheckCircle2 className="w-3.5 h-3.5" />
                                 خالص
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
