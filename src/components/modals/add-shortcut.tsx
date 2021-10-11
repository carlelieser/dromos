import React, { useEffect, useState } from "react";
import Button from "../button";
import {
	BiMessageAltDots,
	CgRecord,
	CgTrash,
	MdArrowUpward,
	MdClose,
	MdDragHandle,
	MdKeyboard,
	MdMoreVert,
	MdTimer,
	FiTrash2,
	RiMapPinAddLine
} from "react-icons/all";
import AddDelayModal from "./add-delay";
import { ipcRenderer } from "electron";
import { IAction, IShortcut } from "../shortcut";
import emptyState from "../../actions-empty-state.svg";
import uuid from "uuid-random";
import Modal from "../modal";
import Menu, { MenuItem } from "../menu";
import { MdAdd } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UseAnimations from "react-useanimations";
import infinity from "react-useanimations/lib/infinity";
import AddTypingAction from "./add-typing-action";
import ShortcutAction from "../shortcut-action";

const clone = require("clone");

interface IAddShortcutModalProps {
	title: string;
	show: boolean;
	close: () => void;
	addShortcut: (shortcut: IShortcut) => void;
	removeShortcut: (id: string) => void;
	defaultShortcut?: IShortcut;
}

const ActionMenu = ({
	menuButton,
	beginRecording,
	openAddDelayModal,
	openAddKeyboardCommandModal,
	addPromptAction,
	closeTarget
}) => {
	return (
		<Menu closeTarget={closeTarget} menuButton={menuButton}>
			<MenuItem
				label={"Record action"}
				icon={CgRecord}
				onClick={beginRecording}
			/>
			<MenuItem
				label={"Add prompt"}
				icon={BiMessageAltDots}
				onClick={addPromptAction}
			/>
			<MenuItem
				label={"Add delay"}
				icon={MdTimer}
				onClick={openAddDelayModal}
			/>
			<MenuItem
				label={"Type message"}
				icon={MdKeyboard}
				onClick={openAddKeyboardCommandModal}
			/>
		</Menu>
	);
};

