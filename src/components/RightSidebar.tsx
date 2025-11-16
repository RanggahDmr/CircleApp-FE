/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Globe, Linkedin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { socket } from "@/lib/socket";
import { updateFollowersRealtime } from "@/features/auth/authSlice";
import { fetchFollowCounts } from "@/features/follow/followSlice";

type SuggestedUser = {
  id: number;
  full_name: string;
  username: string;
  photo_profile?: string | null;
  isFollowedByMe?: boolean;
};

export default function RightSidebar() {
  const user = useAppSelector((s) => s.auth.user);
  const { followersCount, followingCount } = useAppSelector((s) => s.follow);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);

  // 🔹 Fetch counts saat mount
  useEffect(() => {
    if (user?.id) dispatch(fetchFollowCounts(user.id));
  }, [user?.id, dispatch]);

  // 🔹 Ambil data suggested user dari backend
  useEffect(() => {
    const fetchSuggested = async () => {
      if (!user?.id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/v1/users/suggested", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSuggested(data);
      } catch (err) {
        console.error("Error fetching suggested:", err);
      }
    };
    fetchSuggested();
  }, [user?.id]);

  // 🔹 Socket listener realtime follower update
  useEffect(() => {
    if (!user?.id) return;

    const handleFollowerUpdate = (data: any) => {
      dispatch(updateFollowersRealtime(data));
    };

    socket.on("followerUpdate", handleFollowerUpdate);

    return () => {
      socket.off("followerUpdate", handleFollowerUpdate);
    };
  }, [user?.id, dispatch]);

  // 🔹 Socket listener untuk refresh suggested list setelah follow
  useEffect(() => {
    if (!user?.id) return;

    const handleSuggestedRefresh = (data: any) => {
      if (data.followerId === user.id) {
        // hapus user yang baru di-follow dari suggested
        setSuggested((prev) =>
          prev.filter((u) => u.id !== data.followingId)
        );
      }
    };

    socket.on("fsuggested:refresh", handleSuggestedRefresh);

    return () => {
      socket.off("fsuggested:refresh", handleSuggestedRefresh);
    };
  }, [user?.id]);

  if (!user) return null;

  return (
    <aside className="lg:block col-span-4 pl-4 pr-4 w-full">
      <div className="sticky top-4 space-y-4 w-full">
        {/* === My Profile Card === */}
        <Card className="bg-[#1a1a1a] border-none">
          <CardContent className="p-4">
            <div className="relative">
              <div className="h-30 rounded-xl bg-gradient-to-r from-yellow-400 to-green-400" />

              <img
                src={
                  user.photo_profile ||
                  `https://i.pravatar.cc/100?u=${user.username}`
                }
                alt={user.username}
                className="absolute left-4 -bottom-6 w-20 h-20 rounded-full border-4 border-[#1a1a1a] object-cover"
              />

              <Button
                onClick={() => navigate("/edit-profile")}
                className="absolute right-3 top-xl -translate-y-1/2 rounded-full px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white"
              >
                Edit Profile
              </Button>
            </div>

            <div className="mt-8">
              <h4 className="text-white font-semibold leading-tight text-[16px]">
                {user.full_name}
              </h4>
              <p className="text-gray-400 text-sm">@{user.username}</p>
              {user.bio && <p className="text-gray-300 text-sm mt-3">{user.bio}</p>}

              <div className="flex items-center gap-4 mt-3 text-sm">
                <span>
                  <strong className="text-white">{followersCount}</strong>{" "}
                  <span className="text-gray-400">Following</span>
                </span>
                <span>
                  <strong className="text-white">{followingCount}</strong>{" "}
                  <span className="text-gray-400">followers</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* === Suggested Users === */}
        <Card className="bg-[#1a1a1a] border-none">
          <CardContent className="p-4">
            <h4 className="text-white font-semibold mb-3">Suggested for you</h4>
            <div className="space-y-2">
              {suggested.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-[#202020] transition"
                >
                  <div className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/user/${u.username}`)}
                  >
                    <img
                      src={
                        u.photo_profile ||
                        `https://i.pravatar.cc/80?u=${u.username}`
                      }
                      alt={u.username}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="leading-tight">
                      <p className="text-white text-sm font-medium">
                        {u.full_name}
                      </p>
                      <p className="text-gray-400 text-xs">@{u.username}</p>
                    </div>
                  </div>

                  <Button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                          `http://localhost:3000/api/v1/follow/${u.id}`,
                          {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        if (!res.ok) throw new Error("Failed to follow");
                        setSuggested((prev) => prev.filter((s) => s.id !== u.id));
                        socket.emit("fsuggested:refresh", {
                          followerId: user.id,
                          followingId: u.id,
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="rounded-full px-4 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* === Footer === */}
        <Card className="bg-[#1a1a1a] border-none">
          <CardContent className="p-4">
            <p className="text-gray-300 text-sm mb-2">
              Developed by <span className="font-medium text-white">RnggDmr</span>
            </p>
            <div className="flex items-center gap-3 text-gray-300">
              <a href="#" className="hover:text-white" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="#" className="hover:text-white" aria-label="GitHub">
                <Github size={16} />
              </a>
              <a href="#" className="hover:text-white" aria-label="Website">
                <Globe size={16} />
              </a>
            </div>
            <p className="text-[14px] text-gray-500 mt-3">
              Powered by <span className="text-white font-semibold">React</span> 
            </p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
