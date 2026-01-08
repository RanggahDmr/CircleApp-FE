import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { socket } from "@/lib/socket"

export default function CreateThreadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("content", content);
    if (file) formData.append("image", file);

    const res = await fetch("https://api-rangga-circle.liera.my.id/api/v1/threads", {
      method: "POST",
      headers: {
        Authorization : `Bearer ${token || ""}`,
      },
      body: formData,
    });

    if (res.ok) {
      const newThread = await res.json();

      socket.emit("thread:create", newThread);

      setContent("");
      setFile(null);
      onClose();

    } else {
      const errorMsg = await res.text();
      console.error("Failed to create thread:", errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] text-white">
        <DialogHeader>
          <DialogTitle>Create a Thread</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Textarea
            placeholder="What's happening?!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-black border border-gray-700"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="bg-black border border-gray-700"
            placeholder=""
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
