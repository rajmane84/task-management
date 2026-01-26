"use client"
import { useState } from "react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    alert("Profile changes saved (dummy action)");
    setIsEditing(false);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-2xl font-semibold text-neutral-900">
            JD
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-semibold text-neutral-100">
              John Doe
            </h1>
            <p className="text-sm text-neutral-400">
              john.doe@email.com
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md bg-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-600 transition"
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
            className="rounded-lg bg-neutral-900/70 border border-neutral-700 p-5"
          >
            <p className="text-sm text-neutral-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Profile Settings */}
      <div className="rounded-lg bg-neutral-900/70 border border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-neutral-100 mb-4">
          Profile Settings
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              disabled={!isEditing}
              className={`w-full rounded-md px-3 py-2 text-neutral-100 placeholder-neutral-500 border
                ${isEditing
                  ? "bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-blue-500"
                  : "bg-neutral-900 border-neutral-800 cursor-not-allowed opacity-60"}
              `}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="john.doe@email.com"
              disabled={!isEditing}
              className={`w-full rounded-md px-3 py-2 text-neutral-100 placeholder-neutral-500 border
                ${isEditing
                  ? "bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-blue-500"
                  : "bg-neutral-900 border-neutral-800 cursor-not-allowed opacity-60"}
              `}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Role
            </label>
            <input
              type="text"
              defaultValue="Product Designer"
              disabled={!isEditing}
              className={`w-full rounded-md px-3 py-2 text-neutral-100 placeholder-neutral-500 border
                ${isEditing
                  ? "bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-blue-500"
                  : "bg-neutral-900 border-neutral-800 cursor-not-allowed opacity-60"}
              `}
            />
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1">
              Timezone
            </label>
            <select
              disabled={!isEditing}
              className={`w-full rounded-md px-3 py-2 text-neutral-100 border
                ${isEditing
                  ? "bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-blue-500"
                  : "bg-neutral-900 border-neutral-800 cursor-not-allowed opacity-60"}
              `}
            >
              <option>UTC −05:00</option>
              <option>UTC +00:00</option>
              <option>UTC +05:30</option>
            </select>
          </div>
        </div>

        {/* Save */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-medium text-neutral-900 hover:bg-emerald-400 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 transition">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;