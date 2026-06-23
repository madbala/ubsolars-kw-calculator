"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isAdminTabUnlocked, setAdminTabUnlocked } from "./adminUnlockSession";

type AdminGateContextValue = {
  visible: boolean;
  ready: boolean;
  unlock: () => void;
  lock: () => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  unlockAndGoToAdmin: () => void;
  goToAdminTick: number;
};

const AdminGateContext = createContext<AdminGateContextValue | null>(null);

export function AdminGateProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [goToAdminTick, setGoToAdminTick] = useState(0);

  useEffect(() => {
    setVisible(isAdminTabUnlocked());
    setReady(true);
  }, []);

  const unlock = useCallback(() => {
    setAdminTabUnlocked(true);
    setVisible(true);
  }, []);

  const lock = useCallback(() => {
    setAdminTabUnlocked(false);
    setVisible(false);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const unlockAndGoToAdmin = useCallback(() => {
    setAdminTabUnlocked(true);
    setVisible(true);
    setModalOpen(false);
    setGoToAdminTick((t) => t + 1);
  }, []);

  const value = useMemo(
    () => ({
      visible,
      ready,
      unlock,
      lock,
      modalOpen,
      openModal,
      closeModal,
      unlockAndGoToAdmin,
      goToAdminTick,
    }),
    [visible, ready, unlock, lock, modalOpen, openModal, closeModal, unlockAndGoToAdmin, goToAdminTick],
  );

  return <AdminGateContext.Provider value={value}>{children}</AdminGateContext.Provider>;
}

export function useAdminGate(): AdminGateContextValue {
  const ctx = useContext(AdminGateContext);
  if (!ctx) {
    throw new Error("useAdminGate must be used within AdminGateProvider");
  }
  return ctx;
}
