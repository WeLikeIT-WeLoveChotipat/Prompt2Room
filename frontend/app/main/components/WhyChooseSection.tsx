import Image from "next/image";
import brain from "../../images/brain.svg";
import light from "../../images/light.svg";
import lightning from "../../images/lightning.svg";

const features = [
  {
    icon: lightning,
    title: "สร้างแบบห้องคุณภาพระดับมืออาชีพได้ทันที",
    description:
      "เพียงพิมพ์พรอมต์สั้น ๆ ก็ได้ภาพสมจริง โดยไม่ต้องใช้ซอฟต์แวร์ออกแบบ",
  },
  {
    icon: brain,
    title: "ออกแบบด้วยพลังของ AI",
    description:
      "AI เข้าใจสไตล์และจินตนาการของคุณ สร้างภาพห้องที่สมจริงและสวยงามได้ภายในไม่กี่วินาที",
  },
  {
    icon: light,
    title: "ดีไซน์ได้ไม่จำกัดสไตล์",
    description:
      "จากมินิมอลถึงโมเดิร์น หรือวินเทจ สำรวจดีไซน์ได้หลากหลายตามแรงบันดาลใจของคุณ",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="px-[15%] lg:px-[10%] xl:px-[15%] py-[5%] bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-float" />

      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-black mb-3">
            ทำไมต้องเลือก <span className="text-blue-500">Prompt</span>2<span className="text-orange-500">Room</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-gray-600">
            แพลตฟอร์มที่ทำให้การออกแบบห้องเป็นเรื่องง่ายและสนุก
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature, id) => (
          <div
            key={id}
            className="group bg-white rounded-2xl shadow-md border border-transparent hover:border-orange-300 hover:shadow-xl transition-all duration-500 p-8 flex flex-col items-center text-center"
          >
            <div className="p-8 text-center space-y-5">
              <div
                className={"w-30 h-30 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-10 transition-all duration-500"}
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={100}
                  height={100}
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                {feature.title}
              </h3>

              <p className="text-base text-gray-600 transition-colors">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}