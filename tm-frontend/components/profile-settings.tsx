"use client"

import { useEffect, useState } from "react";

const ProfileSettings = ({isEditing, setIsEditing}: {isEditing: boolean, setIsEditing: (val: boolean) => void}) => {

  const [name, setName] = useState("John Doe");
  const [username, setUsername] = useState("johndoe");
  const [bio, setBio] = useState("Product Designer");

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

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
    <div className="animate-in fade-in slide-in-from-bottom-2 relative rounded-lg border border-neutral-700 bg-neutral-900/70 p-6 transition-all duration-300">
      <h2 className="mb-5 text-lg font-semibold text-neutral-100">
        Profile Settings
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-400">
            Name
          </label>
          <input
            type="text"
            value={name}
            disabled={!isEditing}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-md border px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 transition-all duration-200 focus:outline-none ${
              isEditing
                ? "border-neutral-700 bg-neutral-800 hover:border-neutral-600 focus:ring-2 focus:ring-blue-500/60"
                : "cursor-not-allowed border-neutral-800 bg-neutral-900 opacity-60"
            } `}
          />
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-neutral-400">
            Username
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={username}
              disabled={!isEditing}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsUsernameChecked(false);
                setIsUsernameAvailable(false);
              }}
              className={`w-full rounded-md border px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 transition-all duration-200 focus:outline-none ${
                isEditing
                  ? "border-neutral-700 bg-neutral-800 hover:border-neutral-600 focus:ring-2 focus:ring-blue-500/60"
                  : "cursor-not-allowed border-neutral-800 bg-neutral-900 opacity-60"
              } `}
            />

            {isEditing && (
              <button
                type="button"
                onClick={checkUsernameAvailability}
                disabled={isUsernameChecked}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isUsernameChecked
                    ? "cursor-not-allowed bg-emerald-600/90 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                } `}
              >
                {isUsernameChecked ? "Checked" : "Check"}
              </button>
            )}
          </div>

          {/* Error message */}
          <div className="min-h-5">
            {isUsernameChecked && !isUsernameAvailable && (
              <p className="animate-in fade-in slide-in-from-top-1 text-xs text-red-400">
                Username is already taken.
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1 sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-400">
            Bio
          </label>
          <textarea
            value={bio}
            disabled={!isEditing}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className={`w-full resize-none rounded-md border px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 transition-all duration-200 focus:outline-none ${
              isEditing
                ? "border-neutral-700 bg-neutral-800 hover:border-neutral-600 focus:ring-2 focus:ring-blue-500/60"
                : "cursor-not-allowed border-neutral-800 bg-neutral-900 opacity-60"
            } `}
          />
        </div>
      </div>

      {/* Save */}
      {isEditing && isUsernameAvailable && (
        <div className="animate-in fade-in slide-in-from-bottom-2 mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-semibold text-neutral-900 transition-all duration-200 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
