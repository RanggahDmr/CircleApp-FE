/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const searchUsers = createAsyncThunk(
  "users/search",
  async (q: string, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/v1/users/search?q=${encodeURIComponent(q)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to search users");
      }

      const data = await res.json();

      // ✅ Ambil data following dari followSlice state Redux
      const state: any = getState();
      const followingIds =
        state.follow?.following?.map((f: any) => f.following_id || f.id) || [];

      // ✅ Gabungkan hasil search dengan status follow
      return data.map((user: any) => ({
        ...user,
        isFollowedByMe: followingIds.includes(user.id),
      }));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    searchResults: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    //  RealtimeFollowing Logic
    toggleFollowState: (state, action) => {
      const { userId, isFollowed } = action.payload;
      const user = state.searchResults.find((u) => u.id === userId);
      if (user) user.isFollowedByMe = isFollowed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleFollowState } = userSlice.actions;
export default userSlice.reducer;
