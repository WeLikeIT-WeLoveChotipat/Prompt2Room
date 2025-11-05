import Image from "next/image";
import Bed from "../../images/bed.svg";
import Sofa from "../../images/sofa.svg";
import Bath from "../../images/bath.svg";
import Cook from "../../images/cook.svg";

export default function Goal() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-10">
            เป้าหมายของพวกเรา
          </h2>

          <p className="text-lg text-black mt-20 leading-relaxed">
            เพื่อช่วยให้ผู้ใช้สามารถสร้างภาพจำลองห้องจากข้อความได้อย่างรวดเร็ว
            เข้าใจง่าย และไม่จำเป็นต้องมีพื้นฐานด้านการออกแบบ
          </p>

          <p className="text-lg text-black mt-8 leading-relaxed">
            เพื่อเชื่อมโยงภาพห้องที่สร้างขึ้นกับสินค้าจริง
            ช่วยให้ผู้ใช้สามารถค้นหาและเลือกซื้อเฟอร์นิเจอร์ที่ตรงกับสไตล์ที่ต้องการได้สะดวก
          </p>

          <p className="text-lg text-black leading-relaxed mt-8">
            เพื่อพัฒนาแพลตฟอร์มต้นแบบที่สามารถต่อยอดสู่การใช้งานเชิงพาณิชย์
            ในธุรกิจตกแต่งภายในและร้านค้าเฟอร์นิเจอร์ในอนาคต
          </p>
        </div>

        <div className="mt-50 md:mt-0 bg-white rounded-2xl shadow-lg p-10 grid grid-cols-2 gap-6 w-100 h-70">
          <div className="flex flex-col items-center text-center justify-center bg-[#FFF6F0] rounded-xl py-6 shadow-sm md:flex-row w-40 h-20 hover:scale-105">
            <Image src={Bed} alt='Bed' className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-black font-medium">ห้องนอน</p>
          </div>

          <div className="flex flex-col items-center text-center justify-center bg-[#FFF6F0] rounded-xl py-6 shadow-sm md:flex-row w-40 h-20 hover:scale-105">
            <Image src={Sofa} alt='Sofa' className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-black font-medium ">ห้องนั่งเล่น</p>
          </div>

          <div className="flex flex-col items-center text-center justify-center bg-[#CFE2FC] rounded-xl py-6 shadow-sm md:flex-row w-40 h-20 hover:scale-105">
            <Image src={Bath} alt='Bath' className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-black font-medium">ห้องน้ำ</p>
          </div>

          <div className="flex flex-col items-center text-center justify-center bg-[#CFE2FC] rounded-xl py-6 shadow-sm md:flex-row w-40 h-20 hover:scale-105">
            <Image src={Cook} alt='Cook' className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-black font-medium">ห้องครัว</p>
          </div>
        </div>
      </div>
    </section>
  )
}