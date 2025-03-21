// app/api/chatbase-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Chatbase Webhook Data:", data);

    // Process the data here (e.g., store it in your database)

    return NextResponse.json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Error processing Chatbase webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
