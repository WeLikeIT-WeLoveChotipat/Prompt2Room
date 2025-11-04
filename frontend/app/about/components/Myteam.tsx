import Image from "next/image";
import Aum from "../../images/Aumji.png"
import Pong from "../../images/Pong.jpg"
import New from "../../images/Newvy.jpg"
import Fo from "../../images/Fo.png"

export default function Myteam() {
  const teamMembers = [
    { name: "อั้มจิ", id: "it68070014", image: Aum },
    { name: "พีพง", id: "it68070111", image: Pong },
    { name: "นิวเยียร์", id: "it68070152", image: New },
    { name: "โฟวี่", id: "it68070166", image: Fo },
  ];

  return (
    <section className="bg-[#FFF6EF] py-20 font-kanit">
      <div className="max-w-7xl mx-auto text-center px-6">
        <h2 className="text-4xl font-extrabold text-black mb-4">
          พบกับทีมของเรา
        </h2>
        <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
          กลุ่มนักศึกษาที่มีความหลงใหลในการผสานเทคโนโลยีกับศิลปะการออกแบบ
          เพื่อสร้างประสบการณ์การตกแต่งภายในรูปแบบใหม่
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-md p-6 w-64 transition hover:border-orange-300 hover:shadow-xl"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden transform group-hover:scale-110 group-hover:rotate-10 transition-all duration-500">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="text-gray-700 text-xl font-medium mb-2 group-hover:text-orange-500 transition-colors">
                {member.name}
              </h3>
              <p className="text-gray-500">{member.id}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
