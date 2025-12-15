/* eslint-disable @typescript-eslint/no-explicit-any */
// features/auth/authSlice.tsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
type User = {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string | null;
  photo_profile?: string | null;
  followers_count: number;
  following_count: number;
};

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const savedUser = localStorage.getItem("user");
const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
};

// NEW: auto-load user dari token
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token found");

    try {
      const res = await fetch("http://localhost:3000/api/v1/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load user");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// existing thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { identifier, password }: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      localStorage.setItem("token", data.token);
      
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      if (!token) throw new Error("Token tidak ada");

      const res = await fetch("http://localhost:3000/api/v1/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal ambil profil");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      if (!token) throw new Error("Token tidak ada");

      const res = await fetch("http://localhost:3000/api/v1/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal ambil profil");
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async (
    updates: { full_name?: string; bio?: string; photo_profile?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const token = state.auth.token;
      if (!token) throw new Error("Token tidak ada");

      const res = await fetch(
        "http://localhost:3000/api/v1/auth/edit-profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal update profil");

      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
    },
    updateFollowersRealtime: (
      state,
      action: PayloadAction<{ userId: number; change: number }>
    ) => {
      if (state.user && state.user.id === action.payload.userId) {
        state.user.followers_count += action.payload.change;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token)
       
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // fetchMe
      .addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      })
      // editProfile
      .addCase(editProfile.fulfilled, (state, action: PayloadAction<User>) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
       
        }
      })
      .addCase(editProfile.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      })
      //  NEW: loadUser after refresh
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { logout, updateFollowersRealtime } = authSlice.actions;
export default authSlice.reducer;






