export default function CustomRadio() {
  return (
    <div
      className="
          relative w-4 h-4 ml-1 rounded-full border-2 border-gray-400
          peer-checked:border-[#c81048] peer-checked:bg-[#c81048]
          flex items-center justify-center transition-all duration-200 ease-in-out
        "
    >
      {/* Inner circle for the checked state */}
      <span
        className="
            w-2.5 h-2.5 rounded-full bg-white opacity-0
            peer-checked:opacity-100
            transition-opacity duration-200
          "
      ></span>
    </div>
  );
}
