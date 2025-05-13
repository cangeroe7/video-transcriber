import { MouseEvent, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "~/lib/utils";

export const Movable: React.FC<{
    children?: React.ReactNode;
    height: number;
    width: number;
    minHeight: number;
    minWidth: number;
    className?: string;
}> = ({ className, children, height, width, minHeight, minWidth }) => {
    //const frame = useCurrentFrame();
    //const { fps } = useVideoConfig();

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
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: width,
        height: height,
    });

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

    const [scale, setScale] = useState<number>(1);

    const [delta, setDelta] = useState<{
        top: number;
        left: number;
    }>({ top: 0, left: 0 });
    const targetRef = useRef<HTMLDivElement>(null);
    //  const time = frame / fps;
    //

    const [containerRect, setContainerRect] = useState<{
        top: number;
        left: number;
        bottom: number;
        right: number;
    }>({ top: 0, left: 0, bottom: 0, right: 0 });

    const aName = () => {
        if (targetRef.current) {
            const result = getVisualScale(targetRef.current);
            console.log({ result });
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

            console.log({ containerRect });
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

    //const currentLine = subtitles.find((s) => time >= s.start && time <= s.end);
    function getVisualScale(element: HTMLElement): number {
        const rect = element.getBoundingClientRect();
        const scaleX = rect.width / element.offsetWidth;
        const scaleY = rect.height / element.offsetHeight;
        return (scaleX + scaleY) / 2;
    }

    const containerWidth = containerRect.right - containerRect.left;
    const containerHeight = containerRect.bottom - containerRect.top;
    const finalPositionLeft = Math.min(
        Math.max(initialPosition!.left + delta.left, 0),
        containerWidth / scale - size.width,
    );
    const finalPositionTop = Math.min(
        Math.max(initialPosition!.top + delta.top, 0),
        containerHeight / scale - size.height,
    );

    const mouseDown = (e: MouseEvent<HTMLDivElement>) => {
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

        console.log(
            "rects",
            rect.left / scale,
            rect.top / scale,
            containerRect.left,
            containerRect.top,
        );

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
    return (
        <>
            <div
                ref={containerRef}
                className={cn("absolute inset-0", className)}
            >
                <div
                    onMouseDown={mouseDown}
                    ref={targetRef}
                    style={{
                        textAlign: "center",
                        background: "red",
                        fontSize: 42,
                        color: "white",
                        textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)",
                        padding: "0 48px",
                        fill: "white",
                        position: "absolute",
                        width: size.width,
                        height: size.height,
                        left: finalPositionLeft ?? 100,
                        top: finalPositionTop,
                    }}
                >
                    {children}
                    {/* Resize handles */}
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("top-left");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                        }}
                        style={{
                            position: "absolute",
                            top: -12,
                            left: -12,
                            width: 32,
                            height: 32,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "nwse-resize",
                        }}
                    />
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("top-right");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                        }}
                        style={{
                            position: "absolute",
                            top: -12,
                            right: -12,
                            width: 32,
                            height: 32,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "nesw-resize",
                        }}
                    />
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("bottom-left");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                        }}
                        style={{
                            position: "absolute",
                            bottom: -12,
                            left: -12,
                            width: 32,
                            height: 32,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "nesw-resize",
                        }}
                    />
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("bottom-right");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                        }}
                        style={{
                            position: "absolute",
                            bottom: -12,
                            right: -12,
                            width: 32,
                            height: 32,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "nwse-resize",
                        }}
                    />

                    {/* Left (horizontal resize only) */}
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("left");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                            aName();
                        }}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: -10,
                            width: 20,
                            height: 40,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "ew-resize",
                            transform: "translateY(-50%)",
                        }}
                    />

                    {/* Right (horizontal resize only) */}
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("right");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                            aName();
                        }}
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: -10,
                            width: 20,
                            height: 40,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "ew-resize",
                            transform: "translateY(-50%)",
                        }}
                    />

                    {/* Top (vertical resize only) */}
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("top");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                            aName();
                        }}
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: -10,
                            width: 40,
                            height: 20,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "ns-resize",
                            transform: "translateX(-50%)",
                        }}
                    />

                    {/* Bottom (vertical resize only) */}
                    <div
                        onMouseDown={(e) => {
                            setIsResizing(true);
                            setResizeDirection("bottom");
                            setResizeInitials({ x: e.clientX, y: e.clientY });
                            setInitialSize({
                                width: size.width,
                                height: size.height,
                            });
                            aName();
                        }}
                        style={{
                            position: "absolute",
                            left: "50%",
                            bottom: -10,
                            width: 40,
                            height: 20,
                            backgroundColor: "white",
                            border: "2px solid blue",
                            cursor: "ns-resize",
                            transform: "translateX(-50%)",
                        }}
                    />
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

                            if (targetRef.current) {
                                const rect =
                                    targetRef.current!.getBoundingClientRect();

                                console.log({ rect });

                                const left =
                                    (rect.left - containerRect.left) / scale;
                                const top =
                                    (rect.top - containerRect.top) / scale;

                                const right =
                                    (containerRect.right - rect.right) / scale;
                                const bottom =
                                    (containerRect.bottom - rect.bottom) /
                                    scale;

                                console.log("MouseUP", {
                                    rectright: rect.right,
                                    left,
                                    top,
                                    right,
                                    bottom,
                                });

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
                                console.log({
                                    clientX: e.clientX,
                                    clientY: e.clientY,
                                });
                                const deltaX =
                                    (e.clientX - resizeInitiales.x) / scale;
                                const deltaY =
                                    (e.clientY - resizeInitiales.y) / scale;

                                console.log({ deltaX, deltaY });

                                setSize(() => {
                                    switch (resizeDirection) {
                                        case "bottom-right":
                                            return {
                                                width: Math.max(
                                                    minWidth,
                                                    initialSize.width +
                                                    Math.min(
                                                        deltaX,
                                                        -initialPosition.right,
                                                    ),
                                                ),
                                                height: Math.max(
                                                    minHeight,
                                                    initialSize.height +
                                                    Math.min(
                                                        deltaY,
                                                        -initialPosition.bottom,
                                                    ),
                                                ),
                                            };
                                        case "bottom-left":
                                            return {
                                                width: Math.max(
                                                    minWidth,
                                                    initialSize.width +
                                                    Math.min(
                                                        -deltaX,
                                                        initialPosition.left,
                                                    ),
                                                ),
                                                height: Math.max(
                                                    minHeight,
                                                    initialSize.height +
                                                    Math.min(
                                                        deltaY,
                                                        -initialPosition.bottom,
                                                    ),
                                                ),
                                            };
                                        case "top-right":
                                            return {
                                                width: Math.max(
                                                    minWidth,
                                                    initialSize.width +
                                                    Math.min(
                                                        deltaX,
                                                        -initialPosition.right,
                                                    ),
                                                ),
                                                height: Math.max(
                                                    minHeight,
                                                    initialSize.height +
                                                    Math.min(
                                                        -deltaY,
                                                        initialPosition.top,
                                                    ),
                                                ),
                                            };
                                        case "top-left":
                                            return {
                                                width: Math.max(
                                                    minWidth,
                                                    initialSize.width +
                                                    Math.min(
                                                        -deltaX,
                                                        initialPosition.left,
                                                    ),
                                                ),
                                                height: Math.max(
                                                    minHeight,
                                                    initialSize.height +
                                                    Math.min(
                                                        -deltaY,
                                                        initialPosition.top,
                                                    ),
                                                ),
                                            };
                                        case "left":
                                            return {
                                                width: Math.max(
                                                    minWidth,
                                                    initialSize.width +
                                                    Math.min(
                                                        -deltaX,
                                                        initialPosition.left,
                                                    ),
                                                ),
                                                height: initialSize.height,
                                            };
                                        case "right":
                                            return {
                                                width: Math.max(
                                                    minWidth,
                                                    initialSize.width +
                                                    Math.min(
                                                        deltaX,
                                                        -initialPosition.right,
                                                    ),
                                                ),
                                                height: initialSize.height,
                                            };
                                        case "top":
                                            return {
                                                width: initialSize.width,
                                                height: Math.max(
                                                    minHeight,
                                                    initialSize.height +
                                                    Math.min(
                                                        -deltaY,
                                                        initialPosition.top,
                                                    ),
                                                ),
                                            };
                                        case "bottom":
                                            return {
                                                width: initialSize.width,
                                                height: Math.max(
                                                    minHeight,
                                                    initialSize.height +
                                                    Math.min(
                                                        deltaY,
                                                        -initialPosition.bottom,
                                                    ),
                                                ),
                                            };
                                        default:
                                            return initialSize;
                                    }
                                });
                            }
                            const offsetX =
                                (e.clientX - containerRect.left) / scale -
                                initialClick!.left;
                            const offsetY =
                                (e.clientY - containerRect.top) / scale -
                                initialClick!.top;
                            let newWidth = size.width;
                            let newHeight = size.height;

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
                            }
                        }}
                    ></div>,
                    document.body,
                )}
        </>
    );
};
