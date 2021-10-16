import React, { useState } from "react";
import { MdPlayArrow } from "react-icons/all";
import Button from "./button";
import moment from "moment";
import AddShortcutModal from "./modals/add-shortcut";

interface IMouseCoordinates {
	x: number;
	y: number;
}

export interface ILoopData {
	actions: Array<IAction>;
	times: number;
}

interface IKeyboardCommand {
	main: string;
	modifiers: Array<string>;
}

export interface IAction {
	id: string;
	type: "mouse" | "keyboard" | "prompt" | "delay" | "loop";
	loop?: ILoopData;
	duration?: number;
	position?: IMouseCoordinates;
	keys?: IKeyboardCommand;
	message?: string;
}

export interface IShortcut {
	id: string;
	name: string;
	createdOn: number;
	actions: Array<IAction>;
	executeActions?: (actions: Array<IAction>) => void;
	addShortcut?: (shortcut: IShortcut) => void;
	removeShortcut?: (id: string) => void;
}

const Shortcut = ({
	id,
	name,
	createdOn,
	actions,
	executeActions,
	addShortcut,
	removeShortcut
}: IShortcut) => {
	const [showEditShortcutModal, setShowEditShortcutModal] =
		useState<boolean>(false);
	const defaultShortcut: IShortcut = {
		id,
		name,
		createdOn,
		actions
	};

	const openEditShortcutModal = () => {
		setShowEditShortcutModal(true);
	};

	const closeEditShortcutModal = () => {
		setShowEditShortcutModal(false);
	};

	const handleEditShortcut = () => {
		openEditShortcutModal();
	};

	return (
		<>
			{addShortcut !== undefined && removeShortcut !== undefined ? (
				<AddShortcutModal
					title={"Edit shortcut"}
					show={showEditShortcutModal}
					close={closeEditShortcutModal}
					addShortcut={addShortcut}
					defaultShortcut={defaultShortcut}
					removeShortcut={removeShortcut}
				/>
			) : null}
			<div
				className={
					"bg-white rounded-lg cursor-pointer shadow-sm py-3 px-4 transition ease-in-out hover:bg-indigo-500 hover:shadow-lg group"
				}
				onClick={handleEditShortcut}
			>
				<div className={"flex space-x-4 items-center"}>
					<div>
						<Button
							icon={MdPlayArrow}
							className={"bg-indigo-500 text-white w-9 h-9"}
							onClick={(e) => {
								e.stopPropagation();
								if (executeActions) executeActions(actions);
							}}
						/>
					</div>
					<div className={"flex flex-col space-y-1"}>
						<div className={"font-semibold group-hover:text-white"}>
							{name.length ? name : "Untitled"}
						</div>
						<div
							style={{
								fontSize: 10
							}}
							className={
								"flex items-center space-x-2 font-medium uppercase opacity-70 group-hover:text-white"
							}
						>
							<div>
								{actions.length}{" "}
								{actions.length === 1 ? "action" : "actions"}
							</div>
							<div
								className={"w-1 h-1 rounded-full bg-gray-300"}
							/>
							<div>{moment.utc(createdOn).fromNow()}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Shortcut;
