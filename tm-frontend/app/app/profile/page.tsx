"use client";
import { useState } from "react";
import DeleteAccount from "@/components/delete-account";
import { useUserStore } from "@/store/user.store";
import ProfileSettings from "@/components/profile-settings";
import Avatar from "@/components/avatar";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const user = useUserStore((state) => state.user);

  if (!user) return;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar avatarUrl={user.avatarUrl} name={user.name} />

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-semibold text-neutral-100">
              {user.name}
            </h1>
            <p className="text-sm text-neutral-400">{user.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md bg-neutral-700 px-4 py-2 text-sm text-neutral-200 transition hover:bg-neutral-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Tasks", value: "128" },
          { label: "Completed", value: "94" },
          { label: "Active Boards", value: "6" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-neutral-700 bg-neutral-900/70 p-5"
          >
            <p className="text-sm text-neutral-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Profile Settings */}
      <ProfileSettings isEditing={isEditing} setIsEditing={setIsEditing} />

      {/* Danger Zone */}
      <DeleteAccount />
    </div>
  );
};

export default ProfilePage;