"use client";

import { useState, useRef, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  Link,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useBoardStore } from "@/store/board.store";
import { generateShareLink } from "@/services/share.service";
import { GenerateShareLinkPayload } from "@/helpers/share.helper";
import { AnimatePresence, motion } from "motion/react";

// Types

type Role = "editor" | "viewer";

interface CreatedLink {
  _id: string;
  token: string;
  role: Role;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  status: string;
}

// Constants

const ROLES: Role[] = ["editor", "viewer"];

const EXPIRY_OPTIONS = [
  { label: "Never", value: "never" },
  { label: "1 hour", value: "1h" },
  { label: "24 hours", value: "24h" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
] as const;

const MAX_USES_OPTIONS = [
  { label: "1 use", value: "1" },
  { label: "5 uses", value: "5" },
  { label: "10 uses", value: "10" },
  { label: "25 uses", value: "25" },
  { label: "Unlimited", value: "unlimited" },
] as const;

const EXPIRY_MS: Record<string, number> = {
  "1h": 1 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

// Helpers

function getExpiresAt(expiresIn: string): string | undefined {
  if (expiresIn === "never") return undefined;
  return new Date(Date.now() + EXPIRY_MS[expiresIn]).toISOString();
}

function parseMaxUses(value: string): number | null {
  return value === "unlimited" ? null : parseInt(value, 10);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Shared UI

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-8 text-sm text-neutral-800 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-neutral-400"
        />
      </div>
    </div>
  );
}

function LinkDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-3 py-2">
      <span className="text-neutral-400">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}

// Dropdown Sections

function DropdownHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
      <div className="flex items-center gap-2">
        <Link size={15} className="text-neutral-500" />
        <span className="text-sm font-semibold text-neutral-800">
          Share via link
        </span>
      </div>
      <button
        onClick={onClose}
        className="rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function CreateLinkForm({
  role,
  expiresIn,
  maxUses,
  loading,
  error,
  onRoleChange,
  onExpiresInChange,
  onMaxUsesChange,
  onSubmit,
}: {
  role: Role;
  expiresIn: string;
  maxUses: string;
  loading: boolean;
  error: string | null;
  onRoleChange: (role: Role) => void;
  onExpiresInChange: (value: string) => void;
  onMaxUsesChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4 p-4">
      {/* Role toggle */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
          Permission
        </label>
        <div className="flex overflow-hidden rounded-lg border border-neutral-200">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={cn(
                "flex-1 py-2 text-sm font-medium capitalize transition",
                role === r
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-50",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <SelectField
        label="Expires"
        value={expiresIn}
        options={EXPIRY_OPTIONS}
        onChange={onExpiresInChange}
      />

      <SelectField
        label="Max uses"
        value={maxUses}
        options={MAX_USES_OPTIONS}
        onChange={onMaxUsesChange}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500">
          {error}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Link size={15} />
            Generate link
          </>
        )}
      </button>
    </div>
  );
}

function CreatedLinkView({
  shareUrl,
  createdLink,
  copied,
  onCopy,
  onReset,
}: {
  shareUrl: string;
  createdLink: CreatedLink;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-4 p-4">
      {/* Copyable URL */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
          Shareable link
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
          <span className="flex-1 truncate font-mono text-xs text-neutral-600">
            {shareUrl}
          </span>
          <button
            onClick={onCopy}
            title="Copy link"
            className="shrink-0 rounded-md p-1 text-neutral-500 transition hover:bg-neutral-200"
          >
            {copied ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Link metadata */}
      <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-100 bg-neutral-50 text-xs text-neutral-600">
        <LinkDetailRow label="Permission" value={createdLink.role} />
        <LinkDetailRow
          label="Max uses"
          value={createdLink.maxUses?.toString() ?? "Unlimited"}
        />
        <LinkDetailRow
          label="Expires"
          value={
            createdLink.expiresAt ? formatDate(createdLink.expiresAt) : "Never"
          }
        />
      </div>

      <button
        onClick={onReset}
        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
      >
        Create another link
      </button>
    </div>
  );
}

// Main Component

export default function ShareButton() {
  const { board } = useBoardStore();
  const boardId = board?._id;

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("editor");
  const [expiresIn, setExpiresIn] = useState("never");
  const [maxUses, setMaxUses] = useState("5");
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<CreatedLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const resetForm = () => {
    setCreatedLink(null);
    setError(null);
    setCopied(false);
  };

  const handleOpen = () => {
    resetForm();
    setOpen((prev) => !prev);
  };

  const handleCreate = async () => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    const payload: GenerateShareLinkPayload = {
      targetId: boardId,
      role,
      expiresAt: getExpiresAt(expiresIn),
      maxUses: parseMaxUses(maxUses),
    };

    const response = await generateShareLink(payload);

    if (!response) {
      setError("Failed to generate share link");
      setLoading(false);
      return;
    }

    setCreatedLink(response.data.link ?? null);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = createdLink
    ? `${window.location.origin}/join/${createdLink.token}`
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="flex cursor-pointer items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            style={{ transformOrigin: "top right" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-neutral-200 bg-white shadow-xl"
          >
            <DropdownHeader onClose={() => setOpen(false)} />

            {createdLink ? (
              <CreatedLinkView
                shareUrl={shareUrl!}
                createdLink={createdLink}
                copied={copied}
                onCopy={handleCopy}
                onReset={resetForm}
              />
            ) : (
              <CreateLinkForm
                role={role}
                expiresIn={expiresIn}
                maxUses={maxUses}
                loading={loading}
                error={error}
                onRoleChange={setRole}
                onExpiresInChange={setExpiresIn}
                onMaxUsesChange={setMaxUses}
                onSubmit={handleCreate}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
