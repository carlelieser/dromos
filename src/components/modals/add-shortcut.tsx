import React, { useEffect, useState } from "react";
import Button from "../button";
import {
	CgRecord,
	MdArrowDownward,
	MdClose,
	MdKeyboard,
	MdMouse,
	MdPending,
	MdPendingActions,
	MdSave
} from "react-icons/all";
import Modal from "../../modal";
import { ipcRenderer } from "electron";
import { IAction, IShortcut } from "../shortcut";
import emptyState from "../../actions-empty-state.svg";

const clone = require("clone");

const AddShortcutModal = ({ show, close, addShortcut }) => {
	const [shortcut, setShortcut] = useState<IShortcut>();
	const [actions, updateActions] = useState<Array<IAction>>([]);
	const [recordingAction, setRecordingAction] = useState<boolean>(false);

	const removeAction = (index) => {
		let actionsCopy = clone(actions);
		actionsCopy = actionsCopy.filter((item, pos) => {
			return pos !== index;
		});
		updateActions(actionsCopy);
	};

	const beginRecording = () => {
		setRecordingAction(true);
		ipcRenderer.send("begin-recording");
	};

	const saveShortcut = () => {
		addShortcut(shortcut);
		close();
	};

	const handleAddShortcutAction = (e, action) => {
		setRecordingAction(false);
		updateActions((prevActions) => [...prevActions, action]);
	};

	useEffect(() => {
		setShortcut({
			actions: [],
			name: "",
			createdOn: Date.now()
		});
		ipcRenderer.removeAllListeners("add-shortcut-action");
		ipcRenderer.on("add-shortcut-action", handleAddShortcutAction);
	}, []);

	useEffect(() => {
		if (show) {
			updateActions([]);
			setShortcut({
				actions: [],
				name: "",
				createdOn: Date.now()
			});
		}
	}, [show]);

	useEffect(() => {
		if (!shortcut) return;
		let sc = clone(shortcut);
		sc.actions = clone(actions);
		setShortcut(sc);
	}, [actions]);

	useEffect(() => {
		console.log(shortcut);
	}, [shortcut]);

	return (
		<>
			<Modal title={"Add shortcut"} show={show} close={close}>
				<div>
					<div className={"uppercase text-xs opacity-70"}>Name</div>
					<input type={"text"}
						   className={"text-xl outline-none font-semibold w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 transition ease-in-out"}
						   placeholder={"Untitled"} />
				</div>
				<div className={"mt-4"}>
					<div className={"font-semibold"}>Sequence</div>
					{actions.length ? <div className={"grid gap-4 grid-cols-3 my-4 w-full"}>
						{actions.map((action, index) => {
							return (
								<div
									className={"px-5 py-2 rounded-lg bg-gray-100 space-x-2 text-xs flex flex-col text-center items-center font-semibold relative group"}>
									<div
										className={"cursor-pointer transition ease-in-out group-hover:opacity-100 opacity-0 pointer-events-none group-hover:pointer-events-auto top-0 right-0 w-5 h-5 rounded-full absolute bg-black flex items-center justify-center hover:bg-red-500 transform scale-75 group-hover:scale-100 group -mr-1 -mt-1"}
										onClick={removeAction.bind(this, index)}>
										<MdClose className={"text-white opacity-90"} /></div>
									{action.type === "mouse" ? <MdMouse size={24} opacity={.40} /> :
										<MdKeyboard size={24} opacity={.40} />}
									<div className={"opacity-90 text-xs whitespace-nowrap mt-1 space-y-2"}>
										<div>{action.position ? `${action.position.x}, ${action.position.y}` : ""}</div>
										<div>{action.message}</div>
										<div className={"text-xs capitalize opacity-60"}>{action.type}</div>
									</div>
								</div>
							);
						})}
					</div> : <div className={"flex flex-col items-center p-4 text-center"}>
						<div className={"p-4"}>
							<img src={emptyState} className={"h-16"} />
						</div>
						<div className={"space-y-2"}>
							<div className={"font-semibold opacity-80"}>Create a sequence by recording actions.</div>
						</div>
					</div>}
				</div>
				<div className={"flex justify-end mt-4"}>
					<div className={"space-y-2"}>
						<Button label={recordingAction ? "Waiting" : "Record action"}
								icon={recordingAction ? <MdPending size={24} className={"text-gray-700"} /> :
									<CgRecord size={24} color={"white"} />} size={12}
								bg={recordingAction ? "gray-200" : "indigo-500"}
								color={recordingAction ? "text-gray-700" : "white"} onClick={beginRecording} disabled={recordingAction}/>
						<div className={"scale-75 flex justify-end transform right-0 -mr-5"}>
							<Button label={"Save"} icon={<MdArrowDownward />} bg={"green-400"}
									onClick={saveShortcut} />
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default AddShortcutModal;
