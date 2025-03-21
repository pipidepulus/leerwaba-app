// app/api/chatbase/route.ts
import { getChatbaseConversations } from "@/lib/chatbase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = searchParams.get("page") || undefined;
    const size = searchParams.get("size") || undefined;
    const filteredSources = searchParams.get("filteredSources") || undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const data = await getChatbaseConversations(
      userId,
      startDate,
      endDate,
      page,
      size,
      filteredSources
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/chatbase:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
