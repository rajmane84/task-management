import { getInitials } from "@/lib/get-initials";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { AvatarModal } from "./models/avatar-model";

type AvatarProps = {
  avatarUrl?: string;
  name: string;
};

export const Avatar = ({ avatarUrl, name }: AvatarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-emerald-400 text-2xl font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="Change avatar"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${name} avatar`}
            width={80}
            height={80}
            className="h-full w-full object-cover transition duration-300 group-hover:blur-[2px]"
          />
        ) : (
          <span className="select-none transition duration-300 group-hover:blur-[2px]">
            {getInitials(name)}
          </span>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/30 group-hover:opacity-100">
          <Pencil className="h-4 w-4 text-white" />
        </div>
      </button>
      {open && <AvatarModal onClose={() => setOpen(false)} />}
    </>
  );
};


export default Avatar;
