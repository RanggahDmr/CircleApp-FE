/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { fetchUserThreads } from "@/features/thread/threadSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { fetchFollowing } from "@/features/follow/followSlice";


export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const { followersCount, followingCount } = useAppSelector((s) => s.follow);
  const { userThreads } = useAppSelector((s) => s.threads);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserThreads(user.id));
    }
    if (user?.id) dispatch(fetchFollowing(user.id));
  }, [user?.id, dispatch]);

  if (!user) return null;


  return (
<div className="grid grid-cols-12 min-h-screen bg-black text-white">
  {/* Sidebar kiri */}
  <div className="hidden md:col-span-3 lg:col-span-2 md:flex">
    <Sidebar />
  </div>

  {/* Konten utama – langsung penuh tanpa right sidebar */}
  <main className="col-span-12 md:col-span-9 lg:col-span-10 border-x border-gray-800 p-4">
    {/* Profile Card */}
    <Card className="bg-[#1a1a1a] border-none mb-6">
      <CardContent className="p-0">
        <div className="w-full h-20 bg-gradient-to-r from-yellow-400 to-green-400 rounded-t-lg" />

        <div className="relative px-6">
          <div className="flex items-center justify-between -mt-8">
            <img
              src={
                user.photo_profile ||
                `https://i.pravatar.cc/100?u=${user.username}`
              }
              alt="profile"
              className="w-30 h-30 rounded-full border-4 border-black"
            />
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-1 text-sm font-medium transition">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="px-6 pb-4 mt-2">
          <h4 className="text-white font-bold text-lg">
            {user.full_name || user.username}
          </h4>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          {user.bio && <p className="text-white mt-1">{user.bio}</p>}

          <div className="flex gap-6 mt-3 text-sm text-gray-400">
            <span>
              <strong className="text-white">{followersCount}</strong> Followers
            </span>
            <span>
              <strong className="text-white">{followingCount}</strong> Following
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Threads List */}
    <div className="space-y-3">
      {userThreads.map((thread: any) => (
        <Card
          key={thread.id}
          className="bg-[#1a1a1a] border border-gray-800 p-3"
        >
          <CardContent className="flex gap-3 p-0">
            <img
              src={
                thread.user.photo_profile ||
                `https://i.pravatar.cc/50?u=${thread.user.username}`
              }
              alt={thread.user.username}
              className="w-10 h-10 rounded-full"
            />

            <div className="flex-1">
              <p className="text-white font-bold">{thread.user.full_name}</p>
              <p className="text-gray-400 text-sm">@{thread.user.username}</p>
              <p className="text-white mt-2">{thread.content}</p>

              {thread.image && (
                <img
                  src={thread.image}
                  alt="thread"
                  className="mt-3 rounded-lg border border-gray-700 max-h-96 object-cover"
                />
              )}

              <div className="flex gap-6 mt-3 text-gray-400 text-sm">
                <button className="flex items-center gap-1 hover:text-blue-400">
                  <MessageCircle size={16} />
                  {thread.replies_count}
                </button>
                <button className="flex items-center gap-1 hover:text-pink-500">
                  <Heart
                    size={16}
                    fill={thread.likedByMe ? "red" : "none"}
                    className={thread.likedByMe ? "text-red-500" : ""}
                  />
                  {thread.likes_count}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </main>
</div>


  );
}
