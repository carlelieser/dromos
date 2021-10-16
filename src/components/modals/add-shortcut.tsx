import React, { useEffect, useState, useRef } from "react";
import Button from "../button";
import {
	BiMessageAltDots,
	CgRecord,
	CgTrash,
	MdOutlineRemoveDone,
	MdArrowUpward,
	MdClose,
	MdDragHandle,
	MdKeyboard,
	MdMoreVert,
	MdTimer,
	FiTrash2,
	RiMapPinAddLine,
	TiArrowRepeat,
	MdOutlineDoneAll,
	FiChevronUp,
	FiChevronDown
} from "react-icons/all";
import AddDelayModal from "./add-delay";
import { ipcRenderer } from "electron";
import { IAction, ILoopData, IShortcut } from "../shortcut";
import emptyStateBg from "../../img/tasks.svg";
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
	const [selectedActions, updateSelectedActions] = useState<Array<string>>(
		[]
	);
	const [allActionsSelected, setAllActionsSelected] = useState<boolean>();

	const [recordingAction, setRecordingAction] = useState<boolean>(false);
	const [addDelayModalVisible, setAddDelayModalVisible] =
		useState<boolean>(false);
	const [addKeyboardCommandModalVisible, setAddKeyboardCommandModalVisible] =
		useState<boolean>(false);
	const [actionSelectionUIVisible, setActionSelectionUIVisible] =
		useState<boolean>();
	const [loopAmount, setLoopAmount] = useState<number>(1);

	const actionPlacementIndexRef = useRef<number>();

	const updateActionPlacementIndex = (
		index: number,
		callback?: () => void
	) => {
		actionPlacementIndexRef.current = index;
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

	const addLoopAction = () => {
		const loopableActions = actions.filter((action) =>
			selectedActions.includes(action.id)
		);
		const action: IAction = {
			id: uuid(),
			type: "loop",
			loop: {
				actions: loopableActions,
				times: loopAmount
			}
		};

		handleAddShortcutAction(null, action);
		deselectAllActions();
		hideActionSelectionUI();
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
		updateActions((prevActions) => {
			let actions = [...prevActions];
			actions.splice(
				actionPlacementIndexRef.current ?? actions.length,
				0,
				action
			);
			return actions;
		});
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

	const showActionSelectionUI = () => {
		setActionSelectionUIVisible(true);
	};

	const hideActionSelectionUI = () => {
		setActionSelectionUIVisible(false);
	};

	const selectAllActions = () => {
		updateSelectedActions(actions.map((action) => action.id));
	};

	const deselectAllActions = () => {
		updateSelectedActions([]);
	};

	const toggleSelectAll = () => {
		const allSelected = selectedActions.length === actions.length;
		if (allSelected) deselectAllActions();
		else selectAllActions();
	};

	const handleSelectionCancel = () => {
		deselectAllActions();
		hideActionSelectionUI();
	};

	const handleLoopAmountChange = (e) => {
		const numbers = e.target.value.match(/\d+/g);
		setLoopAmount(numbers ? numbers[0] : "");
	};

	const handleLoopAmountClick = (e) => {
		e.target.select();
	};

	const incrementLoopAmount = () => {
		setLoopAmount((prevLoopAmount) => Number(prevLoopAmount) + 1);
	};

	const decrementLoopAmount = () => {
		setLoopAmount((prevLoopAmount) => {
			let newAmount = Number(prevLoopAmount) - 1;
			return newAmount < 1 ? 1 : newAmount;
		});
	};

	const toggleActionSelected = (id: string) => {
		const selectedActionsClone = clone(selectedActions);
		const index = selectedActionsClone.indexOf(id);

		if (index > -1) selectedActionsClone.splice(index, 1);
		else selectedActionsClone.push(id);

		updateSelectedActions(selectedActionsClone);
	};

	const menu = [
		{
			label: "Record action",
			icon: CgRecord,
			onClick: beginRecording
		},
		{
			label: "Add prompt",
			icon: BiMessageAltDots,
			onClick: addPromptAction
		},
		{
			label: "Add delay",
			icon: MdTimer,
			onClick: openAddDelayModal
		},
		{
			label: "Type message",
			icon: MdKeyboard,
			onClick: openAddKeyboardCommandModal
		},
		{
			label: "Create loop",
			icon: TiArrowRepeat,
			onClick: showActionSelectionUI,
			hide: actions.length === 0
		}
	];

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

	useEffect(() => {
		setAllActionsSelected(selectedActions.length === actions.length);
	}, [actions, selectedActions]);

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
									actions.length,
									beginRecording
								)}
							/>
							<Menu
								closeTarget={null}
								menuButton={
									<Button
										icon={MdMoreVert}
										className={"bg-gray-50 w-6 h-6"}
										onClick={() => {
											updateActionPlacementIndex(
												actions.length
											);
										}}
									/>
								}
							>
								{menu.map((item, index) => (
									<MenuItem
										key={`main-overflow-item-${index}`}
										{...item}
									/>
								))}
							</Menu>
						</div>
					</div>
					{actionSelectionUIVisible ? (
						<div
							className={
								"mt-4 px-3 py-2 bg-indigo-500 rounded-lg w-full flex items-center justify-center space-x-2 shadow-sm text-xs"
							}
						>
							<div className={"opacity-70 hover:opacity-100"}>
								<Button
									className={
										"w-8 h-8 shadow-none bg-transparent hover:bg-indigo-900 text-white"
									}
									icon={MdClose}
									iconSize={14}
									onClick={handleSelectionCancel}
								/>
							</div>
							<Button
								className={
									"w-8 h-8 shadow-none bg-transparent hover:bg-indigo-900 text-white"
								}
								icon={allActionsSelected ? MdOutlineRemoveDone : MdOutlineDoneAll}
								onClick={toggleSelectAll}
							/>
							{selectedActions.length ? (
								<>
									<div
										className={"h-8 rounded-lg bg-white opacity-10"}
										style={{
											width: 1
										}}
									></div>
									<div
										className={
											"flex items-center text-white space-x-2"
										}
									>
										<div
											className={
												"flex items-center space-x-2"
											}
										>
											<div
												className={
													"flex flex-col items-center justify-center space-y-1"
												}
											>
												<FiChevronUp
													className={
														"opacity-50 hover:opacity-100"
													}
													onClick={
														incrementLoopAmount
													}
												/>
												<FiChevronDown
													className={
														"opacity-50 hover:opacity-100"
													}
													onClick={
														decrementLoopAmount
													}
												/>
											</div>
											<input
												className={
													"bg-transparent border-b-2 border-white py-2 w-8 h-full outline-none font-semibold"
												}
												type={"text"}
												value={loopAmount}
												onClick={handleLoopAmountClick}
												onChange={
													handleLoopAmountChange
												}
												placeholder={"1"}
											/>
										</div>
										<Button
											className={
												"w-8 h-8 shadow-none bg-transparent hover:bg-indigo-900 text-white text-center"
											}
											icon={TiArrowRepeat}
											iconSize={18}
											onClick={addLoopAction}
										/>
									</div>
								</>
							) : null}
						</div>
					) : null}
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
													{(provided, snapshot) => {
														const selected =
															selectedActions.includes(
																action.id
															);
														return (
															<ShortcutAction
																innerRef={
																	provided.innerRef
																}
																provided={
																	provided
																}
																snapshot={
																	snapshot
																}
																action={action}
																index={index}
																menu={menu}
																selectable={
																	actionSelectionUIVisible
																}
																selected={
																	selected
																}
																toggleSelected={
																	toggleActionSelected
																}
																updateActionPlacementIndex={
																	updateActionPlacementIndex
																}
																remove={
																	removeAction
																}
															/>
														);
													}}
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
								<img src={emptyStateBg} className={"h-14"} />
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
