import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Ambil data dari frontend (misal userId, amount, dsb)
  const body = await req.json();

  // Generate timestamp Jakarta
  const timestamp =
    new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .replace(" ", "T") + "+07:00";

  // Generate signature sesuai Dana (butuh private key, lihat dokumentasi Dana)
  const signature = "<GENERATED_SIGNATURE>"; // Implementasi sesuai Dana

  // Generate externalId dan partnerReferenceNo unik (misal pakai uuid)
  const externalId = "<UNIQUE_EXTERNAL_ID>";
  const partnerReferenceNo = "<UNIQUE_PARTNER_REF>";

  const response = await fetch(
    "https://api.saas.dana.id/v1.0/qr/qr-mpm-generate.htm",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-TIMESTAMP": timestamp,
        "X-SIGNATURE": signature,
        "X-PARTNER-ID": "<YOUR_CLIENT_ID>",
        "X-EXTERNAL-ID": externalId,
        "CHANNEL-ID": "<YOUR_CHANNEL_ID>",
        // "ORIGIN": "yourdomain.com", // opsional
      },
      body: JSON.stringify({
        merchantId: body.merchantId || "<YOUR_MERCHANT_ID>",
        partnerReferenceNo,
        amount: {
          value: body.amount?.value || "15000.00",
          currency: body.amount?.currency || "IDR",
        },
        additionalInfo: {
          envInfo: {
            sessionId: body.sessionId || "<SESSION_ID>",
            tokenId: body.tokenId || "<TOKEN_ID>",
            websiteLanguage: body.websiteLanguage || "id_ID",
            clientIp: body.clientIp || "<CLIENT_IP>",
            osType: body.osType || "Windows.PC",
            appVersion: body.appVersion || "1.0",
            sdkVersion: body.sdkVersion || "1.0",
            sourcePlatform: body.sourcePlatform || "IPG",
            terminalType: body.terminalType || "SYSTEM",
            orderTerminalType: body.orderTerminalType || "APP",
            orderOsType: body.orderOsType || "WINDOWS",
            merchantAppVersion: body.merchantAppVersion || "1.0",
            extendInfo:
              body.extendInfo ||
              '{"deviceId":"<DEVICE_ID>","bizScenario":"SAMPLE_MERCHANT_AGENT"}',
          },
        },
      }),
    }
  );

  const result = await response.json();

  if (result.responseCode === "2004700" && result.qrContent) {
    return NextResponse.json({
      status: "success",
      message: "QRIS Dana berhasil dibuat.",
      qrContent: result.qrContent,
      qrUrl: result.qrUrl,
      qrImage: result.qrImage,
      data: result,
    });
  } else {
    return NextResponse.json(
      {
        status: "failed",
        message: result.responseMessage || "Gagal membuat QRIS Dana.",
        error: result,
      },
      { status: 400 }
    );
  }
}
