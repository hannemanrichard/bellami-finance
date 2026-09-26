"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // Private browsing can block service workers. The page still works online.
      }
    };

    void registerServiceWorker();
  }, []);

  return null;
};
