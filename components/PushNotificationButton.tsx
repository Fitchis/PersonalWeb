// PushNotificationButton.tsx
// Komponen untuk subscribe dan test push notification

"use client";
import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationButton() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setSubscribed(!!sub);
      });
    }
  }, []);

  async function subscribe() {
    setLoading(true);
    setError(null);
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service worker not supported in this browser.");
      }
      const reg = await navigator.serviceWorker.ready;
      console.log("Service worker ready:", reg);
      let sub = await reg.pushManager.getSubscription();
      console.log("Existing subscription:", sub);
      if (!sub) {
        try {
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });
          console.log("New subscription:", sub);
        } catch (err) {
          console.error("pushManager.subscribe error:", err);
          throw new Error(
            "pushManager.subscribe failed: " +
              (err instanceof Error ? err.message : String(err))
          );
        }
      }
      let response;
      try {
        response = await fetch("/api/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "subscribe", subscription: sub }),
        });
        console.log("API response:", response);
      } catch (err) {
        console.error("fetch /api/push error:", err);
        throw new Error(
          "fetch /api/push failed: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error text:", errorText);
        throw new Error("API error: " + errorText);
      }
      setSubscribed(true);
    } catch (error) {
      setError(
        "Gagal subscribe: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      console.error("Failed to subscribe:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendTestNotification() {
    try {
      const response = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "notify",
          title: "Test Notification",
          body: "Push notification works!",
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        setError("Gagal kirim notifikasi: " + errorText);
      }
    } catch (error) {
      setError(
        "Gagal kirim notifikasi: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      console.error("Failed to send notification:", error);
    }
  }

  return (
    <div style={{ margin: "1rem 0" }}>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button onClick={subscribe} disabled={subscribed || loading}>
        {subscribed
          ? "Subscribed to Push"
          : loading
            ? "Subscribing..."
            : "Enable Push Notification"}
      </button>
      {subscribed && (
        <button onClick={sendTestNotification} style={{ marginLeft: 8 }}>
          Send Test Notification
        </button>
      )}
    </div>
  );
}
