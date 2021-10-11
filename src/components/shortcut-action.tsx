import React, { useEffect, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";
import { MdDragHandle } from "react-icons/md";
import { RiMapPinAddLine } from "react-icons/ri";
import Button from "./button";

const ShortcutAction = ({
	provided,
	snapshot,
	innerRef,
	index,
	action,
	remove,
	ActionMenu,
	beginRecording,
	openAddKeyboardCommandModal,
	openAddDelayModal,
	addPromptAction,
	updateActionPlacementIndex
}) => {
	const containerRef = useRef(null);

	useEffect(() => {
		console.log(provided.dragHandleProps)
		innerRef(containerRef.current);
	}, [containerRef]);

	return (
		<div
			ref={containerRef}
			style={provided.draggableProps.style}
			{...provided.draggableProps}
			className={`px-3 py-3 rounded-lg text-xs flex items-center space-x-4 font-semibold group hover:bg-indigo-500 transition text-center ${
				snapshot.isDragging ? "bg-white shadow-lg" : "bg-indigo-50"
			}`}
		>
			<div {...provided.dragHandleProps}>
				<div
					className="rounded-full w-8 h-8 bg-indigo-100 flex items-center group-hover:bg-white justify-center text-indigo-800 group-hover:shadow-lg"
					style={{
						minWidth: "calc(.25rem * 8)"
					}}
				>
					<div className={"hidden group-hover:block"}>
						<MdDragHandle size={18} />
					</div>
					<div className={"group-hover:hidden"}>{index + 1}</div>
				</div>
			</div>


			<div
				className={
					"opacity-90 text-xs flex flex-col text-left space-y-1"
				}
				style={{
					minWidth: 100
				}}
			>
				{action.position || action.message || action.duration ? (
					<div className="group-hover:text-white">
						{action.position ? (
							<div>
								{action.position.x}, {action.position.y}
							</div>
						) : null}

						{action.message?.length ? (
							<div>
								{action.message === "\t"
									? "TAB"
									: action.message === "\r"
									? "ENTER"
									: `"${action.message}"`}
							</div>
						) : null}

						{action.duration ? (
							<div className="space-x-1 whitespace-nowrap flex w-full">
								<div>{action.duration}</div>
								<div className="font-semibold opacity-80">
									MS
								</div>
							</div>
						) : null}
					</div>
				) : null}
				<div
					className={
						"text-xs capitalize opacity-70 group-hover:text-white"
					}
				>
					{action.type}
				</div>
			</div>
			<div
				className={
					"w-full transition flex space-x-2 items-center justify-end opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 translate-y-1.5 transform ease-in-out delay-75"
				}
			>
				<ActionMenu
					menuButton={
						<div className={"transform rotate-180 cursor-pointer"}>
							<Button
								icon={RiMapPinAddLine}
								iconSize={18}
								className={"w-8 h-8 group-hover:text-white"}
								onClick={updateActionPlacementIndex.bind(
									this,
									index
								)}
							/>
						</div>
					}
					closeTarget={provided.innerRef}
					beginRecording={beginRecording}
					openAddKeyboardCommandModal={openAddKeyboardCommandModal}
					openAddDelayModal={openAddDelayModal}
					addPromptAction={addPromptAction}
				/>

				<ActionMenu
					closeTarget={containerRef.current}
					menuButton={
						<Button
							icon={RiMapPinAddLine}
							iconSize={18}
							className={"w-8 h-8 group-hover:text-white"}
							onClick={updateActionPlacementIndex.bind(
								this,
								index + 1
							)}
						/>
					}
					beginRecording={beginRecording}
					openAddKeyboardCommandModal={openAddKeyboardCommandModal}
					openAddDelayModal={openAddDelayModal}
					addPromptAction={addPromptAction}
				/>
				<Button
					icon={FiTrash2}
					iconSize={18}
					className={"w-8 h-8 group-hover:text-white"}
					onClick={remove.bind(this, index)}
				/>
			</div>
		</div>
	);
};

export default ShortcutAction;
