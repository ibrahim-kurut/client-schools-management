import SchoolGuard from "@/components/auth/SchoolGuard";
import SubscriptionPendingOverlay from "@/components/dashboard/SubscriptionPendingOverlay";

export default function SchoolLayout({ children }) {
  return (
    <SchoolGuard>
      <SubscriptionPendingOverlay />
      {children}
    </SchoolGuard>
  );
}
