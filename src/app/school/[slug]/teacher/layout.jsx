"use client";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TeacherHeader from "@/components/teacher/TeacherHeader";
import { useParams } from "next/navigation";

export default function TeacherLayout({ children }) {
  const params = useParams();
  const slug = params?.slug || '';

  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex overflow-hidden lg:flex-row flex-col" dir="rtl">
      {/* Sidebar */}
      <TeacherSidebar slug={slug} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TeacherHeader slug={slug} />

        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth p-4 lg:p-8 bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
