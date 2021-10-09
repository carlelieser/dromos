import React from "react";
import Logo from "./logo";
import { MdAdd } from "react-icons/all";
import Button from "./button";

const Header = () => {
	return (
		<div className={"w-full h-6 shadow-sm absolute top-0"}>
			<div className={"w-full h-12 py-2 px-6 bg-indigo-900 header flex items-center justify-center"}>
				<Logo height={18} />
			</div>
		</div>
	);
};

export default Header;
