import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { fetchFollowers, fetchFollowing, followUser, unfollowUser } from "@/features/follow/followSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";

export default function FollowsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("type") as "followers" | "following") || "followers";

  const dispatch = useAppDispatch();
  const { followers, following, loading } = useAppSelector((s) => s.follow);
  const authUser = useAppSelector((s) => s.auth.user);

  // Fetch sesuai query param
  useEffect(() => {
    if (!authUser) return;
    if (tab === "followers") {
      dispatch(fetchFollowers(authUser.id));
    } else {
      dispatch(fetchFollowing(authUser.id));
    }
  }, [dispatch, tab, authUser]);

  const list = tab === "followers" ? followers : following;

  return (
    <div className="grid grid-cols-12 min-h-screen bg-black text-white">
    {/* Sidebar kiri */}
    <div className="hidden md:col-span-3 lg:col-span-2 md:flex">
      <Sidebar />
    </div>

    {/* Konten utama */}
    <main className="col-span-12 md:col-span-6 lg:col-span-7 border-x border-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Follows</h2>

        {/* Tab switch pakai query param */}
        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => setSearchParams({ type: "followers" })}
            className={`flex-1 text-center py-2 ${
              tab === "followers"
                ? "border-b-2 border-green-500 font-bold"
                : "text-gray-400"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setSearchParams({ type: "following" })}
            className={`flex-1 text-center py-2 ${
              tab === "following"
                ? "border-b-2 border-green-500 font-bold"
                : "text-gray-400"
            }`}
          >
            Following
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {/* List user */}
        <div className="space-y-3">
        {list.map((u) => (
            <Card key={u.id} className="bg-[#1a1a1a] border-none text-white">
                <CardContent className="flex items-center justify-between py-3">
                {/* Info User */}
                <div className="flex items-center gap-3">
                    <img
                    src={u.photo_profile || `https://i.pravatar.cc/50?u=${u.username}`}
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                    <p className="font-bold">{u.full_name}</p>
                    <p className="text-gray-400 text-sm">@{u.username}</p>
                    </div>
                </div>

               
                <Button
                    size="sm"
                    className={`rounded-full transition-all ${
                    u.isFollowedByMe
                        ? "bg-gray-600/60 text-white hover:opacity-80"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                    onClick={() => {
                    if (u.isFollowedByMe) {
                        dispatch(unfollowUser(u.id));
                    } else {
                        dispatch(followUser(u.id));
                    }
                    }}
                >
                    {u.isFollowedByMe ? "Following" : "Follow"}
                </Button>
                </CardContent>
            </Card>
            ))}
          
        </div>
        
      </main>

    {/* Sidebar kanan */}
    <aside className="hidden md:col-span-3 lg:col-span-3 md:flex">
      <RightSidebar />
    </aside>
  </div>
  );
}





