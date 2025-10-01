import Image from 'next/image'

export default function Header() {
  return (
<header className="flex justify-between items-center pr-4 text-white shadow-md" style={{ background: 'linear-gradient(to right, #3a003d, #91278f, #d80073)' }}>
  
      <div className="relative">
بوابة الدفع
      </div>
        <div className="relative w-[35%] h-[60px]
        ">      
          <Image 
           src={"/head.png"}
           fill>
          </Image>
        </div>          
    </header>
  );
}

