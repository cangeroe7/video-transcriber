import { db } from "~/server/db";
import { videos } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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

    const video = await db
      .update(videos)
      .set({ subtitlesUrl })
      .where(eq(videos.id, videoId))
      .returning()
      .then((res) => res[0]);

    if (!video) {
      return NextResponse.json({ error: "Video Not Found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
