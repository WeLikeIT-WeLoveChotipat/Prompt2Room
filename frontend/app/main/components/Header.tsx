import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

type UserProfile = {
  avatar_url: string;
  full_name: string;
} | null;

export default function Header() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url, full_name")
          .eq("id", user.id)
          .single();

        if (data) {
          setUserProfile(data);
        } else if (user.user_metadata?.avatar_url) {
          setUserProfile({
            avatar_url: user.user_metadata.avatar_url,
            full_name: user.user_metadata.full_name || user.email?.split("@")[0] || "User"
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleSignOut = () => {
    supabase.auth.signOut().then(() => router.replace("/login"));
  };

  return (
    <header className="text-black px-6 py-4 flex justify-between items-center">

      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          <span className="text-blue-500">P</span>
          <span className="text-gray-800">2</span>
          <span className="text-orange-500">R</span>
        </h1>
      </div>

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
          <span className="text-sm">{userProfile?.full_name || "User"}</span>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-gray-700 text-white text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Logout
        </div>
      </button>


    </header>
  );
}
