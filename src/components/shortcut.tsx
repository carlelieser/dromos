import React, {useState} from "react";
import {
	MdPlayArrow,
} from "react-icons/all";
import Button from "./button";
import moment from "moment";
import AddShortcutModal from "./modals/add-shortcut";

interface IMouseCoordinates {
	x: number;
	y: number;
}

export interface IAction {
	id: string;
	type: "mouse" | "keyboard" | "prompt" | "delay";
	duration?: number;
	position?: IMouseCoordinates;
	message?: string;
}

export interface IShortcut {
	id: string;
	name: string;
	createdOn: number;
	actions: Array<IAction>;
	executeActions?: (actions: Array<IAction>) => void;
	addShortcut?: (shortcut: IShortcut) => void;
}

const Shortcut = ({ id, name, createdOn, actions, executeActions, addShortcut}: IShortcut) => {
	const [showEditShortcutModal, setShowEditShortcutModal] = useState<boolean>(false);
	const defaultShortcut: IShortcut = {
		id,
		name,
		createdOn,
		actions,
		executeActions
	}

	const openEditShortcutModal = () => {
		setShowEditShortcutModal(true);
	}

	const closeEditShortcutModal = () => {
		setShowEditShortcutModal(false);
	}

	const handleEditShortcut = () => {
		openEditShortcutModal();
	}

	return (
		<>
		{addShortcut !== undefined ? <AddShortcutModal title={"Edit shortcut"} show={showEditShortcutModal} close={closeEditShortcutModal} addShortcut={addShortcut} defaultShortcut={defaultShortcut}/> : null}
		<div
			className={"bg-white rounded-lg shadow-sm py-3 px-4 transition ease-in-out hover:bg-indigo-500 hover:shadow-lg group"} onClick={handleEditShortcut}>
			<div className={"flex space-x-4"}>
				<div>
					<Button icon={<MdPlayArrow size={24} color={"white"} />} size={14} bg={"indigo-500"}
							onClick={() => {
								if (executeActions) executeActions(actions);
							}} />
				</div>
				<div className={"flex flex-col space-y-1"}>
					<div
						className={"font-semibold text-lg group-hover:text-white"}>{name.length ? name : "Untitled"}</div>
					<div
						style={{
							fontSize: 10
						}}
						className={"flex items-center justify-center space-x-2 font-medium uppercase opacity-70 group-hover:text-white"}>
						<div>{moment.utc(createdOn).fromNow()}</div>
						<div className={"w-1 h-1 rounded-full bg-gray-300"} />
						<div>{actions.length}{" "}{actions.length === 1 ? "action" : "actions"}</div>
					</div>
				</div>
			</div>
		</div>
		</>
	);
};

export default Shortcut;
