"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { btnPrimary, inputClass, mutedText } from "@/lib/ui";
import { validateRequiredText } from "@/utils/validation";
import { useAdminGate } from "./AdminGateContext";

/** Pincode answers that unlock the admin tab for this session */
const SERVICE_PINCODES = ["612001", "612002", "612003"];

export default function AdminUnlockModal() {
  const { modalOpen, closeModal, unlockAndGoToAdmin } = useAdminGate();
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    setPincode("");
    setError("");
    setSuccess(false);
    const t = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(t);
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  if (!mounted || !modalOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const check = validateRequiredText(pincode, "Pincode", 6);
    if (!check.ok) {
      setError(check.message);
      return;
    }

    const normalized = pincode.trim();
    if (!/^\d{6}$/.test(normalized)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }

    if (SERVICE_PINCODES.includes(normalized)) {
      setSuccess(true);
      window.setTimeout(() => unlockAndGoToAdmin(), 600);
      return;
    }

    setError("Invalid pincode. Contact UB Solars if you need access.");
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={closeModal}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-[min(100%,22rem)] rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:max-w-md sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-md"
              aria-hidden
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold text-ink">
                Unlock dashboard
              </h2>
              <p className={`mt-0.5 ${mutedText}`}>
                UB Solars team only — enter your service pincode
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted touch-manipulation hover:bg-surface-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label htmlFor="admin-pincode" className="sr-only">
              Service pincode
            </label>
            <input
              ref={inputRef}
              id="admin-pincode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="off"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit pincode"
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm font-medium text-brand-dark">Unlocked — opening dashboard…</p>
          )}

          <button type="submit" className={btnPrimary} disabled={success}>
            Unlock
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
