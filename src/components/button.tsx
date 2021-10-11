import React, { ReactElement, MouseEvent } from "react";
import { IconType } from "react-icons";

interface IButtonProps {
	label?: string;
	className?: string;
	icon?: IconType;
	iconSize?: number;
	bg?: string;
	color?: string;
	disabled?: boolean;
	onClick?: (e: MouseEvent) => void;
}

const Button = ({
	label,
	className,
	icon,
	iconSize,
	onClick,
	disabled = false
}: IButtonProps) => {
	const Icon = icon ?? null;
	return (
		<div
			className={`${
				disabled
					? "opacity-70 pointer-events-none"
					: "opacity-100 pointer-events-auto"
			} ${
				!label && icon ? "" : "px-6 py-2"
			} rounded-full flex items-center justify-center  hover:bg-black hover:text-white cursor-pointer space-x-2 transition ease-in-out shadow-sm group ${
				className ?? ""
			}`}
			onClick={(e) => {
				if (onClick) onClick(e);
			}}
		>
			{Icon ? <Icon size={iconSize} /> : null}
			{label ? (
				<div
					className={
						"font-semibold uppercase whitespace-nowrap text-xs group-hover:text-white"
					}
				>
					{label}
				</div>
			) : null}
		</div>
	);
};

export default Button;
