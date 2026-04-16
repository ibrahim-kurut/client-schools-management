import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Wallet, TrendingUp, TrendingDown, Clock, Loader2, AlertCircle } from 'lucide-react';

export default function FinancialStats() {
  const { stats: financeStats, status, error } = useSelector((state) => state.financeStats);

  const formatCurrency = (value) => {
    return `${Number(value || 0).toLocaleString()} $`;
  };

  const stats = useMemo(() => [
    { 
      label: "إجمالي الإيرادات", 
      value: formatCurrency(financeStats.totalRevenue), 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bgLight: "bg-emerald-50",
      change: "إجمالي المقبوضات المسجلة",
      changeColor: "text-slate-500"
    },
    { 
      label: "إجمالي المصاريف", 
      value: formatCurrency(financeStats.totalExpenses), 
      icon: TrendingDown, 
      color: "text-rose-600", 
      bgLight: "bg-rose-50",
      change: "إجمالي المصروفات المسجلة",
      changeColor: "text-slate-500"
    },
    { 
      label: "صافي الرصيد", 
      value: formatCurrency(financeStats.netBalance), 
      icon: Wallet, 
      color: "text-blue-600", 
      bgLight: "bg-blue-50",
      change: "الإيرادات - المصاريف",
      changeColor: "text-slate-500"
    },
    { 
      label: "مدفوعات معلقة", 
      value: formatCurrency(financeStats.pendingPayments), 
      icon: Clock, 
      color: "text-amber-600", 
      bgLight: "bg-amber-50",
      change: "المبالغ المستحقة غير المحصلة",
      changeColor: "text-slate-500"
    },
  ], [financeStats.totalRevenue, financeStats.totalExpenses, financeStats.netBalance, financeStats.pendingPayments]);

  if (status === "loading") {
    return (
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100">
        <div className="flex items-center justify-center gap-3 text-slate-500 font-bold">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
          جاري تحميل الإحصائيات المالية...
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-rose-100">
        <div className="flex items-center justify-center gap-2 text-rose-600 font-bold">
          <AlertCircle className="w-5 h-5" />
          {error || "تعذر تحميل الإحصائيات المالية"}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bgLight} flex items-center justify-center ${stat.color} shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</div>
              <div className="text-slate-400 font-bold text-sm mt-1">{stat.label}</div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
               <span className={`${stat.changeColor} text-xs font-bold`}>{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