const AddShortcutModal = ({
	title,
	show,
	close,
	addShortcut,
	removeShortcut,
	defaultShortcut
}: IAddShortcutModalProps) => {
	const [shortcut, setShortcut] = useState<IShortcut>();
	const [actions, updateActions] = useState<Array<IAction>>([]);
	const [recordingAction, setRecordingAction] = useState<boolean>(false);
	const [actionPlacementIndex, setActionPlacementIndex] =
		useState<number>(-1);
	const [addDelayModalVisible, setAddDelayModalVisible] =
		useState<boolean>(false);
	const [addKeyboardCommandModalVisible, setAddKeyboardCommandModalVisible] =
		useState<boolean>(false);

	const updateActionPlacementIndex = (
		index: number,
		callback?: () => void
	) => {
		setActionPlacementIndex(index);
		if (typeof callback === "function") callback();
	};

	const openAddDelayModal = () => {
		setAddDelayModalVisible(true);
	};

	const openAddKeyboardCommandModal = () => {
		setAddKeyboardCommandModalVisible(true);
	};

	const closeAddKeyboardCommandModal = () => {
		setAddKeyboardCommandModalVisible(false);
	};

	const closeAddDelayModal = () => {
		setAddDelayModalVisible(false);
	};

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
		};

		handleAddShortcutAction(null, promptAction);
	};

	const addDelayAction = (duration: number) => {
		const delayAction = {
			id: uuid(),
			type: "delay",
			duration
		};

		handleAddShortcutAction(null, delayAction);
	};

	const addKeyboardCommandAction = (command: IAction) => {
		handleAddShortcutAction(null, command);
	};

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
		if (actionPlacementIndex === -1) {
			updateActions((prevActions) => [...prevActions, action]);
		} else {
			updateActions((prevActions) => {
				let actions = [...prevActions];
				actions.splice(actionPlacementIndex, 0, action);
				return actions;
			});
		}
	};

	const handleShortcutNameChange = (e) => {
		let value = e.target.value;
		let shortcutCopy = clone(shortcut);
		shortcutCopy.name = value;
		setShortcut(shortcutCopy);
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		if (!result.destination) return;
		const items = reorder(
			actions,
			result.source.index,
			result.destination.index
		) as Array<IAction>;
		updateActions(items);
	};

	const handleRemove = () => {
		if (!shortcut?.id) return;
		removeShortcut(shortcut.id);
	};

	const cancelRecording = () => {
		ipcRenderer.send("stop-recording");
		setRecordingAction(false);
	};

	useEffect(() => {
		updateActions(defaultShortcut ? defaultShortcut.actions : []);
		setShortcut(
			defaultShortcut ?? {
				id: uuid(),
				actions: [],
				name: "",
				createdOn: Date.now()
			}
		);
		ipcRenderer.removeAllListeners("add-shortcut-action");
		ipcRenderer.on("add-shortcut-action", handleAddShortcutAction);
		return () => {
			ipcRenderer.removeAllListeners("add-shortcut-action");
		};
	}, []);

	useEffect(() => {
		if (show) {
			updateActions(defaultShortcut ? defaultShortcut.actions : []);
			setShortcut(
				defaultShortcut ?? {
					id: uuid(),
					actions: [],
					name: "",
					createdOn: Date.now()
				}
			);
		}
	}, [show]);

	useEffect(() => {
		if (!shortcut) return;
		let sc = clone(shortcut);
		sc.actions = clone(actions);
		setShortcut(sc);
	}, [actions]);

	return (
		<>
			<Modal title={title} show={show} close={close}>
				<AddDelayModal
					show={addDelayModalVisible}
					close={closeAddDelayModal}
					addDelayAction={addDelayAction}
				/>
				<AddTypingAction
					show={addKeyboardCommandModalVisible}
					close={closeAddKeyboardCommandModal}
					addKeyboardCommandAction={addKeyboardCommandAction}
				/>
				<div>
					<div className={"uppercase text-xs opacity-70"}>Name</div>
					<input
						type={"text"}
						value={shortcut?.name}
						onChange={handleShortcutNameChange}
						className={
							"text-xl outline-none font-semibold w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 transition ease-in-out"
						}
						placeholder={"Untitled"}
					/>
				</div>
				<div className={"mt-4"}>
					<div className={"flex items-center justify-between"}>
						<div className={"font-semibold"}>Sequence</div>
						<div className={"flex items-center space-x-4"}>
							<Button
								icon={MdAdd}
								className={"bg-indigo-500 text-white w-6 h-6"}
								onClick={updateActionPlacementIndex.bind(
									this,
									-1,
									beginRecording
								)}
							/>
							<ActionMenu
								closeTarget={null}
								menuButton={
									<Button
										icon={MdMoreVert}
										className={"bg-gray-50 w-6 h-6"}
										onClick={() => {
											updateActionPlacementIndex(-1);
										}}
									/>
								}
								beginRecording={beginRecording}
								openAddKeyboardCommandModal={
									openAddKeyboardCommandModal
								}
								openAddDelayModal={openAddDelayModal}
								addPromptAction={addPromptAction}
							/>
						</div>
					</div>
					{actions.length ? (
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId={"actions"}>
								{(provided, snapshot) => (
									<div
										className={
											"gap-4 flex flex-col hide-scrollbar my-2 w-full pb-4 pt-2"
										}
										style={{
											maxHeight: 200,
											overflowX: "hidden"
										}}
										{...provided.droppableProps}
										ref={provided.innerRef}
									>
										{actions.map((action, index) => {
											return (
												<Draggable
													key={action.id}
													index={index}
													draggableId={action.id}
												>
													{(provided, snapshot) => (
														<ShortcutAction
															innerRef={
																provided.innerRef
															}
															provided={provided}
															snapshot={snapshot}
															action={action}
															index={index}
															updateActionPlacementIndex={
																updateActionPlacementIndex
															}
															addPromptAction={
																addPromptAction
															}
															ActionMenu={
																ActionMenu
															}
															openAddDelayModal={
																openAddDelayModal
															}
															openAddKeyboardCommandModal={
																openAddKeyboardCommandModal
															}
															beginRecording={
																beginRecording
															}
															remove={
																removeAction
															}
														/>
													)}
												</Draggable>
											);
										})}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					) : (
						<div
							className={
								"flex flex-col items-center p-4 text-center"
							}
						>
							<div className={"p-4"}>
								<img src={emptyState} className={"h-14"} />
							</div>
							<div className={"space-y-2"}>
								<div
									className={
										"font-semibold opacity-80 text-sm"
									}
								>
									Create a sequence by recording actions.
								</div>
							</div>
						</div>
					)}
				</div>
				<div className={"mt-2 flex items-center justify-end"}>
					{recordingAction ? (
						<div
							className={
								"rounded-full flex items-center space-x-2 px-6 py-2 bg-yellow-500 font-semibold text-xs"
							}
						>
							<UseAnimations size={24} animation={infinity} />
							<div>Waiting for action</div>
							<div
								className={
									"uppercase transition ease-in-out opacity-50 hover:opacity-90 cursor-pointer text-xs"
								}
								onClick={cancelRecording}
							>
								Cancel
							</div>
						</div>
					) : null}
				</div>
				<div className="flex items-center justify-end space-x-4 mt-4">
					{defaultShortcut ? (
						<Button
							label={"Remove"}
							icon={CgTrash}
							className={"bg-gray-100"}
							onClick={handleRemove}
						/>
					) : null}
					<Button
						label={defaultShortcut ? "Update" : "Add shortcut"}
						icon={defaultShortcut ? MdArrowUpward : MdAdd}
						className={"bg-green-300"}
						onClick={saveShortcut}
					/>
				</div>
			</Modal>
		</>
	);
};

export default AddShortcutModal;
