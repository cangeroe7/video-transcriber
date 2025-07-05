import React from "react";
import { State } from "~/helpers/use-rendering";
import { Button } from "./button";
import { Spacing } from "./spacing";
import { Loader2 } from "lucide-react";

const Megabytes: React.FC<{
	sizeInBytes: number;
}> = ({ sizeInBytes }) => {
	const megabytes = Intl.NumberFormat("en", {
		notation: "compact",
		style: "unit",
		unit: "byte",
		unitDisplay: "narrow",
	}).format(sizeInBytes);
	return <span className="opacity-60">{megabytes}</span>;
};

export const DownloadButton: React.FC<{
	state: State;
	undo: () => void;
}> = ({ state, undo }) => {
	if (state.status === "rendering") {
		return (
			<div className="flex w-full flex-col items-center">
				<div className="flex w-full justify-center">
					<Button
						disabled
						className="flex animate-pulse cursor-not-allowed items-center gap-2 rounded-lg bg-gray-200 px-6 py-2 text-gray-500"
					>
            Download Video
					</Button>
				</div>
			</div>
		);
	}

	if (state.status !== "done") {
		throw new Error("Download button should not be rendered when not done");
	}

	return (
		<div className="flex w-full flex-col items-center">
			<div className="relative flex w-full justify-center">
				<Button
					onClick={undo}
					variant="ghost"
					size="icon"
					className="absolute right-10 top-1/2 -translate-y-1/2"
					title="Undo"
				>
					<UndoIcon />
				</Button>
				<a href={state.url} className="flex justify-center">
					<Button className="rounded-lg bg-[#5666F5] px-8 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#434EEA]">
						Download Video
					</Button>
				</a>
			</div>
			<span className="mt-2 text-xs text-gray-500">
				<Megabytes sizeInBytes={state.size} />
			</span>
		</div>
	);
};

const UndoIcon: React.FC = () => {
	return (
		<svg height="1em" viewBox="0 0 512 512">
			<path
				fill="var(--foreground)"
				d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"
			/>
		</svg>
	);
};
