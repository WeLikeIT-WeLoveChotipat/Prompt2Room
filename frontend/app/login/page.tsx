'use client'
// import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button 
        // onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  )
}


