import { useEffect, useState } from "react"
import { AbsoluteFill, useCurrentFrame, Video } from "remotion"
import { Movable } from "~/components/Movable"
import { Subtitle, SubVidProps } from "~/types"

export const MainVideo = (inputProps: SubVidProps) => {
    const { subtitles, video } = inputProps

    const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

    const frame = useCurrentFrame();

    const fps = 30;

    const currentTime = frame / fps;


    useEffect(() => {
        if (!subtitles) return;
        const current = subtitles.find((s) => currentTime >= s.start && currentTime < s.end);
        setCurrentSubtitle(current ?? null);
    }, [currentTime, subtitles]);

    return (
        <AbsoluteFill className="flex justify-center items-center" >
            <div id="subtitle-box" className="relative w-full h-full">
                <Video
                    src={video ?? ""}
                    startFrom={0}
                    endAt={10000}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {subtitles && (
                    <Movable height={200} width={600} minWidth={200} minHeight={80}>
                        {currentSubtitle?.text ?? ""}
                    </Movable>
                )}
            </div>
        </AbsoluteFill>
    )
}
