"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptionRequests, approveSubscriptionRequest, rejectSubscriptionRequest, clearMessages } from "@/redux/slices/subscriptionRequestsSlice";
import DashboardPageHeader from "@/components/dashboard/super-admin/DashboardPageHeader";
import RequestCard from "@/components/dashboard/super-admin/RequestCard";
import ApproveRejectModal from "@/components/dashboard/super-admin/ApproveRejectModal";
import { toast } from "react-toastify";

export default function SubscriptionRequests() {
  const [activeStatus, setActiveStatus] = useState("PENDING");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalType, setModalType] = useState(null); // 'APPROVE' or 'REJECT'

  const dispatch = useDispatch();
  const { requests, status, error, successMessage } = useSelector((state) => state.subscriptionRequests);

  useEffect(() => {
    dispatch(fetchSubscriptionRequests(activeStatus));
  }, [dispatch, activeStatus]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleOpenModal = (request, type) => {
    setSelectedRequest(request);
    setModalType(type);
  };

  const handleConfirmAction = async (adminNotes) => {
    if (!selectedRequest || !selectedRequest.id) return;
    
    if (modalType === 'APPROVE') {
      await dispatch(approveSubscriptionRequest({ id: selectedRequest.id, adminNotes }));
    } else {
      await dispatch(rejectSubscriptionRequest({ id: selectedRequest.id, adminNotes }));
    }
    setSelectedRequest(null);
    setModalType(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <DashboardPageHeader 
        title="طلبات الاشتراك"
        description="مراجعة والتحقق من إيصالات الدفع لتفعيل الاشتراكات يدوياً."
      />

      <div className="flex items-center justify-center md:justify-start gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
         {["PENDING", "APPROVED", "REJECTED"].map((status) => (
           <button 
            key={status}
            onClick={() => setActiveStatus(status)}
            className={cn(
              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
              activeStatus === status 
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
           >
             {status === "PENDING" ? "قيد الانتظار" : status === "APPROVED" ? "مقبولة" : "مرفوضة"}
           </button>
         ))}
      </div>

      {/* Main Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Requests List */}
        <div className="lg:col-span-12 space-y-4">
           {status === 'loading' ? (
             <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-sm font-bold text-slate-500">جاري تحميل الطلبات...</p>
             </div>
            ) : (!requests || requests.length === 0) ? (
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center opacity-50 space-y-6">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center p-6 text-slate-300">
                   <AlertCircle className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">لا توجد طلبات {activeStatus === "PENDING" ? "معلقة" : "في هذا القسم"}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">سجل الطلبات فارغ حالياً</p>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {Array.isArray(requests) && requests.map((req) => {
                 if (!req || !req.id) return null;
                 return (
                  <RequestCard 
                    key={req.id} 
                    request={req} 
                    onApprove={() => handleOpenModal(req, 'APPROVE')}
                    onReject={() => handleOpenModal(req, 'REJECT')}
                  />
                 );
               })}
             </div>
           )}
        </div>

      </div>


      {/* Modals */}
      {selectedRequest && (
        <ApproveRejectModal 
          isOpen={!!selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            setModalType(null);
          }}
          onConfirm={handleConfirmAction}
          type={modalType}
          schoolName={selectedRequest?.school?.name || "مدرسة غير معروفة"}
        />
      )}
    </div>
  );
}
