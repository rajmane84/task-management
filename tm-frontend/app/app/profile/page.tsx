"use client";
import { useState, useEffect } from "react";
import { CheckIcon } from "lucide-react";
import DeleteAccount from "@/components/delete-account";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Fields
  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [bio, setBio] = useState("Product Designer");
  const email = "johndoe@example.com";

  // Username availability state
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  // Dummy username check (simulate API call)
  useEffect(() => {
    if (!isEditing) return;
    // For demo: usernames 'admin' or 'test' are unavailable
    const unavailableUsernames = ["admin", "test"];
    setIsUsernameAvailable(
      !unavailableUsernames.includes(username.toLowerCase()),
    );
  }, [username, isEditing]);

  const handleSave = () => {
    alert("Profile changes saved (dummy action)");
    setIsEditing(false);
  };

  const checkUsernameAvailability = () => {
    // Dummy unavailable usernames
    const unavailable = ["admin", "test"];

    setIsUsernameChecked(true);

    setTimeout(() => {
      setIsUsernameAvailable(!unavailable.includes(username.toLowerCase()));
    }, 500); // simulate API delay
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-emerald-400 text-2xl font-semibold text-neutral-900">
            JD
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-semibold text-neutral-100">{name}</h1>
            <p className="text-sm text-neutral-400">{email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
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
      <div className="rounded-lg border border-neutral-700 bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-100">
          Profile Settings
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Name</label>
            <input
              type="text"
              value={name}
              disabled={!isEditing}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 text-neutral-100 placeholder-neutral-500 ${
                isEditing
                  ? "border-neutral-700 bg-neutral-800 focus:ring-2 focus:ring-blue-500"
                  : "cursor-not-allowed border-neutral-800 bg-neutral-900 opacity-60"
              } `}
            />
          </div>

          {/* Username */}
          {/* TODO: Improve the animation */}
          <div>
            <label className="mb-1 block text-sm text-neutral-400">
              Username
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={username}
                disabled={!isEditing}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsUsernameChecked(false); // reset check on change
                  setIsUsernameAvailable(false);
                }}
                className={`w-full rounded-md border px-3 py-2 text-neutral-100 placeholder-neutral-500 ${
                  isEditing
                    ? "border-neutral-700 bg-neutral-800 focus:ring-2 focus:ring-blue-500"
                    : "cursor-not-allowed border-neutral-800 bg-neutral-900 opacity-60"
                } `}
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={checkUsernameAvailability}
                  disabled={isUsernameChecked}
                  className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                    isUsernameChecked
                      ? "cursor-not-allowed bg-green-600 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-400"
                  } `}
                >
                  {isUsernameChecked ? "Checked" : "Check Availability"}
                </button>
              )}
            </div>

            {/* Error message */}
            {isUsernameChecked && !isUsernameAvailable && (
              <p className="mt-1 text-sm text-red-400">
                Username is already taken.
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-neutral-400">Bio</label>
            <textarea
              value={bio}
              disabled={!isEditing}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className={`w-full resize-none rounded-md border px-3 py-2 text-neutral-100 placeholder-neutral-500 ${
                isEditing
                  ? "border-neutral-700 bg-neutral-800 focus:ring-2 focus:ring-blue-500"
                  : "cursor-not-allowed border-neutral-800 bg-neutral-900 opacity-60"
              } `}
            />
          </div>
        </div>

        {/* Save */}
        {isEditing && isUsernameAvailable && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-medium text-neutral-900 transition hover:bg-emerald-400"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <DeleteAccount />
    </div>
  );
};

export default ProfilePage;
