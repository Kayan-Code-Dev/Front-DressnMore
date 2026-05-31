import { useSyncExternalStore } from "react";
import { storage } from "@/shared/lib/storage/storage";

import type { TenantSubscription } from "@/features/auth/types/auth.types";

const SESSION_STORAGE_KEY = "dressnmore.session";

export type SessionState = {
  token: string | null;
  workspace: string | null;
  tenant: unknown | null;
  user: unknown | null;
  permissions: string[];
  subscription: TenantSubscription | null;
};

export type SessionPayload = SessionState;

type SessionStoreShape = {
  getState: () => SessionState;
  setSession: (payload: SessionPayload) => void;
  clearSession: () => void;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: () => boolean;
  subscribe: (listener: () => void) => () => void;
};

const defaultState: SessionState = {
  token: null,
  workspace: null,
  tenant: null,
  user: null,
  permissions: [],
  subscription: null,
};

let state: SessionState = storage.get<SessionState>(SESSION_STORAGE_KEY, defaultState);
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) {
    listener();
  }
};

export const sessionStore: SessionStoreShape = {
  getState: () => state,

  setSession: (payload) => {
    state = {
      token: payload.token,
      workspace: payload.workspace,
      tenant: payload.tenant,
      user: payload.user,
      permissions: [...payload.permissions],
      subscription: payload.subscription,
    };
    storage.set(SESSION_STORAGE_KEY, state);
    emit();
  },

  clearSession: () => {
    state = { ...defaultState };
    storage.remove(SESSION_STORAGE_KEY);
    emit();
  },

  hasPermission: (permission) => {
    if (!permission) return true;
    return state.permissions.includes(permission);
  },

  isAuthenticated: () => state.token !== null,

  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useSession<T>(selector: (value: SessionState) => T): T {
  return useSyncExternalStore(
    sessionStore.subscribe,
    () => selector(sessionStore.getState()),
    () => selector(defaultState)
  );
}
