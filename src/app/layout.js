import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/redux-provider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EduFlow — نظام إدارة مدارس",
  description: "منصة إدارية مدرسية متكاملة",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ReduxProvider>
          <ToastContainer theme="colored" rtl={true} closeOnClick pauseOnHover />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
