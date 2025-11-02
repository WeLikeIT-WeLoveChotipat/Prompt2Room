'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [booting, setBooting] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigatedRef = useRef(false)
  const navigateOnce = (path: string) => {
    if (navigatedRef.current) return
    navigatedRef.current = true
    router.replace(path)
  }

  useEffect(() => {
    let mounted = true

      ; (async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session) {
          navigateOnce('/main')
          return
        }

        setBooting(false)

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
          if (sess && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            navigateOnce('/main')
          }
        })
        return () => subscription.unsubscribe()
      })()

    return () => { mounted = false }
  }, [])

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined'
            ? window.location.origin + '/login'
            : undefined,
        },
      })
      if (error) throw error

    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google')
      setIsLoading(false)
    }
  }

  if (booting) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">

      <div className="relative z-20 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="text-blue-500">P</span>
              <span className="text-gray-800">2</span>
              <span className="text-orange-500">R</span>
            </h1>
          </div>

          <p className="text-center text-gray-600 text-base leading-relaxed">
            Continue creating your perfect room with Prompt2Room.
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-600 text-sm font-medium">Sign in</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-white border border-gray-200 rounded-xl font-medium text-gray-900 hover:bg-gray-50 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{isLoading ? 'กำลังนำไปยัง Google…' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
