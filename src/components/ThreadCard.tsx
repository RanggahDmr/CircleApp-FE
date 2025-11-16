import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle } from "lucide-react";
import { useAppDispatch } from "@/hooks/hook";
import { toggleLike } from "@/features/thread/threadSlice";
import type { Thread } from "@/types/thread";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function ThreadCard({ thread }: { thread: Thread }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleToggleLike = () => {
    dispatch(toggleLike({ threadId: thread.id, liked: thread.likedByMe ?? false }));
  };
  function timeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // detik

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

  return (
    <Card className="bg-black border-b border-gray-800 rounded-none px-4 py-3 text-white">
      <CardContent className="flex gap-3 p-0">
        {/* Avatar */}
        <img
              src={
                thread.user.photo_profile
                  ? thread.user.photo_profile 
                  : `https://i.pravatar.cc/40?u=${thread.user.username}`
              }
              alt={thread.user.username}
              className="w-10 h-10 rounded-full object-cover"
/>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-200">
            {thread.user.full_name}{" "}
            <span className="text-gray-400">@{thread.user.username}</span>
            <span className="text-gray-500 text-xs ml-2">
            {timeAgo(thread.created_at)}
  </span>
          </p>

          <p className="text-sm text-gray-300 mt-1">{thread.content}</p>

          {thread.image && (
            <img
              src={thread.image}
              alt="thread"
              className="mt-3 rounded-lg border border-gray-700  max-h-[500px] max-w-[500px]"
            />
          )}

          {/* Actions */}
          <div className="flex gap-6 text-sm text-gray-400 mt-2">
            <Button
              onClick={handleToggleLike}
              className={`flex items-center gap-1 hover:text-red-500 ${
                thread.likedByMe ? "text-red-500" : ""
              }`}
            >
              <Heart size={16} /> {thread.likes_count}
            </Button >

            <button
    onClick={() => navigate(`/replies/${thread.id}`)}
    className="flex items-center gap-1 hover:text-blue-500"
  >
    <MessageCircle size={16} /> {thread.replies_count}
  </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
