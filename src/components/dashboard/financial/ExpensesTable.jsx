import React from 'react';
import { Search, Filter, MoreVertical, FileText, Trash2, Edit } from 'lucide-react';

export default function ExpensesTable() {
  const expenses = [
    { id: 1, title: "قرطاسية وكتب", type: "SUPPLIES", amount: 450, date: "2024-03-15", recordedBy: "أحمد المحاسب" },
    { id: 2, title: "صيانة أجهزة التكييف", type: "MAINTENANCE", amount: 1200, date: "2024-03-20", recordedBy: "سارة المدير" },
    { id: 3, title: "راتب شهر مارس - أستاذ محمد", type: "SALARY", amount: 1500, date: "2024-03-25", recordedBy: "أحمد المحاسب" },
    { id: 4, title: "فاتورة كهرباء ومياه", type: "UTILITIES", amount: 850, date: "2024-03-28", recordedBy: "أحمد المحاسب" },
    { id: 5, title: "إيجار مبنى المدرسة", type: "RENT", amount: 5000, date: "2024-04-01", recordedBy: "أحمد المحاسب" },
  ];

  const getExpenseTypeLabel = (type) => {
    const types = {
      SALARY: "رواتب",
      MAINTENANCE: "صيانة",
      SUPPLIES: "معدات وتوريدات",
      RENT: "إيجار",
      UTILITIES: "خدمات عامة",
      MARKETING: "تسويق",
      OTHER: "أخرى"
    };
    return types[type] || type;
  };

  const getExpenseTypeColor = (type) => {
    const colors = {
      SALARY: "bg-purple-50 text-purple-600",
      MAINTENANCE: "bg-orange-50 text-orange-600",
      SUPPLIES: "bg-emerald-50 text-emerald-600",
      RENT: "bg-blue-50 text-blue-600",
      UTILITIES: "bg-rose-50 text-rose-600",
      MARKETING: "bg-blue-50 text-blue-600",
      OTHER: "bg-slate-50 text-slate-600"
    };
    return colors[type] || colors.OTHER;
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-black text-slate-800">مصاريف المدرسة</h3>
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="ابحث عن مصروف..." className="bg-slate-50 border border-slate-200 rounded-xl py-2 pr-9 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
            </div>
            <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <Filter className="w-5 h-5" />
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm font-bold">
              <th className="p-6 whitespace-nowrap">عنوان المصروف</th>
              <th className="p-6 whitespace-nowrap">التصنيف</th>
              <th className="p-6 whitespace-nowrap">المبلغ</th>
              <th className="p-6 whitespace-nowrap">التاريخ</th>
              <th className="p-6 whitespace-nowrap">بواسطة</th>
              <th className="p-6 whitespace-nowrap text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, idx) => (
              <tr key={expense.id} className="border-b border-slate-50 hover:bg-rose-50/30 transition-colors group">
                <td className="p-6">
                  <div className="font-bold text-slate-800 group-hover:text-rose-700 transition-colors">{expense.title}</div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getExpenseTypeColor(expense.type)}`}>
                    {getExpenseTypeLabel(expense.type)}
                  </span>
                </td>
                <td className="p-6 text-rose-600 font-black">{expense.amount} $</td>
                <td className="p-6 text-slate-400 font-medium text-sm">{expense.date}</td>
                <td className="p-6 text-slate-600 font-medium text-sm">{expense.recordedBy}</td>
                <td className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
