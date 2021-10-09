import React, { ReactElement } from "react";

interface IButtonProps {
	label?: string;
	icon?: ReactElement;
	size?: number;
	bg?: string;
	color?: string;
	disabled?: boolean;
	onClick?: () => void;
}

const Button = ({ label, icon, size, bg = "white", color = "black", onClick, disabled = false}: IButtonProps) => {
	return (
		<div
			className={`${disabled ? "opacity-70 pointer-events-none" : "opacity-100 pointer-events-auto"} ${!label && icon ? `w-${size} h-${size}` : "px-6 py-2"} rounded-full flex items-center justify-center bg-${bg}  hover:bg-black hover:text-white cursor-pointer space-x-2 transition ease-in-out shadow-sm group`}
			onClick={() => {
				if (onClick) onClick();
			}}>
			{icon ? icon : null}
			{label ? <div
				className={"font-semibold uppercase text-xs group-hover:text-white" + (color ? " text-" + color : "")}>{label}</div> : null}
		</div>
	);
};

export default Button;
