"use client";

import React, { useEffect, useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Clock,
  Check
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/redux/slices/notificationsSlice";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { notifications, unreadCount, status } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
    
    // Refresh every 2 minutes
    const interval = setInterval(() => {
       dispatch(fetchNotifications());
    }, 120000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const getIcon = (type) => {
    switch (type) {
      case 'SUBSCRIPTION_REQUEST': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'SUBSCRIPTION_UPDATE': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'SYSTEM': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={handleToggle}
        className="relative p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-500/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 group"
      >
        <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-in zoom-in duration-300">
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-4 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300 origin-top-left">
            
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
               <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">الإشعارات</h4>
                  <p className="text-[10px] font-bold text-slate-400 capitalize">لديك {unreadCount} رسالة غير مقروءة</p>
               </div>
               {unreadCount > 0 && (
                 <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                 >
                   <Check className="w-3 h-3" />
                   تحديد الكل كمقروء
                 </button>
               )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
               {(Array.isArray(notifications) ? notifications : []).length === 0 ? (
                 <div className="p-12 flex flex-col items-center justify-center text-center opacity-40">
                    <Bell className="w-10 h-10 mb-4 text-slate-300" />
                    <p className="text-xs font-bold text-slate-500">لا توجد إشعارات حالياً</p>
                 </div>
               ) : (
                 <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {(Array.isArray(notifications) ? notifications : []).filter(n => n && n.id).map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        className={cn(
                          "p-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group flex gap-4",
                          !notification.isRead ? "bg-indigo-50/30 dark:bg-indigo-500/5" : ""
                        )}
                      >
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-transparent transition-all group-hover:scale-110",
                           !notification.isRead ? "bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-500/20 shadow-sm" : "bg-slate-100 dark:bg-slate-800"
                         )}>
                            {getIcon(notification.type)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <h5 className={cn(
                              "text-xs font-black truncate mb-1",
                              !notification.isRead ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                            )}>
                              {notification.title}
                            </h5>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                               {notification.message}
                            </p>
                            <div className="flex items-center gap-2">
                               <Clock className="w-3 h-3 text-slate-300" />
                               <span className="text-[10px] font-bold text-slate-400">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ar })}
                               </span>
                            </div>
                         </div>
                         {!notification.isRead && (
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                         )}
                      </div>
                    ))}
                 </div>
               )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-50 dark:border-slate-800/50">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">نهاية الإشعارات</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
