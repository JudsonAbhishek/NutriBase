"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((error: unknown) => {
        console.error("NutriBase service worker registration failed:", error);
      });
  }, []);

  return null;
}
