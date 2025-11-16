import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { editProfile } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export default function EditProfile() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    bio: user?.bio || "",
    photo_profile: user?.photo_profile || ""
  });
  const [uploading, setUploading] = useState(false);

  // Upload ke Cloudinary (bisa juga ke BE kalau ada endpoint)
 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "circleapp_unsigned"); 
  data.append("folder", "circleapp/avatars"); 

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dk9eiz9me/image/upload",
    { method: "POST", body: data }
  );

  const result = await res.json();
  console.log("Cloudinary result:", result); // debug
  setForm((prev) => ({ ...prev, photo_profile: result.secure_url }));

  setUploading(false);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(editProfile(form));
    navigate("/home"); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <Card className="w-[400px] bg-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="text-white">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {form.photo_profile && (
                <img
                src={form.photo_profile}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
              
            )}
            <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 cursor-pointer text-green-500 hover:text-green-400"
            >
                <ImageIcon size={20} />
                <span className="text-sm">Upload Photo</span>
            </label>
            <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
      />   
                {/* {form.photo_profile && (
                  <img
                    src={form.photo_profile}
                    alt="preview"
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                )} */}

            <Input
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <Input
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />{uploading && (
             <p className="text-gray-400 text-sm mt-1">Uploading...</p>
             )}
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
       
    </div>
  );
}
