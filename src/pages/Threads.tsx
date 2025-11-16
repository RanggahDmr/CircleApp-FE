import { useEffect, useState } from "react";
import ThreadCard from "@/components/ThreadCard";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { fetchThreads, addThread, updateLikeRealtime } from "@/features/thread/threadSlice";
import Avatar from "@/components/Avatar";

export default function Threads() {
  const [newPost, setNewPost] = useState("");
  const dispatch = useAppDispatch();

  //  ambil threads dari Redux
  const threads = useAppSelector((state) => state.threads.threads);
  const user = useAppSelector((s) => s.auth.user);


  // Fetch awal threads
  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  // Listen realtime socket
  useEffect(() => {
  socket.on("thread:new", (newThread) => {
    dispatch(addThread(newThread));
  });

  socket.on("like:updated", ({ threadId, userId, liked, change }) => {
    dispatch(updateLikeRealtime({ threadId, userId, liked, change }));
  });

    return () => {
      socket.off("thread:new");
      socket.off("like:updated");
    };
  }, [dispatch]);

  return (
    <div className="grid grid-cols-12 min-h-screen bg-black text-white">
      {/* Sidebar kiri */}
      <div className="hidden md:col-span-3 lg:col-span-2 md:flex">
        <Sidebar />
      </div>

      {/* Konten utama */}
    <main className="col-span-12 md:col-span-6 lg:col-span-7 border-x border-gray-800 max-w-6xl">
        
        <div className="flex items-start gap-3 p-4 border-b border-gray-800">
  {/* Avatar */}
          <Avatar user={user} size={40} />

          <div className="flex-1">
            <Input
              placeholder="What is happening?!"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-black border-none text-white placeholder-gray-500"
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 rounded-full px-4"
              >
                Post
              </Button>
            </div>
          </div>
        </div>

        {/* Daftar threads */}
        <div>
          {threads.map((t) => (
            <ThreadCard key={t.id} thread={t} />
          ))}
        </div>
      </main>

      {/* Sidebar kanan */}
      <div className="hidden md:col-span-3 lg:col-span-3 md:flex flex:1">
        <RightSidebar 
        
        />
      </div>
    </div>
  );
}
