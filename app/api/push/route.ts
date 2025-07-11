import webpush from "web-push";
import { PushSubscription } from "web-push";

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const subscriptions: PushSubscription[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  if (body.type === "subscribe") {
    subscriptions.push(body.subscription as PushSubscription);
    return Response.json({ success: true });
  }
  if (body.type === "notify") {
    const { title, body: message } = body;
    const payload = JSON.stringify({ title, body: message });
    const results = await Promise.all(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub, payload).catch((e: unknown) => e)
      )
    );
    return Response.json({ success: true, results });
  }
  return Response.json({ error: "Invalid request" }, { status: 400 });
}
