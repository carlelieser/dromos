import React, { useEffect, useState, ReactNode } from "react";
import { IconType } from "react-icons";
import uuid from "uuid-random";

const $ = require("jquery");

interface IMenuProps {
	menuButton: ReactNode;
	closeTarget?: any;
}

interface IMenuItemProps {
	label: string;
	onClick?: () => void;
	icon?: IconType;
}

export const MenuItem = ({ label, icon, onClick }: IMenuItemProps) => {
	const Icon = icon ?? null;
	const handleClick = () => {
		if (onClick) onClick();
	};
	return (
		<div
			className={
				"px-4 py-2 cursor-pointer whitespace-nowrap flex items-center space-x-2 hover:bg-gray-50"
			}
			onClick={handleClick}
		>
			{Icon ? <Icon size={16} opacity={0.7} /> : null}
			<div>{label}</div>
		</div>
	);
};

const Menu: React.FC<IMenuProps> = ({ menuButton, closeTarget, children }) => {
	const [menuVisible, setMenuVisible] = useState<boolean>(false);
	const [id, setId] = useState<string>();

	const openMenu = () => {
		setMenuVisible(true);
	};

	const closeMenu = () => {
		setMenuVisible(false);
	};

	const handleOpenMenu = (e) => {
		e.stopPropagation();
		openMenu();
	};

	const handleCloseMenuIfOpen = (element) => {
		let targetId = `menu-${id}`;
		if (
			$(element).attr("id") !== targetId ||
			$(element).parentsUntil(`#${targetId}`).length === 0
		) {
			closeMenu();
		}
	};

	useEffect(() => {
		setId(uuid());
		$(document).on("click", handleCloseMenuIfOpen);

		return () => {
			$(document).off("click", handleCloseMenuIfOpen);
		};
	}, []);

	useEffect(() => {
		if (closeTarget) {
			$(closeTarget).off("mouseleave");
			$(closeTarget).on("mouseleave", closeMenu);
		}

		return () => {
			$(closeTarget).off("mouseleave");
		};
	}, [closeTarget]);

	return (
		<div id={`menu-${id}`}>
			<div
				className={`menu rounded-lg transition z-50 ease-in-out right-0 mr-2 transform bg-white shadow-lg absolute font-semibold overflow-hidden text-xs ${
					menuVisible
						? "opacity-100 translate-y-0 pointer-events-auto"
						: "opacity-0 translate-y-1.5 pointer-events-none"
				}`}
			>
				{children}
			</div>
			<div className={"cursor-pointer"} onClick={handleOpenMenu}>
				{menuButton}
			</div>
		</div>
	);
};

export default Menu;
