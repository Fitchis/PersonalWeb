import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Define the expected structure of the webhook payload
interface TripayWebhookBody {
  merchant_ref?: string;
  merchantRef?: string;
  status: string;
  amount: number;
  customer_email?: string;
  order_items?: { customer_email?: string }[];
  customer?: { email?: string };
}

// Webhook endpoint untuk menerima notifikasi dari Tripay
export async function POST(req: Request) {
  const rawBody = await req.text();
  let body: TripayWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Verifikasi signature Tripay
  // Signature Tripay: HMAC-SHA256(merchantRef+status+amount, privateKey)
  const signature = req.headers.get("x-signature");
  const privateKey = process.env.TRIPAY_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "TRIPAY_PRIVATE_KEY not set" },
      { status: 500 }
    );
  }
  const merchantRef = body.merchant_ref || body.merchantRef;
  const status = body.status;
  const amount = body.amount;
  if (!merchantRef || !status || !amount) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const crypto = await import("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", privateKey)
    .update(`${merchantRef}${status}${amount}`)
    .digest("hex");
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Proses jika payment sukses (PAID)
  // Email user bisa disimpan di order_items[0].customer_email atau custom field
  let email = body.customer_email;
  if (!email && body.order_items && body.order_items[0]?.customer_email) {
    email = body.order_items[0].customer_email;
  }
  if (!email && body.customer && body.customer.email) {
    email = body.customer.email;
  }

  if (status === "PAID" && email) {
    await prisma.user.update({
      where: { email },
      data: { isPremium: true },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: "Invalid or failed payment" },
    { status: 400 }
  );
}
