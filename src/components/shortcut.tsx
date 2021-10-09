import React from "react";
import {
	MdBuild,
	MdPlayArrow,
	MdPlayCircle,
	MdRunCircle,
	MdRunningWithErrors,
	MdShortcut,
	MdSubscriptions
} from "react-icons/all";
import Button from "./button";
import moment from "moment";
import {ipcRenderer} from "electron";

interface IMouseCoordinates {
	x: number;
	y: number;
}

export interface IAction {
	id: string;
	type: "mouse" | "keyboard";
	position?: IMouseCoordinates;
	message?: string;
}

export interface IShortcut {
	name: string;
	createdOn: number;
	actions: Array<IAction>;
}

const Shortcut = ({ name, createdOn, actions }: IShortcut) => {

	const delay = (duration: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, duration)
		});
	}

	const play = async () => {
		console.log("applying these actions", actions);
		for await (const action of actions) {
			await delay(2000);
			ipcRenderer.send("execute-action", action);
		}
	};

	return (
		<div
			className={"bg-white rounded-lg shadow-sm py-3 px-4 transition ease-in-out hover:bg-indigo-500 hover:shadow-lg group"}>
			<div className={"flex space-x-4"}>
				<div>
					<Button icon={<MdPlayArrow size={24} color={"white"} />} size={14} bg={"indigo-500"}
							onClick={play} />
				</div>
				<div className={"flex flex-col space-y-1"}>
					<div
						className={"font-semibold text-lg group-hover:text-white"}>{name.length ? name : "Untitled"}</div>
					<div
						style={{
							fontSize: 12
						}}
						className={"flex items-center justify-center space-x-2 font-medium uppercase opacity-70 group-hover:text-white"}>
						<div>{moment.utc(createdOn).fromNow()}</div>
						<div className={"w-1 h-1 rounded-full bg-gray-300"} />
						<div>{actions.length}{" "}{actions.length === 1 ? "action" : "actions"}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shortcut;
