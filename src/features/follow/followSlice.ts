/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type User = {
  threads: any;
  id: number;
  username: string;
  full_name: string;
  photo_profile?: string | null;
  bio?: string | null;
  isFollowedByMe: boolean;
};

type FollowState = {
  followers: User[];
  following: User[];
  followersCount: number;
  followingCount: number;
  loading: boolean;
  error: string | null;
};

const initialState: FollowState = {
  followers: [],
  following: [],
  followersCount: 0,
  followingCount: 0,
  loading: false,
  error: null,
};

// 🔹 Fetch followers
export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/users/${userId}/followers`);
      if (!res.ok) throw new Error("Failed to fetch followers");
      return (await res.json()) as User[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Fetch following
export const fetchFollowing = createAsyncThunk(
  "follow/fetchFollowing",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/users/${userId}/following`);
      if (!res.ok) throw new Error("Failed to fetch following");
      return (await res.json()) as User[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Follow user
export const followUser = createAsyncThunk(
  "follow/followUser",
  async (userId: number, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/follow/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to follow");
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Unfollow user
export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (userId: number, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/follow/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to unfollow");
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Fetch follow counts
export const fetchFollowCounts = createAsyncThunk(
  "follow/fetchFollowCounts",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://api-rangga-circle.liera.my.id/api/v1/users/${userId}/follow-counts`);
      if (!res.ok) throw new Error("Failed to fetch follow counts");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


const followSlice = createSlice({
  name: "follow",
  initialState,
reducers: {
  addFollowing: (state, action: PayloadAction<User>) => {
    if (!state.following.some((f) => f.id === action.payload.id)) {
      state.following.push(action.payload);
    }
  },
  removeFollowing: (state, action: PayloadAction<number>) => {
    state.following = state.following.filter((u) => u.id !== action.payload);
  },

 
  updateFollowersRealtime: (
    state,
    action: PayloadAction<{
      followersCount: number;
      followingCount: number;
    }>
  ) => {
    state.followersCount = action.payload.followersCount;
    state.followingCount = action.payload.followingCount;
  },

  // 🔹 (Opsional) toggleFollowState kalau kamu mau update UI langsung tanpa tunggu socket
  toggleFollowState: (
    state,
    action: PayloadAction<{ userId: number; isFollowed: boolean }>
  ) => {
    const { userId, isFollowed } = action.payload;
    // Ubah status di list followers
    state.followers = state.followers.map((u) =>
      u.id === userId ? { ...u, isFollowedByMe: isFollowed } : u
    );
    // Update count lokal juga
    if (isFollowed) state.followingCount += 1;
    else if (state.followingCount > 0) state.followingCount -= 1;
    else state.followingCount -= 1;
  },
},

  extraReducers: (builder) => {
    builder
      // 🔸 Fetch followers
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.followers = action.payload;
        state.loading = false;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch followers";
      })

      // 🔸 Fetch following
      .addCase(fetchFollowing.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.following = action.payload;
      })

      // 🔸 Follow user
      .addCase(followUser.fulfilled, (state, action: PayloadAction<number>) => {
        const userId = action.payload;

        // followers list → tandai true
        state.followers = state.followers.map((u) =>
          u.id === userId ? { ...u, isFollowedByMe: true } : u
        );

        // following list → tambahkan kalau belum ada
        const target =
          state.followers.find((u) => u.id === userId) ||
          state.following.find((u) => u.id === userId);
        if (target && !state.following.some((f) => f.id === userId)) {
          state.following.push({ ...target, isFollowedByMe: true });
        }
      })

      // 🔸 Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action: PayloadAction<number>) => {
        const userId = action.payload;

        // followers list → ubah jadi false
        state.followers = state.followers.map((u) =>
          u.id === userId ? { ...u, isFollowedByMe: false } : u
        );

        // following list → hapus
        state.following = state.following.filter((u) => u.id !== userId);
      })

      // 🔸 Follow counts
      .addCase(fetchFollowCounts.fulfilled, (state, action) => {
        state.followersCount = action.payload.followers_count;
        state.followingCount = action.payload.following_count;
      });


  },
});

export const { addFollowing, removeFollowing,updateFollowersRealtime, toggleFollowState  } = followSlice.actions;
export default followSlice.reducer;
