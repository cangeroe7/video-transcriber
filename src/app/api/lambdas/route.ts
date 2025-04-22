import { db } from "~/server/db";
import { videos } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  const secret = process.env.LAMBDA_SECRET;
  const expectedToken = `Bearer ${secret}`;

  if (!authHeader || authHeader !== expectedToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { videoId, subtitlesUrl } = await req.json();

  if (!videoId || !subtitlesUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await db.update(videos).set({ subtitlesUrl }).where(eq(videos.id, videoId));

  return NextResponse.json({ success: true });
}
