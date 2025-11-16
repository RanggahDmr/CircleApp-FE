import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Threads from "./pages/Threads";
import Replies from "./pages/Replies";
import EditProfile from "./pages/EditProfile";
import { AuthProvider } from "./context/AuthContext";
import FollowsPage from "./pages/FollowsPage";
import SearchPage from "./pages/searchPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import { useAppDispatch } from "./hooks/hook";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authSlice";

export default function App() {
  
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadUser())
  },[dispatch]); 
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(loadUser()); // ini fetch ke /profile/me
  }
}, [dispatch]);
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      

        {/* Protected */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/threads" element={<PrivateRoute><Threads /></PrivateRoute>} />
        <Route path="/replies/:id" element={<PrivateRoute><Replies /></PrivateRoute> } />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute> } />
        <Route path="/follows" element={<PrivateRoute><FollowsPage /></PrivateRoute> } />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute> } />
        <Route path="/user/:username" element={<UserProfilePage />} />
        

       
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
