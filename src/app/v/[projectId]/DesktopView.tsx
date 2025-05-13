import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import SubtitlesEditor from "./SubtitleEditor";

interface EditorDesktopViewProps {

}

export function EditorDesktopView() {
	return (
		<div className="fixed inset-0 mt-0 flex flex-col pt-16">
			<ResizablePanelGroup direction="horizontal" className="flex-1">
				{/* subtitles page */}
				<ResizablePanel defaultSize={30}>
					<SubtitlesEditor />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel>
					<ResizablePanelGroup
						direction="vertical"
						className="h-full"
					>
						<ResizablePanel defaultSize={80}>
							<div className="h-full">Video One</div>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={20}>
							<div className="h-full">Bottom Player</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
