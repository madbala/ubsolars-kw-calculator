"use client";

import { useAdminGate } from "./AdminGateContext";

export default function AdminFab() {
  const { visible, openModal, unlockAndGoToAdmin } = useAdminGate();

  function handleClick() {
    if (visible) {
      unlockAndGoToAdmin();
      return;
    }
    openModal();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="admin-fab fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg ring-4 ring-white/80 transition active:scale-95 touch-manipulation hover:brightness-110 sm:h-[3.75rem] sm:w-[3.75rem]"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
      aria-label={visible ? "Open settings dashboard" : "Unlock admin dashboard"}
      title={visible ? "Dashboard" : "Team login"}
    >
      <svg
        className="h-6 w-6 sm:h-7 sm:w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </button>
  );
}
