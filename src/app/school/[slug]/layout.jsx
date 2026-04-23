import SchoolGuard from "@/components/auth/SchoolGuard";
import SubscriptionPendingOverlay from "@/components/dashboard/SubscriptionPendingOverlay";
import DashboardLayoutWrapper from "@/components/dashboard/DashboardLayoutWrapper";

export default function SchoolLayout({ children }) {
  return (
    <SchoolGuard>
      <SubscriptionPendingOverlay />
      <DashboardLayoutWrapper>
        {children}
      </DashboardLayoutWrapper>
    </SchoolGuard>
  );
}
