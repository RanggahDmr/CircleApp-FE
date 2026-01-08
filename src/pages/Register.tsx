import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Register() {
  useAuth();
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await fetch("https://api-rangga-circle.liera.my.id/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Registration Success.");
      setForm({ username: "", full_name: "", email: "", password: "" }); // reset form
    } else {
      setError(data.message || "Registration failed");
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    setError(err.message);
  }
};




  return (
   <div className="flex items-center justify-center h-screen bg-[#0f0f0f] text-white">
  <Card className="w-[380px] bg-[#1a1a1a] border-none shadow-lg">
    <CardHeader className="space-y-1 text-center">
      <h1 className="text-2xl font-bold">
        <span className="flex text-green-500">circle</span>
      </h1>
      <CardTitle className="flex text-lg text-white">Create your account</CardTitle>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Username *"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="bg-[#121212] border border-gray-700 focus:border-green-500 focus:ring-green-500 text-white placeholder-gray-400"
        />
        <Input
          placeholder="Full Name *"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="bg-[#121212] border border-gray-700 focus:border-green-500 focus:ring-green-500 text-white placeholder-gray-400"
        />
        <Input
          placeholder="Email *"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-[#121212] border border-gray-700 focus:border-green-500 focus:ring-green-500 text-white placeholder-gray-400"
        />
        <Input
          placeholder="Password *"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="bg-[#121212] border border-gray-700 focus:border-green-500 focus:ring-green-500 text-white placeholder-gray-400"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <Button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full"
        >
          Register
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <a href="/" className="text-green-500 hover:underline">
          Login
        </a>
      </p>
    </CardContent>
  </Card>
</div>

  );
}
