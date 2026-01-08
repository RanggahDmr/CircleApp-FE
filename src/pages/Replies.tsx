/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Image as ImageIcon } from "lucide-react";
import { socket } from "@/lib/socket";
// import { useAppSelector } from "@/hooks/hook";

export default function Replies() {
  const { id } = useParams(); // id thread
  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  // const _user = useAppSelector((s) => s.auth.user);

  // 🔹 Fetch thread detail + replies (satu endpoint saja)
  useEffect(() => {
    const fetchThreadDetail = async () => {
      try {
        const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/threads/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch thread detail");
        const data = await res.json();
        setThread(data);
        setReplies(data.replies || []); // ambil langsung dari thread detail
      } catch (err) {
        console.error(err);
      }
    };
    fetchThreadDetail();
  }, [id]);

  // 🔹 Realtime update reply baru dari socket.io
  useEffect(() => {
    socket.on("reply:new", ({ threadId: replyThreadId, reply }) => {
      if (String(replyThreadId) === id) {
        setReplies((prev) => {
          if (prev.some((r) => r.id === reply.id)) return prev;
          return [reply, ...prev];
        });
      }
    });
    return () => {
      socket.off("reply:new");
    };
  }, [id]);

  // 🔹 Handle submit reply
  const handleSubmit = async () => {
    if (!content.trim() && !image) return;

    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/${id}/replies`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });

    if (res.ok) {
      setContent("");
      setImage(null);
    } else {
      console.error("Failed to post reply");
    }
  };

  return (
    <div className="grid grid-cols-12 min-h-screen bg-black text-white">
      {/* Sidebar kiri */}
      <div className="hidden md:col-span-3 lg:col-span-2 md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="col-span-12 md:col-span-6 lg:col-span-7 border-x border-gray-800 p-4">
        {/* Thread utama */}
        {thread && (
          <Card className="bg-black border-b border-gray-800 rounded-none px-4 py-3 text-white">
            <CardContent className="flex gap-3 p-0">
              <img
                src={
                  thread.user.photo_profile
                    ? thread.user.photo_profile
                    : `https://i.pravatar.cc/40?u=${thread.user.username}`
                }
                alt={thread.user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-200">
                  {thread.user.full_name}{" "}
                  <span className="text-gray-400">@{thread.user.username}</span>
                </p>
                <p className="text-sm text-gray-300 mt-1">{thread.content}</p>

                {thread.image && (
                  <img
                    src={thread.image}
                    alt="thread"
                    className="rounded-lg mt-2"
                  />
                )}

                <div className="flex gap-6 text-sm text-gray-400 mt-2">
                  <button className="flex items-center gap-1 hover:text-red-500">
                    <Heart size={16} /> {thread.likes_count ?? 0}
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} /> {thread.replies_count ?? 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input reply */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
          <label className="cursor-pointer text-gray-400 hover:text-blue-500">
            <ImageIcon size={20} />
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          <Input
            placeholder="Type your reply..."
            className="flex-1 bg-gray-900 border-gray-700 text-white"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleSubmit}>Reply</Button>
        </div>

        {/* List replies */}
        <div>
          {replies.map((reply) => (
            <Card
              key={reply.id}
              className="bg-black border-b border-gray-800 rounded-none px-4 py-3 text-white"
            >
              <CardContent className="flex gap-3 p-0">
                <img
                  src={
                    reply.user?.photo_profile
                      ? reply.user.photo_profile
                      : `https://i.pravatar.cc/40?u=${reply.user?.username}`
                  }
                  alt={reply.user?.username || "user"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-200">
                    {reply.user?.full_name}{" "}
                    <span className="text-gray-400">@{reply.user?.username}</span>
                  </p>
                  <p className="text-sm text-gray-300 mt-1">{reply.content}</p>

                  {reply.image && (
                    <img
                      src={reply.image}
                      alt="reply"
                      className="rounded-lg mt-2 max-w-sm"
                    />
                  )}

                  <div className="flex gap-6 text-sm text-gray-400 mt-2">
                    <button className="flex items-center gap-1 hover:text-red-500">
                      <Heart size={16} /> {reply.likes_count ?? 0}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(reply.created_at).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar kanan */}
      <div className="hidden md:col-span-3 lg:col-span-3 md:flex">
        <RightSidebar />
      </div>
    </div>
  );
}
