import Image from "next/image";
import Lightbulb from "../../images/Lightbulb.svg";
import Group from "../../images/Group.svg";
import Heart from "../../images/Heart.svg";

const features = [
  {
    icon: Lightbulb,
    title: "นวัตกรรม",
    description:
      "เทคโนโลยี AI ที่ล้ำสมัยที่เข้าใจวิสัยทัศน์ของคุณ",
  },
  {
    icon: Group,
    title: "การเข้าถึง",
    description:
      "เครื่องมือออกแบบระดับมืออาชีพสำหรับทุกคน ทุกที่",
  },
  {
    icon: Heart,
    title: "ความชอบ",
    description:
      "มุ่งมั่นในการสร้างพื้นที่ที่ทั้งสวยงามและใช้งานได้จริง",
  },
];

export default function Innovation() {
  return (
    <section className="px-[15%] lg:px-[10%] xl:px-[15%] py-[5%] bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-float" />

      <div className="container mx-auto max-w-6xl relative">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-black mb-3">
            พลิกโฉมห้องของคุณด้วยนวัตกรรม <span className="text-blue-500">A</span><span className="text-orange-500">I</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-gray-600">
            พวกเรากำลังปฏิวัติวงการออกแบบตกแต่งภายในด้วยการทำให้การสร้างภาพจำลองห้องอย่างมืออาชีพเป็นสิ่งที่ทุกคนเข้าถึงได้ ผ่านพลังของปัญญาประดิษฐ์
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature, id) => (
          <div
            key={id}
            className="group bg-white rounded-2xl shadow-md border border-transparent hover:border-orange-300 hover:shadow-xl transition-all duration-500 p-8 flex flex-col items-center text-center shadow-lg"
          >
            <div className="p-8 text-center space-y-5">
              <div className={"w-30 h-30 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-10 transition-all duration-500 bg-[#FFF4ED]"}>
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