import { Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default function FinancialStats() {
  const stats = [
    { 
      label: "إجمالي الإيرادات", 
      value: "45,200 $", 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bgLight: "bg-emerald-50",
      change: "+15% من الشهر الماضي",
      changeColor: "text-emerald-500"
    },
    { 
      label: "إجمالي المصاريف", 
      value: "12,800 $", 
      icon: TrendingDown, 
      color: "text-rose-600", 
      bgLight: "bg-rose-50",
      change: "+5% من الشهر الماضي",
      changeColor: "text-rose-500"
    },
    { 
      label: "صافي الرصيد", 
      value: "32,400 $", 
      icon: Wallet, 
      color: "text-blue-600", 
      bgLight: "bg-blue-50",
      change: "+12% من الشهر الماضي",
      changeColor: "text-emerald-500"
    },
    { 
      label: "مدفوعات معلقة", 
      value: "8,500 $", 
      icon: Clock, 
      color: "text-amber-600", 
      bgLight: "bg-amber-50",
      change: "-2% من الشهر الماضي",
      changeColor: "text-rose-500"
    },
  ];

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
