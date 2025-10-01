"use client";
import { usePathname } from "next/navigation";

const steps = [
  { id: 1, label: "معلومات البطاقة", path: "/" },
  { id: 2, label: "استمارة التقديم", path: "/apply" },
  { id: 3, label: "تفاصيل الدفع", path: "/summary" },
  { id: 4, label: "إتمام العملية", path: "/card" },
];

export default function StepperNavbar() {
  const currentPath = usePathname();

  return (
    <>
    <div className="flex flex-row justify-between items-center py-3 pt-4">
      <div className="w-[70%] text-center">
        <h1 className="text-2xl font-bold">خدمة البطاقة الصحية الإلكترونية
         </h1>
      </div>   
      <div className="w-[30%]">
         <button className="px-3 py-1 rounded bg-[#c81048] text-white">المساعدة</button>
      </div>
    </div>
    <div className="relative flex justify-around items-center p-4 pb-0">

      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>

      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center relative">

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 ${
              currentPath === step.path
                ? "bg-[#c81048] text-white"
                : "bg-gray-200"}`}
          >
            {step.id}
          </div>
          <span className="mt-2 text-xs">{step.label}</span>
        </div>
      ))}
    </div>
    </>
  );
}