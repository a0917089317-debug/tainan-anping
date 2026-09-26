"use client";

import { useSyncExternalStore } from "react";

// The name is persisted to localStorage so the same browser isn't asked
// again on the next visit. "Skipped" is not persisted: a visitor who skipped
// is asked again on the next full page load.
const STORAGE_KEY = "visitor-name";

type Listener = () => void;
const listeners = new Set<Listener>();

let currentName: string | null = null;
let currentSkipped = false;
let loaded = false;

function getName() {
  if (!loaded) {
    loaded = true;
    try {
      currentName = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable (e.g. blocked site data); keep it in memory only.
    }
  }
  return currentName;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function noopSubscribe() {
  return () => {};
}

export function useVisitorName() {
  const name = useSyncExternalStore(
    subscribe,
    getName,
    () => null,
  );
  const skipped = useSyncExternalStore(
    subscribe,
    () => currentSkipped,
    () => false,
  );
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const saveName = (value: string) => {
    currentName = value;
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore; the name still applies for this page load.
    }
    notify();
  };

  const skipWelcome = () => {
    currentSkipped = true;
    notify();
  };

  return { name, ready, skipped, saveName, skipWelcome };
}
