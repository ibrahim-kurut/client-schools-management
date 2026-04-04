import React from 'react';
import { Search, Filter, MoreVertical, CreditCard, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function FeesTable() {
  const students = [
    { id: 1, name: "أحمد محمد", class: "الصف الأول", totalFees: 1200, paid: 1200, balance: 0, status: "COMPLETED" },
    { id: 2, name: "ريان خالد", class: "الصف الثالث", totalFees: 1500, paid: 500, balance: 1000, status: "PARTIAL" },
    { id: 3, name: "سارة علي", class: "الصف الثاني", totalFees: 1200, paid: 0, balance: 1200, status: "PENDING" },
    { id: 4, name: "لينا يوسف", class: "الصف الأول", totalFees: 1200, paid: 1200, balance: 0, status: "COMPLETED" },
    { id: 5, name: "عمر فاروق", class: "الصف الرابع", totalFees: 2000, paid: 1000, balance: 1000, status: "PARTIAL" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> مكتمل</span>;
      case "PARTIAL":
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> جزئي</span>;
      case "PENDING":
        return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> معلق</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-black text-slate-800">رسوم الطلاب</h3>
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="ابحث عن طالب..." className="bg-slate-50 border border-slate-200 rounded-xl py-2 pr-9 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm" />
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
              <th className="p-6 whitespace-nowrap">اسم الطالب</th>
              <th className="p-6 whitespace-nowrap">الصف</th>
              <th className="p-6 whitespace-nowrap">إجمالي الرسوم</th>
              <th className="p-6 whitespace-nowrap">المدفوع</th>
              <th className="p-6 whitespace-nowrap">المتبقي</th>
              <th className="p-6 whitespace-nowrap text-center">الحالة</th>
              <th className="p-6 whitespace-nowrap text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group">
                <td className="p-6">
                  <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{student.name}</div>
                </td>
                <td className="p-6 text-slate-600 font-medium">{student.class}</td>
                <td className="p-6 text-slate-800 font-black">{student.totalFees} $</td>
                <td className="p-6 text-emerald-600 font-black">{student.paid} $</td>
                <td className="p-6 text-rose-600 font-black">{student.balance} $</td>
                <td className="p-6 flex justify-center">{getStatusBadge(student.status)}</td>
                <td className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                      <CreditCard className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreVertical className="w-4 h-4" />
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
