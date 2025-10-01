"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoadingPage() {
  const searchParams = useSearchParams();
  const nextPage = searchParams.get("nextPage");
  const lastCardNumber = searchParams.get("lastCardNumber");
  const expireDate = searchParams.get("expireDate");
  const router = useRouter();

  useEffect(() => {
    // استخراج قيمة `nextPage` من الـ query
    const nextPage = searchParams.get("nextPage");

    const timeout = setTimeout(() => {
      if (nextPage) {
        router.push(`${nextPage}?lastCardNumber=${lastCardNumber}&expireDate=${expireDate}`);
      } else {
        router.push("/");
      }
    }, 5000);

    // تنظيف المؤقت عند الخروج من الصفحة
    return () => clearTimeout(timeout);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col justify-center mt-24">
      {/* Spinner */}
      <div className="flex justify-center">
        <div className="w-16 h-16 border-4 border-[#c81048] border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* النص */}
      <p className="mt-6 text-center text-[#c81048] font-medium text-lg">
        الرجاء الإنتظار سيتم التأكد من المعلومات، لا تخرج من هذه الصفحة حتى يتم التأكد.
      </p>
    </div>
  );
}
