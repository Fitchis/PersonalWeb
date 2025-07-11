// This file handles push notification subscription and triggering from the client.
// Place this in your components directory, e.g., components/PushNotificationButton.tsx

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
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }
      await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "subscribe", subscription: sub }),
      });
      setSubscribed(true);
    }
    setLoading(false);
  }

  async function sendTestNotification() {
    await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "notify",
        title: "Test Notification",
        body: "Push notification works!",
      }),
    });
  }

  return (
    <div style={{ margin: "1rem 0" }}>
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
