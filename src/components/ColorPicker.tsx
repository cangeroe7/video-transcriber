"use client";

import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "~/lib/utils";
import { useForwardedRef } from "~/lib/use-forwarded-ref";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";

interface ColorPickerProps {
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
}

const ColorPicker = forwardRef<
	HTMLInputElement,
	Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
	(
		{ disabled, value, onChange, onBlur, name, className, size, ...props },
		forwardedRef,
	) => {
		const ref = useForwardedRef(forwardedRef);
		const [open, setOpen] = useState(false);

		const parsedValue = useMemo(() => {
			return value || "#FFFFFF";
		}, [value]);

		return (
			<Popover onOpenChange={setOpen} open={open}>
				<PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
					<Button
						{...props}
						className={cn("block", className)}
						name={name}
						onClick={() => {
							setOpen(true);
						}}
						size={size}
						style={{
							backgroundColor: parsedValue,
						}}
						variant="outline"
					>
						<div />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					side="top"
					sideOffset={16}
					className="flex flex-col items-center gap-2 p-2"
					style={{ width: "232px" }}
				>
					<HexColorPicker
						color={parsedValue}
						onChange={onChange}
						style={{ width: "220px", height: "160px" }}
					/>
					<Input
						maxLength={7}
						onChange={(e: any) => {
							onChange(e?.currentTarget?.value);
						}}
						ref={ref}
						value={parsedValue}
						className="h-8 rounded border-gray-300 text-center text-sm shadow-sm"
						style={{ width: "220px" }}
					/>
				</PopoverContent>
			</Popover>
		);
	},
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
