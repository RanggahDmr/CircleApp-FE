import { useEffect, useState } from "react";

type SuggestedUser = {
  id: number;
  username: string;
  full_name: string;
  photo_profile?: string | null;
};

export default function SuggestedUsers() {
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await fetch("https://api-rangga-circle.liera.my.id/api/v1/users/suggested", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSuggested(data);
      } catch (err) {
        console.error("Failed to fetch suggested users:", err);
      }
    };
    fetchSuggested();
  }, [token]);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white mb-2">Suggested for you</h2>
      {suggested.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.photo_profile || `https://i.pravatar.cc/100?u=${user.username}`}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">{user.full_name}</p>
              <p className="text-gray-400 text-sm">@{user.username}</p>
            </div>
          </div>
          <button className="bg-white text-black px-3 py-1 rounded-full text-sm hover:bg-gray-300">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}
