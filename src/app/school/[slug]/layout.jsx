"use client";
import SchoolGuard from "@/components/auth/SchoolGuard";
import SubscriptionPendingOverlay from "@/components/dashboard/SubscriptionPendingOverlay";
import DashboardLayoutWrapper from "@/components/dashboard/DashboardLayoutWrapper";
import { usePathname } from "next/navigation";

export default function SchoolLayout({ children }) {
  const pathname = usePathname();
  
  // Check if we are in student dashboard, teacher dashboard or login page
  // We use regex to ensure /students (admin page) doesn't match /student
  const isSpecialSection = /\/student(\/|$)/.test(pathname) || 
                           /\/teacher(\/|$)/.test(pathname) || 
                           pathname.includes("/login");

  if (isSpecialSection) {
    return (
      <SchoolGuard>
        <SubscriptionPendingOverlay />
        {children}
      </SchoolGuard>
    );
  }

  return (
    <SchoolGuard>
      <SubscriptionPendingOverlay />
      <DashboardLayoutWrapper>
        {children}
      </DashboardLayoutWrapper>
    </SchoolGuard>
  );
}
