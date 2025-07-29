"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export type ProfileEditModalProps = {
  open: boolean;
  onClose: () => void;
  initialName: string;
  initialEmail: string;
  onProfileUpdated?: (newName: string) => void;
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  open,
  onClose,
  initialName,
  initialEmail,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(initialName || "");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialName || "");
  }, [initialName]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    const payload: { name?: string; password?: string; image?: string } = {
      name,
      password: password || undefined,
      image: image || undefined,
    };
    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to update profile");
    } else {
      setSuccess("Profile updated successfully");
      if (onProfileUpdated) onProfileUpdated(name);
      setPassword("");
      setImage("");
      setPreview("");
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-950/90 backdrop-blur-2xl rounded-2xl border border-gray-800/60 shadow-2xl overflow-hidden p-4 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="relative text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl border border-gray-800/60">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-400 via-gray-100 to-indigo-400 bg-clip-text text-transparent">
            Edit Profile
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-950/60 border border-red-900/60 text-red-400 px-4 py-3 rounded-xl mb-2">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-950/60 border border-green-900/60 text-green-400 px-4 py-3 rounded-xl mb-2">
              {success}
            </div>
          )}
          <div className="space-y-3">
            <label className="block text-gray-300 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={initialEmail || ""}
              readOnly
              className="w-full bg-gray-900/60 border border-gray-800/60 rounded-xl px-4 py-4 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-gray-300 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900/60 border border-gray-800/60 rounded-xl px-4 py-4 text-white"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-gray-300 text-sm font-medium">
              Profile Image{" "}
              <span className="text-gray-600 text-xs">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImage(reader.result as string);
                    setPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full bg-gray-900/60 border border-gray-800/60 rounded-xl px-4 py-2 text-white"
            />
            {preview && (
              <Image
                width={80}
                height={80}
                src={preview}
                alt="Preview"
                className="mt-2 rounded-xl w-20 h-20 object-cover border border-gray-800/60 mx-auto"
              />
            )}
          </div>
          <div className="space-y-3">
            <label className="block text-gray-300 text-sm font-medium">
              New Password{" "}
              <span className="text-gray-600 text-xs">(optional)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-gray-900/60 border border-gray-800/60 rounded-xl px-4 py-4 text-white"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-900/60 text-gray-300 py-2 rounded-xl font-medium border border-gray-800/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-2 rounded-xl font-medium"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
