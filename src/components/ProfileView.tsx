/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  user: any;
  isOwner?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
};

export default function ProfileView({ user, isOwner, isFollowing, onFollowToggle }: Props) {
  return (
    <Card className="bg-[#1a1a1a] border-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.photo_profile || `https://i.pravatar.cc/100?u=${user.username}`}
            alt={user.username}
            className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
            <p className="text-gray-400">@{user.username}</p>
            {user.bio && <p className="text-gray-300 mt-3">{user.bio}</p>}
            <div className="flex gap-4 mt-3 text-sm text-white">
              <span>
                <strong className="text-white">{user._count?.followers || 0}</strong> Followers
              </span>
              <span>
                <strong className="text-white">{user._count?.following || 0}</strong> Following
              </span>
              <span>
                <strong className="text-white">{user._count?.threads || 0}</strong> Threads
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6">
          {isOwner ? (
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">
              Edit Profile
            </Button>
          ) : (
           <Button
  onClick={onFollowToggle}
  className={`rounded-full px-6 font-medium transition ${
    isFollowing
      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
      : "bg-green-600 hover:bg-green-700 text-white"
  }`}
>
  {isFollowing ? "Following" : "Follow"}
</Button>

          )}
        </div>
      </CardContent>
    </Card>
  );
}
