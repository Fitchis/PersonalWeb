// Enhanced push notification component with modern styling and better UX
// Place this in your components directory, e.g., components/PushNotificationButton.tsx

"use client";
import { useEffect, useState } from "react";
import { Bell, BellRing, Send, Check, Loader2 } from "lucide-react";

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
  const [testLoading, setTestLoading] = useState(false);
  const [testSent, setTestSent] = useState(false);

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
    try {
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
    } catch (error) {
      console.error("Failed to subscribe:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendTestNotification() {
    setTestLoading(true);
    try {
      await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "notify",
          title: "Test Notification",
          body: "Push notification works! 🎉",
        }),
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch (error) {
      console.error("Failed to send test notification:", error);
    } finally {
      setTestLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <BellRing className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Push Notifications</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Stay updated with real-time notifications delivered to your device
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={subscribe}
            disabled={subscribed || loading}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200 transform hover:scale-105 active:scale-95
              ${
                subscribed
                  ? "bg-green-100 text-green-800 border-2 border-green-200 cursor-default"
                  : loading
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-200 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 shadow-md hover:shadow-lg"
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : subscribed ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Enable Notifications
              </>
            )}
          </button>

          {subscribed && (
            <button
              onClick={sendTestNotification}
              disabled={testLoading}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200 transform hover:scale-105 active:scale-95
                ${
                  testSent
                    ? "bg-green-100 text-green-800 border-2 border-green-200"
                    : testLoading
                      ? "bg-gray-100 text-gray-600 border-2 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                }
              `}
            >
              {testLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : testSent ? (
                <>
                  <Check className="w-4 h-4" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Test Notification
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {subscribed && (
        <div className="flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Active
          </div>
        </div>
      )}
    </div>
  );
}
