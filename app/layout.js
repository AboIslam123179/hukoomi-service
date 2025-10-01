"use client"
import './globals.css';
import Header from "@/components/Header";
import StepperNavbar from "@/components/StepperNavbar";
import Head from "@/components/Head"; // استبدل هذا بالمسار الصحيح للـ Head إذا كان مختلفاً
import { Cairo } from 'next/font/google';
import { usePathname } from 'next/navigation';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const pageName = pathname?.split('/').filter(Boolean).pop(); // استخراج اسم الصفحة فقط



  if (pageName === 'card' || pageName === 'code' || pageName === 'loading' || pageName === 'err') {
    return (
      <html lang="en" style={{ direction: 'rtl' }} className={cairo.className}>
        <body>
          <Head />
          {children}
        </body>
      </html>
    );
  }

  // السلوك الافتراضي
  return (
    <html lang="en" style={{ direction: 'rtl' }} className={cairo.className}>
      <body>
        <div className="min-h-screen">
          <Header />
          <StepperNavbar />
          {children}
        </div>
        <footer className="w-full bg-gray-800 py-3 text-center text-sm text-white ">
          © حكومة دولة قطر 2023
        </footer>
      </body>
    </html>
  );
}
