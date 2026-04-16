"use client";
import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Download, Loader2, Printer } from 'lucide-react';
import FinancialStats from '@/components/dashboard/financial/FinancialStats';
import FinancialChart from '@/components/dashboard/financial/FinancialChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinanceStats } from '@/redux/slices/financeStatsSlice';
import axiosInstance from '@/lib/axios';

const paymentTypeLabels = {
  TUITION: 'أقساط دراسية',
  TRANSPORT: 'أجور نقل',
  BOOKS: 'كتب وملازم',
  UNIFORM: 'زي مدرسي',
  ACTIVITIES: 'أنشطة لاصفية',
  OTHER: 'أخرى'
};

const paymentStatusLabels = {
  PENDING: 'معلقة',
  COMPLETED: 'مكتملة',
  CANCELLED: 'ملغاة',
  REFUNDED: 'مسترجعة'
};

const expenseTypeLabels = {
  SALARY: 'رواتب',
  MAINTENANCE: 'صيانة',
  SUPPLIES: 'معدات وتوريدات',
  RENT: 'إيجار',
  UTILITIES: 'خدمات عامة',
  MARKETING: 'تسويق',
  OTHER: 'أخرى'
};

export default function FinancialDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [reportLoading, setReportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const actualUser = user?.userData || user;
  const schoolId = actualUser?.schoolId;

  useEffect(() => {
    if (schoolId) {
      dispatch(fetchFinanceStats(schoolId));
    }
  }, [dispatch, schoolId]);

  const openPrintWindow = (reportData) => {
    const getArabicPaymentType = (type) => {
      const normalized = String(type || '').toUpperCase();
      return paymentTypeLabels[normalized] || type || '-';
    };

    const getArabicPaymentStatus = (status) => {
      const normalized = String(status || '').toUpperCase();
      return paymentStatusLabels[normalized] || status || '-';
    };

    const getArabicExpenseType = (type) => {
      const normalized = String(type || '').toUpperCase();
      return expenseTypeLabels[normalized] || type || '-';
    };

    const paymentsRows = reportData.payments.length
      ? reportData.payments.map((payment) => `
        <tr>
          <td>${new Date(payment.date).toLocaleDateString("en-GB")}</td>
          <td>${payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : "-"}</td>
          <td>${getArabicPaymentType(payment.paymentType)}</td>
          <td>${getArabicPaymentStatus(payment.status)}</td>
          <td>${Number(payment.amount || 0).toLocaleString()} $</td>
        </tr>
      `).join("")
      : `<tr><td colspan="5">لا توجد دفعات لهذا الشهر</td></tr>`;

    const expensesRows = reportData.expenses.length
      ? reportData.expenses.map((expense) => `
        <tr>
          <td>${new Date(expense.date).toLocaleDateString("en-GB")}</td>
          <td>${expense.title || "-"}</td>
          <td>${getArabicExpenseType(expense.type)}</td>
          <td>${expense.recipient ? `${expense.recipient.firstName} ${expense.recipient.lastName}` : (expense.recipientName || "-")}</td>
          <td>${Number(expense.amount || 0).toLocaleString()} $</td>
        </tr>
      `).join("")
      : `<tr><td colspan="5">لا توجد مصاريف لهذا الشهر</td></tr>`;

    const html = `
      <html dir="rtl">
        <head>
          <title>تقرير مالي شهري - ${reportData.month}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            h1, h2 { margin: 0 0 12px; }
            .meta { margin-bottom: 16px; color: #4b5563; }
            .summary { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; margin-bottom: 20px; }
            .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: right; font-size: 12px; }
            th { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>تقرير مالي شهري</h1>
          <div class="meta">المدرسة: ${reportData.school.name} | الشهر: ${reportData.month}</div>

          <div class="summary">
            <div class="card"><strong>إجمالي الإيرادات:</strong> ${Number(reportData.summary.totalRevenue).toLocaleString()} $</div>
            <div class="card"><strong>إجمالي المصاريف:</strong> ${Number(reportData.summary.totalExpenses).toLocaleString()} $</div>
            <div class="card"><strong>صافي الرصيد:</strong> ${Number(reportData.summary.netBalance).toLocaleString()} $</div>
            <div class="card"><strong>عدد العمليات:</strong> دفعات ${reportData.summary.paymentsCount} | مصاريف ${reportData.summary.expensesCount}</div>
          </div>

          <h2>الدفعات</h2>
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>الطالب</th>
                <th>نوع الدفعة</th>
                <th>الحالة</th>
                <th>المبلغ</th>
              </tr>
            </thead>
            <tbody>${paymentsRows}</tbody>
          </table>

          <h2>المصاريف</h2>
          <table>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>العنوان</th>
                <th>النوع</th>
                <th>المستلم</th>
                <th>المبلغ</th>
              </tr>
            </thead>
            <tbody>${expensesRows}</tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadMonthlyReport = async () => {
    if (!schoolId) return;
    setReportLoading(true);
    try {
      const res = await axiosInstance.get(`/finance/report/monthly/${schoolId}?month=${selectedMonth}`);
      if (res.data?.data) {
        openPrintWindow(res.data.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || "تعذر تحميل التقرير الشهري");
    } finally {
      setReportLoading(false);
    }
  };

  const handleExportMonthlyData = async () => {
    if (!schoolId) return;
    setExportLoading(true);
    try {
      const res = await axiosInstance.get(`/finance/export/monthly/${schoolId}?month=${selectedMonth}`, {
        responseType: "blob"
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `finance-report-${selectedMonth}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.response?.data?.message || "تعذر تصدير البيانات");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-lg shadow-purple-600/20 relative overflow-hidden flex flex-col justify-center min-h-[160px] w-full md:w-1/3">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Wallet className="w-8 h-8" />
              الشؤون المالية
            </h1>
            <p className="text-purple-100 font-medium">نظرة عامة على أداء المدرسة المالي</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white text-slate-700 px-4 py-3 rounded-2xl font-bold border border-slate-100 shadow-sm"
            />
            <button
                onClick={handleDownloadMonthlyReport}
                disabled={reportLoading}
                className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm border border-slate-100 hover:bg-slate-50 disabled:opacity-60"
            >
                {reportLoading ? <Loader2 className="w-5 h-5 animate-spin text-purple-600" /> : <Printer className="w-5 h-5 text-purple-600" />}
                تحميل تقرير شهري
            </button>
            <button
                onClick={handleExportMonthlyData}
                disabled={exportLoading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-60"
            >
                {exportLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                تصدير البيانات
            </button>
        </div>
      </div>

      <FinancialStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FinancialChart />
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-right">
          <h3 className="text-xl font-black text-slate-800 mb-6">آخر العمليات</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    {i % 2 === 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                      {i % 2 === 0 ? "دفعة رسوم طالب" : "فاتورة صيانة"}
                    </h4>
                    <p className="text-slate-400 text-xs font-medium">قبل {i * 2} ساعات</p>
                  </div>
                </div>
                <div className={`font-black ${i % 2 === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {i % 2 === 0 ? "+" : "-"}{i * 150} $
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
            عرض كافة العمليات
          </button>
        </div>
      </div>
    </div>
  );
}
