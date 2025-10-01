"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingButton from "@/components/Button";

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idNumber = searchParams.get("idNumber");

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded">
      <p className="text-md text-gray-600 mb-4">
        تعبئة نموذج الطلب -- سوف يستغرق حوالي 1 دقيقة لإتمام الطلب
      </p>

      <div className="mb-4">
        <p className="text-2xl py-8 font-bold">معلومات حامل البطاقة</p>
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-gray-500 text-md">الرقم الشخصي</p>
          <p className="text-xl">{idNumber}</p>
        </div>
      </div>
      <hr />


      <div>

        <p className="text-2xl py-8 font-bold">الرسوم</p>
        <div className="flex flex-col px-4 gap-4">
          <div>
            <p className="text-md text-gray-500">الرسم المطلوب</p>
            <p className="text-xl">رسوم تجديد البطاقة الصحية</p>
          </div>

          <div>
            <p className="text-md text-gray-500">قيمة الرسم</p>
            <p className="text-xl">100 ريال قطري</p>
          </div>

          <div>
            <p className="text-md text-gray-500">المجموع</p>
            <p className="text-xl">100 ريال قطري</p>
          </div>
        </div>
      </div>

      <div className="w-[100%] flex justify-between items-center py-6 px-6 gap-4">
        <button
          onClick={handleBack}
          className="w-[40%] px-4 py-2 bg-gray-500 text-white rounded-3xl hover:bg-gray-600"
        >
          السابق
        </button>
        <LoadingButton onClick={() => router.push(`/card?idNumber=${idNumber}`)} >
          الدفع
        </LoadingButton>
      </div>
    </div>
  );
}