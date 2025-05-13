import { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";

interface TranscriptLoaderProps {
	videoData: RouterOutputs["video"]["getVideoById"];
	setVideoData: React.Dispatch<
		React.SetStateAction<RouterOutputs["video"]["getVideoById"]>
	>;
}

export function TranscriptLoader({ props }: { props: TranscriptLoaderProps }) {
	const { videoData, setVideoData } = props;


}
