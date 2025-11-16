import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import threadReducer, { updateLikeRealtime, addThread } from "@/features/thread/threadSlice";
import { socket } from "@/lib/socket";
import followReducer from "@/features/follow/followSlice";
import userReducer from "@/features/user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadReducer,
    follow: followReducer,
    users: userReducer,
  },
});

socket.on("thread:new", (newThread) => {
  store.dispatch(addThread(newThread));
});

socket.on("thread:like", (data) => {
  store.dispatch(updateLikeRealtime(data));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
