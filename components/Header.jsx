import Image from 'next/image'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <div className="relative w-[35%] h-[45px]">
        <Image 
        src={"/logo.svg"} 
        alt="logo" 
        fill>
        </Image>
      </div>
      <div className="flex flex-row justify-between items-center w-[35%]">
        <button className=" border px-4 py-1 rounded text-sm">English</button>
        <div className="relative w-full h-[40px]">      
          <Image 
           src={"/Flag.avif"}
           fill>
          </Image>
        </div>          
      </div>
    </header>
  );
}

