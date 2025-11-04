import Image from "next/image";
import Brainv2 from "../../images/Brainv2.svg";
import Think from "../../images/Think.svg";
import Ml from "../../images/Ml.svg";
import Paint from "../../images/Paint.svg"

export default function Drivingforce() {
  return (
    <section className="bg-[#EAF2FB] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            แรงขับเคลื่อนของ Prompt2Room
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            ขับเคลื่อนด้วยเทคโนโลยีปัญญาประดิษฐ์ (AI) ที่ล้ำสมัย แพลตฟอร์มของเราสามารถแปลง
            “ข้อความคำสั่ง” ให้กลายเป็น “ภาพห้องเสมือนจริง” ได้อย่างสมบูรณ์แบบ
            ทั้งในด้านแสง สี อารมณ์ และการจัดวางองค์ประกอบ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="hover:scale-105 duration-300 flex items-start space-x-4 bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Image src={Brainv2} alt="Brainv2" className="w-[50px] h-[50px] text-gray-800" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Advanced Neural Networks</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  เทคโนโลยี Deep Learning ที่เข้าใจตำแหน่ง สี และองค์ประกอบ
                  เพื่อสร้างภาพห้องที่สวยงามและกลมกลืนอย่างเป็นธรรมชาติ
                </p>
              </div>
            </div>

            <div className="hover:scale-105 duration-300 flex items-start space-x-4 bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Image src={Think} alt="Think" className="w-[50px] h-[50px] text-gray-800" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Natural Language Processing (NLP)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ระบบวิเคราะห์ภาษาที่เข้าใจสไตล์และความต้องการของผู้ใช้
                  ก่อนแปลงข้อความเป็นภาพห้องในแบบที่ต้องการ
                </p>
              </div>
            </div>

            <div className="hover:scale-105 duration-300 flex items-start space-x-4 bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Image src={Ml} alt="Ml" className="w-[50px] h-[50px] text-gray-800" />
              </div>
              <div>
                <h3 className="font-bold text-lg">3D Rendering Engine</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  เรนเดอร์ภาพสามมิติแบบเรียลไทม์ ให้ภาพที่สมจริงด้วยแสง เงา
                  และพื้นผิวเสมือนจริง
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8 md:p-10 flex flex-col justify-center hover:shadow-lg hover:scale-105 duration-300">
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="p-4 rounded-2xl mb-3">
                <Image src={Paint} alt="Paint" className="w-[80px] h-[80px]" width={100} height={100}/>
              </div>
              <h3 className="font-bold text-2xl text-gray-800">AI Design Process</h3>
            </div>
            <ul className="text-gray-700 text-lg leading-relaxed space-y-2">
              <li>1. วิเคราะห์คำสั่งจากข้อความ</li>
              <li>2. สร้างสไตล์และโครงร่างของห้อง</li>
              <li>3. แสดงภาพสามมิติสมจริง</li>
              <li>4. ปรับแต่งได้แบบเรียลไทม์</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}