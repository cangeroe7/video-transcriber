"use client";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { HexColorPicker } from "react-colorful";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";

import { VideoByIdOutput } from "~/types";

// Font options
const fontOptions = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
    "Impact",
    "Tahoma",
    "Trebuchet MS",
];

// Language options
const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
    { value: "ar", label: "Arabic" },
    { value: "ru", label: "Russian" },
];


function hexToRgba(hex: string, opacity: number): string {
    const sanitizedHex = hex.replace("#", "");
    const bigint = parseInt(sanitizedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

type TranscriptEntry = {
    start: number;
    end: number;
    text: string;
}

export function VideoSubtitlePreviewer({ video }: { video: VideoByIdOutput }) {
    if (!video) {
        return <div>NO VIDEO DUMMY</div>
    }
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSubtitle, setCurrentSubtitle] = useState("");
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

    useEffect(() => {
        if (!video.subtitlesUrl) return;

        fetch(video.subtitlesUrl)
            .then(res => res.json())
            .then(data => {
                setTranscript(data.content);
                console.log(data.content ?? []);
            })
            .catch(err => console.error("Failed to load subtitles", err));
    }, [video.subtitlesUrl]);

    interface Settings {
        language: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: number;
        position: number;
        backgroundColor: string;
        backgroundOpacity: number;
        textColor: string;
        textShadow: boolean;
        alignment: "left" | "center" | "right" | "justify" | "start" | "end";
        outlineWidth: number;
        outlineColor: string;
    }
    // Subtitle settings
    const [settings, setSettings] = useState<Settings>({
        language: "en",
        fontSize: 24,
        fontFamily: "Arial",
        fontWeight: 400,
        position: 80, // percentage from top
        backgroundColor: "#000000",
        backgroundOpacity: 50, // percentage
        textColor: "#ffffff",
        textShadow: true,
        alignment: "center",
        outlineWidth: 1,
        outlineColor: "#000000",
    });

    // Update a single setting
    const updateSetting = (key: string, value: string | number | boolean) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Simulate video playback and update current subtitle
    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current) {
                const time = videoRef.current.currentTime;
                setCurrentTime(time);

                // Find the current subtitle based on time
                const subtitle = transcript.find(
                    (sub) => time >= sub.start && time <= sub.end,
                );

                setCurrentSubtitle(subtitle ? subtitle.text : "");
            }
        }, 100);

        return () => clearInterval(interval);
    }, [transcript]);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Video Preview Section */}
            <div className="lg:col-span-2">
                <div className="relative overflow-hidden rounded-lg bg-black">
                    <video
                        ref={videoRef}
                        className="aspect-video w-full"
                        src={video.videoMedia.url}
                        controls
                        autoPlay
                        muted
                        loop
                    />

                    {/* Subtitle overlay */}
                    <div
                        className="absolute w-full px-4"
                        style={{
                            top: `${settings.position}%`,
                            transform: "translateY(-50%)",
                            textAlign: `${settings.alignment}`,
                        }}
                    >
                        <div
                            className="inline-block rounded px-3 py-1"
                            style={{
                                backgroundColor: hexToRgba(settings.backgroundColor, settings.backgroundOpacity / 100),
                                maxWidth: "100%",
                            }}
                        >
                            <p
                                style={{
                                    color: settings.textColor,
                                    fontSize: `${settings.fontSize}px`,
                                    fontFamily: settings.fontFamily,
                                    fontWeight: settings.fontWeight,
                                    textShadow: settings.textShadow
                                        ? `${settings.outlineWidth}px ${settings.outlineWidth}px ${settings.outlineWidth}px ${settings.outlineColor}`
                                        : "none",
                                }}
                            >
                                {currentSubtitle || "Subtitle preview will appear here"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Panel */}
            <div className="lg:col-span-1">
                <Card>
                    <CardContent className="pt-6">
                        <Tabs defaultValue="text">
                            <TabsList className="mb-4 grid grid-cols-3">
                                <TabsTrigger value="text">Text</TabsTrigger>
                                <TabsTrigger value="position">Position</TabsTrigger>
                                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                            </TabsList>

                            {/* Text Settings */}
                            <TabsContent value="text" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select
                                        value={settings.language}
                                        onValueChange={(value) => updateSetting("language", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languageOptions.map((lang) => (
                                                <SelectItem key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fontSize">
                                        Font Size: {settings.fontSize}px
                                    </Label>
                                    <Slider
                                        id="fontSize"
                                        min={12}
                                        max={48}
                                        step={1}
                                        value={[settings.fontSize]}
                                        onValueChange={(value) =>
                                            updateSetting("fontSize", value[0] ? value[0] : 12)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fontFamily">Font Family</Label>
                                    <Select
                                        value={settings.fontFamily}
                                        onValueChange={(value) =>
                                            updateSetting("fontFamily", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fontOptions.map((font) => (
                                                <SelectItem key={font} value={font}>
                                                    {font}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fontWeight">
                                        Font Weight: {settings.fontWeight}
                                    </Label>
                                    <Slider
                                        id="fontWeight"
                                        min={100}
                                        max={900}
                                        step={100}
                                        value={[settings.fontWeight]}
                                        onValueChange={(value) =>
                                            updateSetting("fontWeight", value[0] ? value[0] : 400)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="textColor">Text Color</Label>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-10 w-10 rounded border"
                                            style={{ backgroundColor: settings.textColor }}
                                        />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline">Change Color</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <HexColorPicker
                                                    color={settings.textColor}
                                                    onChange={(color) =>
                                                        updateSetting("textColor", color)
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Position Settings */}
                            <TabsContent value="position" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="position">
                                        Vertical Position: {settings.position}%
                                    </Label>
                                    <Slider
                                        id="position"
                                        min={10}
                                        max={90}
                                        step={1}
                                        value={[settings.position]}
                                        onValueChange={(value) =>
                                            updateSetting("position", value[0] ?? 50)
                                        }
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Position from the top of the video (higher values = lower on
                                        screen)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alignment">Text Alignment</Label>
                                    <Select
                                        value={settings.alignment}
                                        onValueChange={(value) => updateSetting("alignment", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select alignment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="center">Center</SelectItem>
                                            <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="backgroundOpacity">
                                        Background Opacity: {settings.backgroundOpacity}%
                                    </Label>
                                    <Slider
                                        id="backgroundOpacity"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[settings.backgroundOpacity]}
                                        onValueChange={(value) =>
                                            updateSetting(
                                                "backgroundOpacity",
                                                value[0] ?? 50,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="outlineColor">Background Color</Label>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-10 w-10 rounded border"
                                            style={{ backgroundColor: settings.backgroundColor }}
                                        />
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline">Change Color</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <HexColorPicker
                                                    color={settings.backgroundColor}
                                                    onChange={(color) =>
                                                        updateSetting("backgroundColor", color)
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                            </TabsContent>

                            {/* Advanced Settings */}
                            <TabsContent value="advanced" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="textShadow">Text Outline/Shadow</Label>
                                    <Switch
                                        id="textShadow"
                                        checked={settings.textShadow}
                                        onCheckedChange={(checked) =>
                                            updateSetting("textShadow", checked)
                                        }
                                    />
                                </div>

                                {settings.textShadow && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="outlineWidth">
                                                Outline Width: {settings.outlineWidth}px
                                            </Label>
                                            <Slider
                                                id="outlineWidth"
                                                min={0.5}
                                                max={3}
                                                step={0.5}
                                                value={[settings.outlineWidth]}
                                                onValueChange={(value) =>
                                                    updateSetting("outlineWidth", value[0] ? value[0] : 1)
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="outlineColor">Outline Color</Label>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-10 w-10 rounded border"
                                                    style={{ backgroundColor: settings.outlineColor }}
                                                />
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline">Change Color</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <HexColorPicker
                                                            color={settings.outlineColor}
                                                            onChange={(color) =>
                                                                updateSetting("outlineColor", color)
                                                            }
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Separator />

                                {/* <div className="space-y-2">
                  <Label>Additional FFmpeg Options</Label>
                  <p className="mb-2 text-sm text-muted-foreground">
                    These settings can be further customized in FFmpeg:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    <li>Subtitle delay/timing adjustments</li>
                    <li>Character encoding</li>
                    <li>Line spacing</li>
                    <li>Subtitle format conversion</li>
                    <li>Burn-in vs. soft subtitles</li>
                  </ul>
                </div> */}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
