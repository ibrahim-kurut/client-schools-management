import SchoolGuard from "@/components/auth/SchoolGuard";

export default function SchoolLayout({ children }) {
  return (
    <SchoolGuard>
      {children}
    </SchoolGuard>
  );
}
