import React from "react";
import Logo from "./logo";

const Header = () => {
	return (
		<div className={"w-full h-14 shadow-sm fixed top-0"}>
			<div
				className={
					"w-full h-14 py-6 px-6 bg-indigo-900 space-x-2 header flex items-center"
				}
			>
				<Logo height={32} />
				<div className={"font-semibold text-lg text-white"}>Dromos</div>
			</div>
		</div>
	);
};

export default Header;
