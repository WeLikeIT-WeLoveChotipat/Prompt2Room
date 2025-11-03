import Image from "next/image"
import brain from "../../images/brain.svg"
import light from "../../images/light.svg"
import lightning from "../../images/lightning.svg"

export default function WhyChooseSection() {
  return (
    <section className="py-20 text-center bg-white">
      <h2 className="text-6xl md:text-6xl font-bold mb-3">
        ทำไมต้องเลือก Prompt2Room?
      </h2>
      <p className="text-gray-500 mb-16 text-3xl">
        ผสานพลังของ AI กับจินตนาการ เพื่อให้การออกแบบห้องเป็นเรื่องง่ายสำหรับทุกคน
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-10 md:px-24">
        <div>
          <Image src={brain} alt="Brain" className="mx-auto mb-4 w-[200px] h-[200px]" />
          <h3 className="font-bold text-gray-700 text-2xl mb-2">
            ออกแบบด้วยพลังของ AI
          </h3>
          <p className="text-gray-500">
            AI เข้าใจสไตล์และจินตนาการของคุณ สร้างภาพห้องที่สมจริงและสวยงามได้ภายในไม่กี่วินาที
          </p>
        </div>

        <div>
          <Image src={light} alt="Design freedom" className="mx-auto mb-4 w-[200px] h-[200px]" />
          <h3 className="font-bold text-gray-700 text-2xl mb-2">
            ดีไซน์ได้ไม่จำกัดสไตล์
          </h3>
          <p className="text-gray-500">
            จากมินิมอลถึงโมเดิร์น หรือวินเทจ สำรวจดีไซน์ได้หลากหลายตามแรงบันดาลใจของคุณ
          </p>
        </div>

        <div>
          <Image src={lightning} alt="Fast results" className="mx-auto mb-4 w-[200px] h-[200px]" />
          <h3 className="font-bold text-gray-700 text-2xl mb-2">
            ได้ผลลัพธ์ทันที ไม่ต้องรอนาน
          </h3>
          <p className="text-gray-500">
            เพียงพิมพ์พรอมต์สั้น ๆ ก็ได้แบบห้องคุณภาพระดับมืออาชีพทันที โดยไม่ต้องใช้ซอฟต์แวร์ออกแบบ
          </p>
        </div>
      </div>
    </section>
  )
}