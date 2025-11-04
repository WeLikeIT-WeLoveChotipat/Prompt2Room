import React from "react";
export default function Footer() {
  return (
    <footer className="w-full drop-shadow-lg flex justify-between items-center px-[5%] py-3 bg-[#fafafa] text-sm border-t-1">
      <div>
        @ 2025 <span className="font-semibold">IT23, KMITL</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>
          Made by <span className="font-semibold">AumJi</span> |{" "}
          <span className="font-semibold">PeePong</span> |{" "}
          <span className="font-semibold">Newchang</span> |{" "}
          <span className="font-semibold">Fovy</span>
        </span>
        <span className="text-red-500 text-lg">❤️</span>
      </div>
    </footer>
  )
}