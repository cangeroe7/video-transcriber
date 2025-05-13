// components/Subtitles.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Subtitle, Subtitles as Subs } from "~/types";

/* ---------- types ---------- */

type SubtitlesProps = {
  /** Transcript to display (nullable matches your fetch state). */
  transcript: Subs;
  /**
   * Log‑probability below which the text is considered “low accuracy”.
   * Whisper’s paper treats −1 ≈ 90 % confidence, −2 ≈ 13 %.
   */
  lowAccuracyThreshold?: number;
};

/* ---------- helper ---------- */

function formatTime(s: number) {
  const ms = Math.floor(s * 1000);
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const millis = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}.${millis}`;
}

/* ---------- component ---------- */

export default function TranscriptEditor({
  transcript,
  lowAccuracyThreshold = -1.0,
}: SubtitlesProps) {
  // local state so you can mutate the array in this component later
  const [subs, setSubs] = useState<Subtitle[]>(transcript ?? []);

  // keep state in sync if the parent passes a new array
  useEffect(() => {
    if (transcript) setSubs(transcript);
  }, [transcript]);

  // early return if we haven’t fetched anything yet
  if (!subs.length) {
    return (
      <p className="text-center text-muted-foreground">
        No transcript available.
      </p>
    );
  }

  return (
    <div className="w-full space-y-6">
      {subs.map((sub) => {
        const lowAcc = sub.avg_logprob < lowAccuracyThreshold; // tweak if you want no_speech_prob etc.
        return (
          <div key={sub.id} className="w-full">
            {/* time strip */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(sub.start)}</span>
              <span>{formatTime(sub.end)}</span>
            </div>

            {/* subtitle card */}
            <Card className="mt-1 p-4">
              <p className={lowAcc ? "text-orange-500" : "text-black"}>
                {sub.text}
              </p>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- example usage ----------
import Subtitles from "@/components/Subtitles";

<Subtitles transcript={transcriptFromFetch} />
------------------------------------- */
