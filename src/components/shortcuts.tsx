import React from "react";
import Shortcut from "./shortcut";
import emptyState from "../empty-state.svg";
import Button from "./button";
import {
	MdAdd,
	MdPendingActions
} from "react-icons/all";
import AddShortcutModal from "./modals/add-shortcut";

const Shortcuts = ({
					   shortcuts,
					   showAddShortcutModal,
					   openAddShortcutModal,
					   closeAddShortcutModal,
					   addShortcut,
					   removeShortcut,
					   executeActions
				   }) => {
	return (
		<div className={"space-y-4 px-6 pt-12 bg-gray-100 w-full h-full"}>
			<AddShortcutModal title={"Add shortcut"} show={showAddShortcutModal} close={closeAddShortcutModal}
							  addShortcut={addShortcut} removeShortcut={removeShortcut} />
			<div className={"z-0"}>
				{shortcuts.length ? <div className={"space-y-4"}>
					<div className={"flex items-center justify-between mt-8"}>
						<div className={"text-2xl font-semibold"}>Shortcuts</div>
						<div>
							<Button icon={<MdAdd color={"white"} />} size={6} bg={"indigo-500"} color={"white"}
									onClick={openAddShortcutModal} />
						</div>
					</div>
					<div className={"grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}>
						{
							shortcuts.map((shortcut) => {
								return (
									<Shortcut {...shortcut} executeActions={executeActions} addShortcut={addShortcut} removeShortcut={removeShortcut}/>
								);
							})
						}
					</div>
				</div> : <div className={"flex flex-col items-center p-4 text-center"}>
					<div className={"p-8"}>
						<img src={emptyState} />
					</div>
					<div className={"space-y-2"}>
						<div className={"font-semibold opacity-80"}>We couldn't find any shortcuts yet.</div>
						<div className={"opacity-70 text-xs"}>Shortcuts will be listed here if you have any.
						</div>
					</div>
					<div className={"flex justify-center mt-4"}>
						<Button label={"Add shortcut"} bg={"indigo-500"} color={"white"}
								icon={<MdPendingActions color={"white"} />} onClick={openAddShortcutModal} />
					</div>
				</div>}
			</div>
		</div>
	);
};

export default Shortcuts;
