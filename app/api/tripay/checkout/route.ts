import { NextResponse } from "next/server";

// Konfigurasi Tripay hanya dari environment variable
const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY;
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE;
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY;
// Gunakan endpoint sandbox jika credential sandbox, production jika production
const TRIPAY_URL =
  process.env.TRIPAY_URL || "https://tripay.co.id/api/transaction/create";

export async function POST() {
  // Ambil data user dari session jika perlu (atau dari body jika ingin custom)
  // Untuk contoh ini, kita hardcode email dan nama
  const email = "user@email.com";
  const name = "User Premium";
  const amount = 15000;
  const merchantRef = "INV-" + Date.now();
  const method = "QRIS"; // Ganti dengan kode channel Tripay yang diinginkan

  // Generate signature Tripay: HMAC SHA256(merchantCode+merchantRef+amount, privateKey)
  const crypto = await import("crypto");
  const signature = crypto
    .createHmac("sha256", TRIPAY_PRIVATE_KEY!)
    .update(`${TRIPAY_MERCHANT_CODE}${merchantRef}${amount}`)
    .digest("hex");

  // Data transaksi Tripay
  const body = {
    method,
    merchant_ref: merchantRef,
    amount,
    customer_name: name,
    customer_email: email,
    order_items: [
      {
        sku: "PREMIUM-1YR",
        name: "Akun Premium 1 Tahun",
        price: amount,
        quantity: 1,
      },
    ],
    callback_url:
      process.env.TRIPAY_CALLBACK_URL ||
      "https://task2work.fun/api/tripay/webhook",
    return_url:
      process.env.TRIPAY_RETURN_URL || "https://task2work.fun/profile/upgrade",
    signature,
    // Tambahkan field lain jika perlu
  };

  if (!TRIPAY_API_KEY || !TRIPAY_MERCHANT_CODE || !TRIPAY_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "Tripay environment variables are not set properly." },
      { status: 500 }
    );
  }

  const res = await fetch(TRIPAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TRIPAY_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.success && data.data?.checkout_url) {
    // Redirect ke halaman pembayaran Tripay
    return NextResponse.redirect(data.data.checkout_url);
  }
  return NextResponse.json(
    { error: "Failed to create Tripay transaction", detail: data },
    { status: 500 }
  );
}
