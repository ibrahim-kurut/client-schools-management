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
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [recentOperations, setRecentOperations] = useState([]);

  const actualUser = user?.userData || user;
  const schoolId = actualUser?.schoolId;

  useEffect(() => {
    if (schoolId) {
      dispatch(fetchFinanceStats(schoolId));
    }
  }, [dispatch, schoolId]);

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      if (!schoolId) return;
      setDashboardLoading(true);
      try {
        const res = await axiosInstance.get(`/finance/dashboard/${schoolId}?months=6`);
        setChartData(res.data?.data?.chartData || []);
        setRecentOperations(res.data?.data?.recentOperations || []);
      } catch (error) {
        setChartData([]);
        setRecentOperations([]);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardDetails();
  }, [schoolId]);

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

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto mt-4 md:mt-0">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="col-span-2 md:col-span-1 bg-white text-slate-700 px-4 py-3 rounded-2xl font-bold border border-slate-100 shadow-sm w-full md:w-auto"
            />
            <button
                onClick={handleDownloadMonthlyReport}
                disabled={reportLoading}
                className="flex items-center justify-center gap-1.5 bg-white text-slate-700 px-2 md:px-6 py-3 rounded-2xl font-bold text-[14px] sm:text-[15px] md:text-base transition-all shadow-sm border border-slate-100 hover:bg-slate-50 disabled:opacity-60"
            >
                {reportLoading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-purple-600 shrink-0" /> : <Printer className="w-4 h-4 md:w-5 md:h-5 text-purple-600 shrink-0" />}
                <span className="truncate">تحميل تقرير</span>
            </button>
            <button
                onClick={handleExportMonthlyData}
                disabled={exportLoading}
                className="flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-2 md:px-6 py-3 rounded-2xl font-bold text-[14px] sm:text-[15px] md:text-base transition-all shadow-lg shadow-purple-600/30 hover:-translate-y-0.5 disabled:opacity-60"
            >
                {exportLoading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin shrink-0" /> : <Download className="w-4 h-4 md:w-5 md:h-5 shrink-0" />}
                <span className="truncate">تصدير البيانات</span>
            </button>
        </div>
      </div>

      <FinancialStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FinancialChart data={chartData} />
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-right">
          <h3 className="text-xl font-black text-slate-800 mb-6">آخر العمليات</h3>
          <div className="space-y-6">
            {dashboardLoading ? (
              <div className="flex items-center justify-center py-10 text-slate-500 font-bold">
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                جاري تحميل آخر العمليات...
              </div>
            ) : recentOperations.length === 0 ? (
              <div className="text-slate-400 text-sm font-bold py-8 text-center">
                لا توجد عمليات حديثة
              </div>
            ) : recentOperations.map((op, idx) => (
              <div key={`${op.type}-${idx}-${op.date}`} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${op.type === 'PAYMENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    {op.type === 'PAYMENT' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                      {op.title}
                    </h4>
                    <p className="text-slate-400 text-xs font-medium">{new Date(op.date).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <div className={`font-black ${op.type === 'PAYMENT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {op.type === 'PAYMENT' ? '+' : '-'}{Number(op.amount || 0).toLocaleString()} $
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
