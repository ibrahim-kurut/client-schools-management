"use client";

import StudentSidebar from "@/components/student/StudentSidebar";
import StudentHeader from "@/components/student/StudentHeader";
import { useParams } from "next/navigation";

export default function StudentLayout({ children }) {
  const params = useParams();
  const slug = params?.slug || '';

  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex overflow-hidden lg:flex-row flex-col selection:bg-emerald-500/30" dir="rtl">
      {/* Sidebar */}
      <StudentSidebar slug={slug} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background decorative elements for student layout */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-50/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <StudentHeader slug={slug} />

        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 lg:p-8 relative z-10 w-full mx-auto">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
