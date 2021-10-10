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
	MdSave,
	MdTimer
} from "react-icons/all";
import AddDelayModal from "./add-delay";
import { ipcRenderer } from "electron";
import { IAction, IShortcut } from "../shortcut";
import emptyState from "../../actions-empty-state.svg";
import uuid from "uuid-random";
import Modal from "../../modal";

const clone = require("clone");

interface IAddShortcutModalProps {
	title: string;
	show: boolean;
	close: () => void;
	addShortcut: (shortcut: IShortcut) => void;
	defaultShortcut?: IShortcut;
}

const AddShortcutModal = ({ title, show, close, addShortcut, defaultShortcut}: IAddShortcutModalProps) => {
	const [shortcut, setShortcut] = useState<IShortcut>();
	const [actions, updateActions] = useState<Array<IAction>>([]);
	const [recordingAction, setRecordingAction] = useState<boolean>(false);
	const [addDelayModalVisible, setAddDelayModalVisible] = useState<boolean>(false);

	const openAddDelayModal = () => {
		setAddDelayModalVisible(true);
	}

	const closeAddDelayModal = () => {
		setAddDelayModalVisible(false);
	}

	const removeAction = (index) => {
		let actionsCopy = clone(actions);
		actionsCopy = actionsCopy.filter((item, pos) => {
			return pos !== index;
		});
		updateActions(actionsCopy);
	};

	const addPromptAction = () => {
		const promptAction = {
			id: uuid(),
			type: "prompt"
		}

		handleAddShortcutAction(null, promptAction);
	}

	const addDelayAction = (duration: number) => {
		const delayAction = {
			id: uuid(),
			type: "delay",
			duration
		}

		handleAddShortcutAction(null, delayAction);
	}

	const beginRecording = () => {
		setRecordingAction(true);
		ipcRenderer.send("begin-recording");
	};

	const saveShortcut = () => {
		if (shortcut) addShortcut(shortcut);
		close();
	};

	const handleAddShortcutAction = (e, action) => {
		setRecordingAction(false);
		updateActions((prevActions) => [...prevActions, action]);
	};

	const handleShortcutNameChange = (e) => {
		let value = e.target.value;
		let shortcutCopy = clone(shortcut);
		shortcutCopy.name = value;
		setShortcut(shortcutCopy);
	}

	useEffect(() => {
		updateActions(defaultShortcut ? defaultShortcut.actions : []);
		setShortcut(defaultShortcut ?? {
				id: uuid(),
				actions: [],
				name: "",
				createdOn: Date.now()
			});
		ipcRenderer.removeAllListeners("add-shortcut-action");
		ipcRenderer.on("add-shortcut-action", handleAddShortcutAction);
	}, []);

	useEffect(() => {
		if (show) {
			updateActions(defaultShortcut ? defaultShortcut.actions : []);
			setShortcut(defaultShortcut ?? {
				id: uuid(),
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
			<Modal title={title} show={show} close={close}>
				<AddDelayModal show={addDelayModalVisible} close={closeAddDelayModal} addDelayAction={addDelayAction}/>
				<div>
					<div className={"uppercase text-xs opacity-70"}>Name</div>
					<input type={"text"}
							value={shortcut?.name}
							onChange={handleShortcutNameChange}
						   className={"text-xl outline-none font-semibold w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 transition ease-in-out"}
						   placeholder={"Untitled"} />
				</div>
				<div className={"mt-1"}>
					<div className={"font-semibold"}>Sequence</div>
					{actions.length ? <div className={"grid gap-4 grid-cols-3 hide-scrollbar mb-2 w-full py-4"} style={{maxHeight: 140, overflowX: "hidden"}}>
						{actions.map((action, index) => {
							return (
								<div
									className={"px-3 py-3 rounded-lg bg-indigo-50 text-xs flex flex-col items-center justify-center font-semibold relative group hover:bg-indigo-500 transition text-center"}>
									<div
										className={"cursor-pointer transition ease-in-out group-hover:opacity-100 opacity-0 pointer-events-none group-hover:pointer-events-auto top-0 right-0 w-5 h-5 rounded-full absolute bg-black flex items-center justify-center hover:bg-red-500 transform scale-75 group-hover:scale-100 group -mr-1 -mt-1"}
										onClick={removeAction.bind(this, index)}>
										<MdClose className={"text-white opacity-90"} /></div>
										<div className="rounded-full w-8 h-8 bg-indigo-100 flex items-center group-hover:bg-white justify-center text-indigo-800 mb-1">
											{index + 1}
											</div>

									{/* {action.type === "mouse" ? <MdMouse className="group-hover:text-white text-indigo-900" size={24} /> :
										<MdKeyboard className="group-hover:text-white text-indigo-900" size={24} />} */}

									<div className={"opacity-90 text-xs flex flex-col items-center mt-1 space-y-1"}>
										{ action.position || action.message || action.duration ?
											<div className="group-hover:text-white">
											{action.position ? <div>{action.position.x}, {action.position.y}</div> : null }
											
											{action.message?.length ? <div>"{action.message}"</div> : null}

											{action.duration ? <div className="space-x-1 whitespace-nowrap flex w-full"><div>{action.duration}</div><div className="font-semibold opacity-80">MS</div></div> : null}
										</div>
										: null}
										<div className={"text-xs capitalize opacity-70 group-hover:text-white"}>{action.type}</div>
									</div>
								</div>
							);
						})}
					</div> : <div className={"flex flex-col items-center p-4 text-center"}>
						<div className={"p-4"}>
							<img src={emptyState} className={"h-14"} />
						</div>
						<div className={"space-y-2"}>
							<div className={"font-semibold opacity-80 text-sm"}>Create a sequence by recording actions.</div>
						</div>
					</div>}
				</div>
				<div className={"flex justify-end mt-4"}>
					<div className={"space-y-2"}>
						<div className="flex items-center justify-end">
<Button label={recordingAction ? "Waiting" : "Record action"}
								icon={recordingAction ? <MdPending size={24} className={"text-gray-700"} /> :
									<CgRecord size={24} color={"white"} />} size={12}
								bg={recordingAction ? "gray-200" : "indigo-500"}
								color={recordingAction ? "text-gray-700" : "white"} onClick={beginRecording} disabled={recordingAction}/>
							</div>
								<div className={"scale-75 flex items-center space-x-4 justify-end transform right-0 -mr-10"}>
									<Button label="Wait for prompt" icon={<MdPending size={24}/>} bg="gray-100" onClick={addPromptAction}/>
							<Button label="Delay" icon={<MdTimer size={24}/>} bg="gray-100" onClick={openAddDelayModal}/>
								</div>
						<div className={"scale-75 flex items-center space-x-4 justify-end transform right-0 -mr-10"}>
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
