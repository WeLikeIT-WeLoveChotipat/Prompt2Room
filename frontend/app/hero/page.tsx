'use client'
import Image from "next/image"
import heroImage from "../images/hero.svg"
import niggapong from "../images/blueniggapong49.svg"
import blackpong from "../images/blackpong.svg"
export default function HeroPage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-2/5 relative justify-center items-center text-center px-16 bg-white">
        <div className="absolute bottom-0 left-0 w-full inset-0 z-0 pointer-events-none">
          <Image
            height={2000}
            width={2000}
            src={blackpong}
            alt="blackpong"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-90"
          />
          <Image
            height={2000}
            width={2000}
            src={niggapong}
            alt="blue49"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-100 mix-blend-normal"
          />
        </div>
        <h1 className="text-8xl font-extrabold mt-30 z-10 drop-shadow-lg">
          <span className="text-blue-600">P</span>
          <span className="text-gray-900">2</span>
          <span className="text-orange-500">R</span>
        </h1>
        <h2 className="text-5xl font-semibold mt-15 text-gray-900 drop-shadow-md z-10">
          Design Your Dream <br />
          Room, Instantly.
        </h2>
        <p className="text-2xl text-gray-600 mt-8 max-w-md drop-shadow-sm z-10">
          Type your style, and let <span className="font-semibold">Prompt2Room</span> bring it to life.
        </p>
        <button
          className="relative z-10 bg-white text-black text-xl px-20 py-6 mt-10 rounded-full font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition transform duration-300"
          style={{
            boxShadow:
              "inset 0 3px 8px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          Get Started
        </button>
      </div>

      <div className="w-3/5">
        <Image
          height={2000}
          width={2000}
          src={heroImage}
          alt="Room Design"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}