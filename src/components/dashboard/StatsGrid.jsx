"use client";
import { Users, GraduationCap, Layers, Wallet } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

export default function StatsGrid() {
  const { user } = useSelector((state) => state.auth);
  const actualUser = user?.userData || user;
  const role = actualUser?.role || 'TEACHER';

  const [backendStats, setBackendStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalClasses: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/schools/stats/overview');
        if (response.data && response.data.stats) {
          setBackendStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const allStats = [
    { 
      label: "إجمالي الطلاب", 
      value: backendStats.totalStudents.toLocaleString(), 
      icon: Users, 
      color: "from-blue-500 to-indigo-600", 
      bgLight: "bg-blue-50", 
      text: "text-blue-600", 
      roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] 
    },
    { 
      label: "أعضاء كادر تدريسي", 
      value: backendStats.totalStaff.toLocaleString(), 
      icon: GraduationCap, 
      color: "from-emerald-400 to-teal-500", 
      bgLight: "bg-emerald-50", 
      text: "text-emerald-600", 
      roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] 
    },
    { 
      label: "الصفوف الدراسية", 
      value: backendStats.totalClasses.toLocaleString(), 
      icon: Layers, 
      color: "from-amber-400 to-orange-500", 
      bgLight: "bg-amber-50", 
      text: "text-amber-600", 
      roles: ['SCHOOL_ADMIN', 'ASSISTANT', 'SUPER_ADMIN'] 
    },
    { 
      label: "الإيرادات الإجمالية", 
      value: `${backendStats.totalRevenue.toLocaleString()} $`, 
      icon: Wallet, 
      color: "from-purple-500 to-pink-600", 
      bgLight: "bg-purple-50", 
      text: "text-purple-600", 
      roles: ['ACCOUNTANT', 'SUPER_ADMIN'] // Removed SCHOOL_ADMIN as per user request (financial focus)
    },
  ];

  const stats = allStats.filter(stat => stat.roles.includes(role));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] h-40 border border-slate-100"></div>
        ))}
      </div>
    );
  }

  return (
    <section className={`grid grid-cols-1 md:grid-cols-2 ${stats.length === 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : stats.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}>
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            {/* Icon Box */}
            <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} flex items-center justify-center ${stat.text} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            
            {/* Value and Label */}
            <div>
              <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</div>
              <div className="text-slate-400 font-bold text-sm mt-1">{stat.label}</div>
            </div>

            {/* Sub-stat / Indiciator */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
               <span className="text-emerald-500 text-xs font-bold">+0% من الشهر الماضي</span>
               <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 text-[10px] cursor-help">i</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
