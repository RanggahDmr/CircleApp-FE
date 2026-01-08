/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import ProfileView from "@/components/ProfileView";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Heart } from "lucide-react";
import { socket } from "@/lib/socket";
import { useAppSelector } from "@/hooks/hook";

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = useAppSelector((s) => s.auth.user);
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // === Fetch user profile ===
  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 🔹 1. Fetch data profil user
    const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProfile(data);

    // 🔹 2. Langsung cek status follow (setelah profile.id tersedia)
    const followCheckRes = await fetch(
      `https://api-rangga-circle.liera.my.id/api/v1/follow/check/${data.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (followCheckRes.ok) {
      const { isFollowed } = await followCheckRes.json();
      setIsFollowing(isFollowed);
    } else {
      setIsFollowing(false); // fallback
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
  }
};


  useEffect(() => {
    fetchProfile();
  }, [username]);

  // === Handle Follow / Unfollow ===
  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isFollowing ? "DELETE" : "POST";
      const url = `https://api-rangga-circle.liera.my.id/api/v1/follow/${profile.id}`;
      await fetch(url, { method, headers: { Authorization: `Bearer ${token}` } });

      // Emit socket update
      socket.emit("follow:updated", {
        followerId: currentUser?.id,
        followingId: profile.id,
        change: isFollowing ? -1 : +1,
      });

      // Update lokal UI
      setIsFollowing(!isFollowing);
      setProfile((prev: any) => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: prev._count.followers + (isFollowing ? -1 : +1),
        },
      }));
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };

  // === Socket listener untuk update followers realtime ===
  useEffect(() => {
    if (!currentUser?.id) return;

    const handleFollowUpdate = (data: any) => {
      if (data.followingId === profile?.id) {
        setProfile((prev: any) => ({
          ...prev,
          _count: {
            ...prev._count,
            followers: prev._count.followers + data.change,
          },
        }));
      }
    };

    socket.on("follow:updated", handleFollowUpdate);

    return () => {
      socket.off("follow:updated", handleFollowUpdate);
    };
  }, [profile, currentUser]);

  if (!profile) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="grid grid-cols-12 min-h-screen bg-black text-white">
      {/* === Sidebar kiri === */}
      <div className="col-span-2 border-r border-gray-800 sticky">
        <Sidebar />
      </div>

      {/* === Konten utama === */}
      <div className="col-span-6 p-6 space-y-6 ">
        {/* Reusable Profile View */}
        <ProfileView
          user={profile}
          isOwner={currentUser?.username === profile.username}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          
        />

        {/* === Thread List === */}
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Posts</h3>

          {profile?.threads?.length === 0 && (
            <p className="text-gray-400">No threads posted yet.</p>
          )}

          {profile?.threads?.map((thread: any) => (
            <Card key={thread.id} className="bg-[#1a1a1a] border-none">
              <CardContent className="p-4">
                {/* Header thread */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      thread.user.photo_profile ||
                      `https://i.pravatar.cc/80?u=${thread.user.username}`
                    }
                    alt={thread.user.username}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {thread.user.full_name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      @{thread.user.username}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-200">{thread.content}</p>
                {thread.image && (
                  <img
                    src={thread.image}
                    alt="thread"
                    className="rounded-lg mt-3 max-h-64 object-cover"
                  />
                )}

                {/* Footer buttons */}
                <div className="flex items-center gap-6 mt-3 text-gray-400 text-sm">
                  <button
                    onClick={() => navigate(`/thread/${thread.id}`)}
                    className="flex items-center gap-2 hover:text-green-500 transition"
                  >
                    <MessageCircle size={18} />
                    <span>{thread.number_of_replies || 0}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Heart size={18} />
                    <span>{thread.likes?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* === Right Sidebar === */}
      <div className="col-span-4 border-l border-gray-800 sticky">
        <RightSidebar />
      </div>
    </div>
  );
}
