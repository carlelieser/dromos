import React from "react";
import logo from "../logo.svg";

const Logo = ({ flavor = "light", height = 24 }) => {
	return (
		<div className={"w-auto"} style={{ height }}>
			<img
				className={"w-full h-full object-contain"}
				src={flavor ? logo : ""}
			/>
		</div>
	);
};

export default Logo;
