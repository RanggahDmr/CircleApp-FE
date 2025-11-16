/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAppDispatch } from "@/hooks/hook";
import { logout } from "@/features/auth/authSlice";
import { Home, Search, Users, UserRound, LogOut, PlusCircle } from "lucide-react";
import CreateThreadDialog from "@/components/CreateThreadDialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



const itemCls = ({ isActive }: { isActive: boolean }) =>
  `w-full justify-start rounded-full text-2xl ${
    isActive ? "bg-[#0f172a] text-white " : " text-gray-300 hover:bg-[#101010]"
  }`;

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  // const handleLogout = () => {
  //   const confirmLogout = window.confirm("Are you sure want to logoout?");
  //   if(confirmLogout){
  //     dispatch(logout())
  //     navigate("/", {replace: true})
  //   }
  //   dispatch(logout());
  //   navigate("/", { replace: true });
  // };

  return (
   <aside className="hidden md:flex md:col-span-2 flex-col border-r border-gray-800 bg-black w-full">
  {/* wrapper sticky */}
  <div className="sticky top-0 h-screen flex flex-col gap-2 p-6">
    <h1 className="text-4xl font-extrabold text-green-500 mb-2">Circle</h1>

  <Button asChild variant="ghost">
  <NavLink
    to="/threads"
   className={({ isActive }) => itemCls({ isActive })}
  >
    <Home className="mr-2 h-5 w-5" /> Home
  </NavLink>
</Button>

<Button asChild variant="ghost">
  <NavLink
    to="/search"
   className={({ isActive }) => itemCls({ isActive })}
  >
    <Search className="mr-2 h-5 w-5" /> Search
  </NavLink>
</Button>

<Button asChild variant="ghost">
  <NavLink
    to="/follows"
    className={({ isActive }) => itemCls({ isActive })}
  >
    <Users className="mr-2 h-5 w-5" /> Follows
  </NavLink>
</Button>

<Button asChild variant="ghost">
  <NavLink
    to="/profile"
    className={({ isActive }) => itemCls({ isActive })}
  >
    <UserRound className="mr-2 h-5 w-5" /> Profile
  </NavLink>
</Button>



    <Button
      className="bg-green-600 hover:bg-green-700 rounded-full mt-4"
      onClick={() => setOpenDialog(true)}
    >
      <PlusCircle className="mr-2 h-5 w-5" /> Create Post
    </Button>

    <CreateThreadDialog 
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    />

    <div className="mt-auto">
     <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      variant="ghost"
      className="w-full justify-start rounded-full text-red-400 hover:bg-white"
    >
      <LogOut className="mr-2 h-5 w-5" /> Logout
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent className="bg-black text-black border border-gray-700">
    <AlertDialogHeader>
      <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
      <AlertDialogDescription className="text-gray-400">
        Are you sure you want to log out? You’ll need to log in again to continue.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={() => {
          dispatch(logout());
          navigate("/", { replace: true });
        }}
        className="bg-red-600 hover:bg-red-700"
      >
        Yes, Logout
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>
  </div>
</aside>

  );
}


