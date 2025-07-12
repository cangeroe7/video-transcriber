import { MouseEvent, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "~/lib/utils";
import { Settings } from "~/types";
import { fontFamilies } from "~/components/ToolBar";

export const Movable: React.FC<{
	children?: React.ReactNode;
	minHeight: number;
	minWidth: number;
	settings: Settings;
	setSettings: React.Dispatch<React.SetStateAction<Settings>>;
	className?: string;
	videoWidth?: number;
	videoHeight?: number;
}> = ({ className, children, minHeight, minWidth, settings, setSettings, videoWidth, videoHeight }) => {
	const [isResizing, setIsResizing] = useState(false);
	const [resizeDirection, setResizeDirection] = useState<
		| "top-left"
		| "top-right"
		| "bottom-left"
		| "bottom-right"
		| "left"
		| "top"
		| "right"
		| "bottom"
		| null
	>(null);

	const containerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [initialPosition, setInitialPosition] = useState<{
		left: number;
		top: number;
		right: number;
		bottom: number;
	}>({ left: 0, top: 0, right: 0, bottom: 0 });

	const [initialClick, setInitialClick] = useState<null | {
		left: number;
		top: number;
		right: number;
		bottom: number;
	}>(null);

	const [scale, setScale] = useState<number>(
		getVisualScale(containerRef.current),
	);

	const [size, setSize] = useState<{ width: number; height: number }>({
		width: settings.width / scale,
		height: settings.height / scale,
	});
	const [delta, setDelta] = useState<{
		top: number;
		left: number;
	}>({ top: 0, left: 0 });
	const targetRef = useRef<HTMLDivElement>(null);

	const [containerRect, setContainerRect] = useState<{
		top: number;
		left: number;
		bottom: number;
		right: number;
	}>({ top: 0, left: 0, bottom: 0, right: 0 });

	const [isHovered, setIsHovered] = useState(false);
	const [isSelected, setIsSelected] = useState(false);

	const aName = () => {
		if (targetRef.current) {
			const result = getVisualScale(targetRef.current);
			setScale(result);
		}
		if (containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			setContainerRect({
				left: containerRect.left,
				top: containerRect.top,
				bottom: containerRect.bottom,
				right: containerRect.right,
			});
		}
	};
	useEffect(() => {
		setTimeout(() => {
			aName();
		}, 1);

		window.addEventListener("resize", aName);
		return () => {
			window.removeEventListener("resize", aName);
		};
	}, []);

	useEffect(() => {
		if (!isSelected) return;
		const handleClick = (e: Event) => {
			if (!targetRef.current) return;
			if (!(e.target instanceof Node)) return;
			if (!targetRef.current.contains(e.target as Node)) {
				setIsSelected(false);
			}
		};
		window.addEventListener("mousedown", handleClick);
		return () => window.removeEventListener("mousedown", handleClick);
	}, [isSelected]);

	//const currentLine = subtitles.find((s) => time >= s.start && time <= s.end);
	function getVisualScale(element: HTMLElement | null): number {
		if (!element) {
			return 1;
		}
		const rect = element.getBoundingClientRect();
		const scaleX = rect.width / element.offsetWidth;
		const scaleY = rect.height / element.offsetHeight;
		return (scaleX + scaleY) / 2;
	}

	const containerWidth = containerRect.right - containerRect.left;
	const containerHeight = containerRect.bottom - containerRect.top;
	const [finalPosition, setFinalPosition] = useState<{
		left: number;
		top: number;
	}>({
		left: settings.left / scale,
		top: settings.top / scale,
	});

	const mouseDown = (e: MouseEvent<HTMLDivElement>) => {
		setIsSelected(true);
		aName();

		const initialLeft = (e.clientX - containerRect.left) / scale;
		const initialTop = (e.clientY - containerRect.top) / scale;
		const initialRight = (e.clientY - containerRect.right) / scale;
		const initialBottom = (e.clientY - containerRect.bottom) / scale;

		const rect = e.currentTarget.getBoundingClientRect();

		const left = (rect.left - containerRect.left) / scale;
		const top = (rect.top - containerRect.top) / scale;
		const right = (rect.right - containerRect.right) / scale;
		const bottom = (rect.bottom - containerRect.bottom) / scale;


		setInitialClick({
			left: initialLeft,
			top: initialTop,
			right: initialRight,
			bottom: initialBottom,
		});

		setInitialPosition({ left, top, right, bottom });

		setIsDragging(true);
	};

	const [resizeInitiales, setResizeInitials] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });

	const [initialSize, setInitialSize] = useState<{
		width: number;
		height: number;
	}>({ width: 0, height: 0 });
	
	const fontFamily = fontFamilies.get(settings.fontFamily)?.fontFamily ?? ""
	const fontWeight = fontFamilies.get(settings.fontFamily)?.fontWeight ?? "400"

	// Calculate font size based on video dimensions
	const calculateFontSize = () => {
		if (!videoWidth || !videoHeight) {
			return settings.fontSize;
		}
		
		// Base font size calculation on video dimensions
		// You can adjust these multipliers to get the desired scaling
		const baseFontSize = Math.min(videoWidth, videoHeight) * 0.02; // 2% of the smaller dimension
		const minFontSize = 12;
		const maxFontSize = Math.min(videoWidth, videoHeight) * 0.1; // 10% of the smaller dimension
		
		// Use the settings fontSize as a multiplier for user control
		const userMultiplier = settings.fontSize / 10; // Assuming settings.fontSize is a percentage
		const calculatedSize = baseFontSize * userMultiplier;
		
		return Math.max(minFontSize, Math.min(maxFontSize, calculatedSize));
	};

	const dynamicFontSize = calculateFontSize();

	return (
		<>
			<div
				ref={containerRef}
				className={cn("absolute inset-0", className)}
			>
				<div
					onMouseDown={mouseDown}
					ref={targetRef}
					tabIndex={0}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					style={{
						textAlign: "center",
						background: "transparent",
						fontSize: dynamicFontSize,
						color: settings.color,
						fontFamily: fontFamily,
						fontWeight: fontWeight,
						fontStyle: settings.italic ? "italic" : "normal",
						fill: "white",
						position: "absolute",
						width: size.width,
						height: size.height,
						left: finalPosition.left ?? 100,
						top: finalPosition.top,
						outline:
							isHovered || isSelected
								? `${1 / scale}px solid rgb(39, 161, 178)`
								: "none",
						outlineOffset: "2px",
						cursor: isSelected
							? isDragging
								? "grabbing"
								: "pointer"
							: "pointer",
							userSelect: "none",
					}}
				>
					{children}
					{/* Resize handles - only show if selected */}
					{isSelected && (
						<>
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("top-left");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
								}}
								style={{
									position: "absolute",
									top: -10 / scale,
									left: -10 / scale,
									width: 16 / scale,
									height: 16 / scale,
									backgroundColor: "white",
									borderRadius: "100%",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									cursor: "nwse-resize",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							/>
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("top-right");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
								}}
								style={{
									position: "absolute",
									top: -10 / scale,
									right: -10 / scale,
									width: 16 / scale,
									height: 16 / scale,
									backgroundColor: "white",
									borderRadius: "100%",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "nesw-resize",
								}}
							/>
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("bottom-left");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
								}}
								style={{
									position: "absolute",
									bottom: -10 / scale,
									left: -10 / scale,
									width: 16 / scale,
									height: 16 / scale,
									backgroundColor: "white",
									borderRadius: "100%",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									cursor: "nesw-resize",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							/>
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("bottom-right");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
								}}
								style={{
									position: "absolute",
									bottom: -10 / scale,
									right: -10 / scale,
									width: 16 / scale,
									height: 16 / scale,
									backgroundColor: "white",
									borderRadius: "100%",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "nwse-resize",
								}}
							/>
							{/* Left (horizontal resize only) */}
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("left");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
									aName();
								}}
								style={{
									position: "absolute",
									top: "50%",
									left: -8 / scale,
									transform: "translateY(-50%)",
									width: 12 / scale,
									height: 24 / scale,
									backgroundColor: "white",
									borderRadius: "999px",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "ew-resize",
								}}
							/>
							{/* Right (horizontal resize only) */}
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("right");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
									aName();
								}}
								style={{
									position: "absolute",
									top: "50%",
									right: -8 / scale,
									transform: "translateY(-50%)",
									width: 12 / scale,
									height: 24 / scale,
									backgroundColor: "white",
									borderRadius: "999px",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "ew-resize",
								}}
							/>
							{/* Top (vertical resize only) */}
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("top");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
									aName();
								}}
								style={{
									position: "absolute",
									left: "50%",
									top: -8 / scale,
									width: 24 / scale,
									height: 12 / scale,
									backgroundColor: "white",
									borderRadius: "999px",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "ns-resize",
									transform: "translateX(-50%)",
								}}
							/>
							{/* Bottom (vertical resize only) */}
							<div
								onMouseDown={(e) => {
									setIsResizing(true);
									setResizeDirection("bottom");
									setResizeInitials({
										x: e.clientX,
										y: e.clientY,
									});
									setInitialSize({
										width: size.width,
										height: size.height,
									});
									aName();
								}}
								style={{
									position: "absolute",
									left: "50%",
									bottom: -8 / scale,
									width: 24 / scale,
									height: 12 / scale,
									backgroundColor: "white",
									borderRadius: "999px",
									boxShadow:
										"rgba(0, 0, 0, 0.25) 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 5px 5px, rgba(0, 0, 0, 0.15) 0px 2px 3px",
									zIndex: 10,
									transition:
										"box-shadow 0.15s, border-color 0.15s",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "ns-resize",
									transform: "translateX(-50%)",
								}}
							/>
						</>
					)}
				</div>
			</div>
			{isDragging &&
				ReactDOM.createPortal(
					<div
						className="absolute inset-0"
						onMouseUp={() => {
							setDelta({ left: 0, top: 0 });
							setIsDragging(false);
							setIsResizing(false);
							setResizeDirection(null);
							setSettings((prev) => ({
								...prev,
								width: size.width,
								height: size.height,
								left: finalPosition.left,
								top: finalPosition.top,
							}));

							if (targetRef.current) {
								const rect =
									targetRef.current!.getBoundingClientRect();


								const left =
									(rect.left - containerRect.left) / scale;
								const top =
									(rect.top - containerRect.top) / scale;

								const right =
									(containerRect.right - rect.right) / scale;
								const bottom =
									(containerRect.bottom - rect.bottom) /
									scale;


								setInitialPosition({
									left,
									top,
									right,
									bottom,
								});
							}
						}}
						onMouseMove={(e) => {
							if (isResizing && resizeDirection) {
								const deltaX =
									(e.clientX - resizeInitiales.x) / scale;
								const deltaY =
									(e.clientY - resizeInitiales.y) / scale;


								let newSize = { ...size };
								let newPosition = { ...finalPosition };

								switch (resizeDirection) {
									case "left": {
										const newWidth = Math.max(
											minWidth / scale,
											initialSize.width - deltaX,
										);
										const dx = newWidth - size.width;
										newSize.width = newWidth;
										newPosition.left =
											finalPosition.left - dx;
										break;
									}
									case "top": {
										const newHeight = Math.max(
											minHeight / scale,
											initialSize.height - deltaY,
										);
										const dy = newHeight - size.height;
										newSize.height = newHeight;
										newPosition.top =
											finalPosition.top - dy;
										break;
									}
									case "top-left": {
										const newWidth = Math.max(
											minWidth / scale,
											initialSize.width - deltaX,
										);
										const newHeight = Math.max(
											minHeight / scale,
											initialSize.height - deltaY,
										);
										const dx = newWidth - size.width;
										const dy = newHeight - size.height;
										newSize = {
											width: newWidth,
											height: newHeight,
										};
										newPosition = {
											left: finalPosition.left - dx,
											top: finalPosition.top - dy,
										};
										break;
									}
									case "top-right": {
										const newWidth = Math.max(
											minWidth / scale,
											initialSize.width + deltaX,
										);
										const newHeight = Math.max(
											minHeight / scale,
											initialSize.height - deltaY,
										);
										const dy = newHeight - size.height;
										newSize = {
											width: newWidth,
											height: newHeight,
										};
										newPosition.top =
											finalPosition.top - dy;
										break;
									}
									case "bottom-left": {
										const newWidth = Math.max(
											minWidth / scale,
											initialSize.width - deltaX,
										);
										const dx = newWidth - size.width;
										newSize.width = newWidth;
										newPosition.left =
											finalPosition.left - dx;
										break;
									}
									// For right/bottom/bottom-right, only update size
									case "right": {
										newSize.width = Math.max(
											minWidth / scale,
											initialSize.width + deltaX,
										);
										break;
									}
									case "bottom": {
										newSize.height = Math.max(
											minHeight / scale,
											initialSize.height + deltaY,
										);
										break;
									}
									case "bottom-right": {
										newSize = {
											width: Math.max(
												minWidth / scale,
												initialSize.width + deltaX,
											),
											height: Math.max(
												minHeight / scale,
												initialSize.height + deltaY,
											),
										};
										break;
									}
								}

								setSize(newSize);
								setFinalPosition(newPosition);
							}
							const offsetX =
								(e.clientX - containerRect.left) / scale -
								initialClick!.left;
							const offsetY =
								(e.clientY - containerRect.top) / scale -
								initialClick!.top;

							if (isResizing && resizeDirection)
								switch (resizeDirection) {
									case "top-left":
										setDelta({
											left: offsetX,
											top: offsetY,
										});
										break;
									case "top-right":
										setDelta((prev) => ({
											...prev,
											top: offsetY,
										}));
										break;
									case "bottom-left":
										setDelta((prev) => ({
											...prev,
											left: offsetX,
										}));
										break;
									case "bottom-right":
										setDelta((prev) => ({ ...prev }));
										break;
									case "left":
										setDelta((prev) => ({
											...prev,
											left: offsetX,
										}));
										break;
									case "top":
										setDelta((prev) => ({
											...prev,
											top: offsetY,
										}));
								}
							else if (isDragging) {
								setDelta({ left: offsetX, top: offsetY });
								const left = Math.min(
									Math.max(
										initialPosition!.left + delta.left,
										0,
									),
									containerWidth / scale - size.width,
								);
								const top = Math.min(
									Math.max(
										initialPosition!.top + delta.top,
										0,
									),
									containerHeight / scale - size.height,
								);
								setFinalPosition({ left, top });
							}
						}}
					></div>,
					document.body,
				)}
		</>
	);
};
