import React, { useMemo } from "react";
import FontPicker from "react-fontpicker-ts";
import "react-fontpicker-ts/dist/index.css";
import { getAvailableFonts } from "@remotion/google-fonts";
import { Card } from "~/components/ui/card";

const systemFonts = [
	"Arial",
	"Helvetica",
	"Times New Roman",
	"Courier New",
	"Georgia",
	"Verdana",
];

type FontPickerProps = {
	selectedFont: string;
	setSelectedFont: (font: string) => void;
};

export const FontEditor: React.FC<FontPickerProps> = ({
	selectedFont,
	setSelectedFont,
}) => {
	// Google font metadata
	const googleFonts = getAvailableFonts();
	const googleFamilies = useMemo(
		() => googleFonts.map((f) => f.fontFamily),
		[googleFonts],
	);

	return (
		<div className="flex flex-col gap-4">
			{/* Sticky dropdown */}
			<div className="sticky top-0 z-10 bg-white">
				{selectedFont && (
					<div
						className="sticky top-12 z-10 bg-white p-4 text-4xl"
						style={{ fontFamily: selectedFont }}
					>
						{selectedFont}
					</div>
				)}
			</div>

            <div>
			<FontPicker
				defaultValue={selectedFont}
				value={(font: string) => setSelectedFont(font)}
				style={{ width: "100%", overflowY: "auto" }}
				autoLoad
			/>
			{/* Sticky preview */}
            </div>

			<hr />

			{/* Browser default fonts list */}
			<Card className="max-h-64 overflow-y-auto">
				{systemFonts.map((font) => (
					<div
						key={font}
						className="p-2"
						style={{ fontFamily: font }}
					>
						{font}
					</div>
				))}
			</Card>
		</div>
	);
};
