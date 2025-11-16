import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { searchUsers } from "@/features/user/userSlice";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { followUser, unfollowUser } from "@/features/follow/followSlice";
import { toggleFollowState } from "@/features/user/userSlice";
import { useNavigate } from "react-router-dom";



export default function SearchPage() {
  const navigate = useNavigate();
const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const { searchResults, loading, error } = useAppSelector((s) => s.users);
const handleToggleFollow = async (userId: number, isFollowed: boolean) => {
  if (isFollowed) {
    await dispatch(unfollowUser(userId));
  } else {
    await dispatch(followUser(userId));
  }

  // update state UI agar tombol berubah langsung
  dispatch(toggleFollowState({ userId, isFollowed: !isFollowed }));
};

  // debounce pencarian
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length > 0) {
        dispatch(searchUsers(query));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [query, dispatch]);


  return (
    <div className="grid grid-cols-12 min-h-screen bg-black text-white">
      {/* Sidebar kiri */}
      <div className="hidden md:col-span-3 lg:col-span-2 md:flex">
        <Sidebar />
      </div>

      {/* Konten utama */}
      <main className="col-span-12 md:col-span-6 lg:col-span-7 border-x border-gray-800 p-4">
        <h1 className="text-xl font-bold mb-4">Search Users</h1>
        <Input
          placeholder="Search by name or username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 bg-[#1a1a1a] border-gray-700 text-white"
        />

       
        {loading && <p className="text-gray-400">Loading...</p>}

        
        {error && <p className="text-red-400">Failed to search users</p>}

        
        {!loading && query.trim().length > 0 && searchResults.length === 0 && !error && (
          <p className="text-gray-400">No users found.</p>
        )}

        {/* Hasil search */}
              <div className="space-y-2">
        {searchResults.map((user) => (
          <Card
            key={user.id}
            className="bg-[#1a1a1a] border border-gray-800 hover:bg-[#222] transition-colors"
          >
            <CardContent className="flex items-center justify-between p-3">
  {/* Kiri - info user */}
  <div className="flex items-center gap-3">
    <img
      src={
        user.photo_profile ||
        `https://i.pravatar.cc/100?u=${user.username}`
      }
      alt={user.username}
      className="w-12 h-12 rounded-full"
    />
    <div>
      <p className="font-bold text-white leading-tight">
        {user.full_name}
      </p>
      <p className="text-gray-400 text-sm">@{user.username}</p>
    </div>
  </div>

  {/* Kanan - tombol Visit & Follow bersebelahan */}
  <div className="flex items-center gap-2">
    <Button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/user/${user.username}`);
      }}
      className="rounded-full bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1"
    >
      Visit
    </Button>

    <Button
      size="sm"
      onClick={() => handleToggleFollow(user.id, user.isFollowedByMe)}
      className={
        user.isFollowedByMe
          ? "bg-gray-600/60 hover:bg-red-600"
          : "bg-green-600 hover:bg-green-700"
      }
    >
      {user.isFollowedByMe ? "Following" : "Follow"}
    </Button>
  </div>
</CardContent>

          </Card>
        ))}
      </div>

      </main>

      {/* RightSidebar kanan */}
      <div className="hidden md:col-span-3 lg:col-span-3 md:flex">
        <RightSidebar />
      </div>
    </div>
  );
}
