import { Cairo } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/redux-provider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata = {
  title: "نقطة - نظام لإدارة المدارس",
  description: "نقطة بداية التمييز",
  icons: {
    icon: "/logo.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${cairo.className} min-h-full flex flex-col`} suppressHydrationWarning>
        <ReduxProvider>
          <ToastContainer theme="colored" rtl={true} closeOnClick pauseOnHover />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
