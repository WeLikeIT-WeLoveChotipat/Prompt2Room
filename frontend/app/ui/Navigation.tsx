"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/ui/Logo";
import StatusBadge from "@/app/ui/Status"

type UserProfile = {
  avatar_url: string;
  full_name: string;
} | null;

type ApiStatus = "loading" | "ok" | "error"

type NavigationProps = {
  apiStatus?: ApiStatus;
  apiMessage?: string
};

export default function Navigation({
  apiStatus = "loading",
  apiMessage = "Loading...",
}: NavigationProps) {

  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [localStatus, setLocalStatus] = useState<ApiStatus>(apiStatus);
  const [localMessage, setLocalMessage] = useState(apiMessage);

  const fetchUserProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setIsLoggedIn(true);

      const avatar =
        user.user_metadata?.avatar_url ??
        "https://placehold.co/64x64?text=U";

      const fullName =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "User";

      setUserProfile({
        avatar_url: avatar,
        full_name: fullName,
      });
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    setLocalStatus(apiStatus);
    setLocalMessage(apiMessage);
  }, [apiStatus, apiMessage]);

  useEffect(() => {
    if (apiStatus === "loading" && apiMessage === "Loading...") {
      const checkServer = async () => {
        try {
          const res = await fetch(
            process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"
          );
          if (res.ok) {
            setLocalStatus("ok")
            setLocalMessage("ปกติสุดแลัว")
          } else {
            setLocalStatus("error")
            setLocalMessage("ตูมมมมมมม")
          }
        } catch {
          setLocalStatus("error")
          setLocalMessage("API AI มีปัญหา")
        }
      };
      checkServer();
    }
  }, [apiStatus, apiMessage]);

  useEffect(() => {
    fetchUserProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUserProfile();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserProfile(null);
    router.replace("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md font-kanit">
      <div className="px-[5%] mx-auto h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <StatusBadge status={localStatus} message={localMessage} />

          <Link
            href="/main"
            className="text-foreground hover:scale-105 hover:bg-blue-300 px-2 rounded-xl duration-500 transition-colors font-medium"
          >
            Generate
          </Link>
          <Link
            href="/gallery"
            className="text-foreground hover:scale-105 hover:bg-blue-300 px-2 rounded-xl duration-500 transition-colors font-medium"
          >
            Gallery
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:scale-105 hover:bg-blue-300 px-2 rounded-xl duration-500 transition-colors font-medium"
          >
            About
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="relative inline-flex items-center gap-3 cursor-pointer group rounded-lg px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              title="Logout"
            >
              <div className="flex items-center gap-3 transition-opacity duration-150 group-hover:opacity-0">
                {userProfile?.avatar_url ? (
                  <Image
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <span className="text-sm">
                  {userProfile?.full_name || "User"}
                </span>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-xl font-semibold shadow-md text-white bg-gradient-to-r from-blue-500 to-blue-600 scale-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center px-6">
                Logout
              </div>
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="py-2 px-6 rounded-xl font-semibold transition-all duration-300 shadow-md text-white bg-gradient-to-r from-blue-500 to-blue-500 hover:shadow-lg hover:from-blue-500 hover:to-blue-600 hover:scale-105"
            >
              Sign in
            </button>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <StatusBadge status={localStatus} message={localMessage} />


          <button
            onClick={() => setIsMenuOpen((p) => !p)}
            className="p-2 rounded-md transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-sm">
          <div className="px-4 py-3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              {userProfile?.avatar_url ? (
                <Image
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              <span className="text-sm">{userProfile?.full_name || "User"}</span>
            </div>

            <Link
              href="/main"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 text-gray-800"
            >
              Generate
            </Link>
            <Link
              href="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 text-gray-800"
            >
              Gallery
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 text-gray-800"
            >
              About
            </Link>

            {isLoggedIn ? (
              <button
                onClick={async () => {
                  await handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="mt-2 py-2 text-left text-red-500 font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/login");
                  setIsMenuOpen(false);
                }}
                className="mt-2 py-2 text-left text-blue-500 font-medium"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
