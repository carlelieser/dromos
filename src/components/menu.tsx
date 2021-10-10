import React, { useEffect, useState } from "react";
import { IconType } from "react-icons";
import uuid from "uuid-random";

const $ = require("jquery");

interface IMenuItemProps {
	label: string;
	onClick?: () => void;
	icon?: IconType;
}

export const MenuItem = ({ label, icon, onClick }: IMenuItemProps) => {
	const Icon = icon ?? null;
	const handleClick = () => {
		if (onClick) onClick();
	}
	return (
		<div className={"px-4 py-2 whitespace-nowrap flex items-center space-x-2 hover:bg-gray-50"} onClick={handleClick}>
			{Icon ? <Icon size={16} opacity={.7}/> : null}
			<div>{label}</div>
		</div>
	);
};

const Menu = ({ menuButton, children }) => {
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
	}

	const handleCloseMenuIfOpen = (element) => {
		let targetId = `menu-${id}`;
		if ($(element).attr("id") !== targetId || $(element).parentsUntil(`#${targetId}`).length === 0) {
			closeMenu();
		}
	}

	useEffect(() => {
		setId(uuid());
		$(document).on("click", handleCloseMenuIfOpen);

		return () => {
			$(document).off("click", handleCloseMenuIfOpen);
		}
	}, []);

	return (
		<div className={"relative z-100"} id={`menu-${id}`}>
			<div onClick={handleOpenMenu}>
				{menuButton}
			</div>
			<div
				className={`rounded-lg transition ease-in-out transform bg-white shadow-lg absolute top-0 right-0 font-semibold overflow-hidden text-xs ${menuVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1.5 pointer-events-none"}`}>
				{children}
			</div>
		</div>
	);
};

export default Menu;
