//thread slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";


import type { Thread } from "@/types/thread";

type ThreadState = {
  threads: Thread[];
  userProfile: any | null;
  userThreads: Thread[];
  loading: boolean;
  error: string | null;
};

const initialState: ThreadState = {
  threads: [],
  userThreads: [],
  userProfile: null,
  loading: false,
  error: null,
};

export const toggleLike = createAsyncThunk<
  { threadId: number; liked: boolean },  // return type
  { threadId: number; liked: boolean },  // argumen
  { state: RootState }
>("threads/toggleLike", async ({ threadId, liked }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await fetch(
            `http://localhost:3000/api/v1/threads/${threadId}/${liked ? "unlike" : "like"}`,
      {
        method:liked ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Failed to toggle like");

    return { threadId, liked: !liked }; // balik state terbaru
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});


//  AsyncThunk untuk GET /threads
export const fetchThreads = createAsyncThunk<
  Thread[],         // return type
  void,             // argumen (tidak ada)
  { state: RootState }
>("threads/fetchThreads", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await fetch("http://localhost:3000/api/v1/threads", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch threads");
    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.threads)) return data.threads;

    return [];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});
//usetThread
// features/thread/threadSlice.ts
export const fetchUserProfile = createAsyncThunk(
  "threads/fetchUserProfile",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/profile/users/${userId}/profile`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchUserThreads = createAsyncThunk(
  "threads/fetchUserThreads",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/profile/users/${userId}/threads`);
      if (!res.ok) throw new Error("Failed to fetch user threads");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);




const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    //  Reducer tambahan buat realtime socket
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload); // prepend
    },
    updateLikeRealtime: (
  state,
  action: PayloadAction<{ threadId: number; userId: number; liked: boolean; change : number}>
) => {
  const { threadId, userId, liked, change } = action.payload;
  const thread = state.threads.find((t) => t.id === threadId);

   if (thread) {
    const currentUserId = Number(localStorage.getItem("userId"));

    // update count hanya kalau event dari user lain
    if (userId !== currentUserId) {
      thread.likes_count = Math.max(0, (thread.likes_count ?? 0) + change);
    }

    // optimistic update yang handle
    if (userId === currentUserId) {
      thread.likedByMe = liked;
    }
}
},
replyCountRealtime: (
  state,
  action: PayloadAction<{ threadId: number; change: number }>
) => {
  const { threadId, change } = action.payload;
  const thread = state.threads.find((t) => t.id === threadId);
  if (thread) {
    thread.replies_count = (thread.replies_count ?? 0) + change;
  }
},


  },
extraReducers: (builder) => {
  builder
    .addCase(fetchThreads.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchThreads.fulfilled, (state, action: PayloadAction<Thread[]>) => {
      state.loading = false;
      state.threads = action.payload;
    })
    .addCase(fetchThreads.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // ✅ User threads
    .addCase(fetchUserThreads.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserThreads.fulfilled, (state, action: PayloadAction<Thread[]>) => {
      state.loading = false;
      state.userThreads = action.payload;
    })
    .addCase(fetchUserThreads.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

    // ✅ Update like
    .addCase(toggleLike.fulfilled, (state, action) => {
      const { threadId, liked } = action.payload;

      // update global threads
      const threadGlobal = state.threads.find((t) => t.id === threadId);
      if (threadGlobal) {
        threadGlobal.likedByMe = liked;
      }

      // update user threads juga
      const threadUser = state.userThreads.find((t) => t.id === threadId);
      if (threadUser) {
        threadUser.likedByMe = liked;
      }
    });
}


  
});


export const { addThread, updateLikeRealtime } = threadSlice.actions;
export default threadSlice.reducer;

