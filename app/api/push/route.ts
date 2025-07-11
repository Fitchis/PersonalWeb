import webpush from "web-push";
import { PushSubscription } from "web-push";
// Untuk debugging, tambahkan log agar error lebih jelas
function log(...args: unknown[]) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[api/push]", ...args);
  }
}

webpush.setVapidDetails(
  "mailto:fitchisbox@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);
log("VAPID public key:", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
log("VAPID private key:", process.env.VAPID_PRIVATE_KEY);

const subscriptions: PushSubscription[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    log("Request body:", body);
    if (body.type === "subscribe") {
      subscriptions.push(body.subscription as PushSubscription);
      log("Subscription added. Total:", subscriptions.length);
      return Response.json({ success: true });
    }
    if (body.type === "notify") {
      const { title, body: message } = body;
      const payload = JSON.stringify({ title, body: message });
      log("Sending notification to", subscriptions.length, "subscriptions");
      const results = await Promise.all(
        subscriptions.map((sub, idx) =>
          webpush
            .sendNotification(sub, payload)
            .then((res) => {
              log("Notification sent to sub", idx);
              return res;
            })
            .catch((e: unknown) => {
              log("Error sending to sub", idx, e);
              return e;
            })
        )
      );
      return Response.json({ success: true, results });
    }
    return Response.json({ error: "Invalid request" }, { status: 400 });
  } catch (err) {
    log("API error:", err);
    return Response.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
