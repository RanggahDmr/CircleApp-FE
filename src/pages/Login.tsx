/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/login
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, loadUser } from "@/features/auth/authSlice"; // ⬅️ tambahin loadUser
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const handleFormLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // ⬇️ Login user
      const data = await dispatch(loginUser(form)).unwrap();
      console.log("Login success:", data);

      // ⬇️ Setelah login sukses, langsung fetch data user lengkap dari /profile/me
      await dispatch(loadUser());

      // ⬇️ Redirect ke halaman utama
      navigate("/threads");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f0f0f] text-white">
      <Card className="w-[380px] bg-[#1a1a1a] border-none shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-green-500 flex">circle</span>
          </h1>
          <CardTitle className="text-lg text-white">Login to Circle</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleFormLoginSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Email or username*"
              type="text"
              value={form.identifier}
              onChange={(e) =>
                setForm({ ...form, identifier: e.target.value })
              }
              className="bg-[#121212] border border-gray-700 focus:border-green-500 focus:ring-green-500 text-white"
            />
            <Input
              placeholder="Password *"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="bg-[#121212] border border-gray-700 focus:border-green-500 focus:ring-green-500 text-white"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
              <a href="#" className="text-xs text-gray-400 hover:text-green-500">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full"
            >
              Login
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don’t have an account yet?{" "}
            <a href="/register" className="text-green-500 hover:underline">
              Create account
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
