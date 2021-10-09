import React from "react";
import lightLogo from "../logo.svg";

const Logo = ({ flavor = "light", height = 24 }) => {
	return (
		<div className={"w-auto"} style={{ height }}>
			<img className={"w-full h-full object-contain"} src={flavor ? lightLogo : ""} />
		</div>
	);
};

export default Logo;
