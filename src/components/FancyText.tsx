import { VideoUpload } from "./VideoUpload";
import type { folders } from "~/server/db/schema";

export default function EmptyStateBanner(props: {
	folders: (typeof folders.$inferSelect)[];
}) {
	return (
		<div className="mx-auto w-full">
			<div className="relative overflow-hidden rounded-2xl border border-green-100/50 bg-gradient-to-br from-green-50 to-emerald-100/50 p-10">
				<div
					style={{
						backgroundImage: `url('/af9ad0cd-9f83-4f70-80cf-aaa9cf1d3205.jpg')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						opacity: "30%",
					}}
					className="absolute inset-0 z-0"
				/>

				<div className="relative flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-x-8 md:space-y-0">
					{/* Left side - Icon and text */}
					<div className="flex-1 space-y-4">
						{/* Main heading */}
						<div className="space-y-2">
							<h2 className="text-left text-3xl font-extrabold leading-tight text-gray-900">
								<div className="">
									<span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
										AI Subtitles{" "}
									</span>
									for your video
								</div>
							</h2>
							<p className="text-left text-lg text-black/60">
								Transform your videos with accurate, AI-powered
								subtitles in seconds
							</p>
						</div>
					</div>

					{/* Right side - CTA Button */}
					<VideoUpload folders={props.folders} />
				</div>
			</div>
		</div>
	);
}
