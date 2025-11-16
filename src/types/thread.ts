// src/types/thread.ts

export interface Thread  {
  id: number;
  content: string;
  image?: string | null;
  created_at: string;
  user: {
    id: number;
    username: string;
    full_name: string;
    photo_profile?: string | null;
  };
  likes_count?: number;
  replies_count?: number;
  likedByMe?: boolean;
};
