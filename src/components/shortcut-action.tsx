import React, { useEffect, useRef, useState } from "react";
import { FiCheck, FiTrash2, FiCircle } from "react-icons/fi";
import { MdDragHandle } from "react-icons/md";
import { RiMapPinAddLine } from "react-icons/ri";
import { TiArrowRepeat } from "react-icons/ti";
import Button from "./button";
import Menu, { MenuItem } from "./menu";

const ShortcutAction = ({
	provided,
	snapshot,
	innerRef,
	index,
	action,
	remove,
	menu,
	selectable,
	selected,
	toggleSelected,
	updateActionPlacementIndex
}) => {
	const [containerRef, setContainerRef] = useState<any>();

	const updateRef = (ref) => {
		setContainerRef(ref);
		innerRef(ref);
	};

	return (
		<div
			style={provided.draggableProps.style}
			{...provided.draggableProps}
			ref={updateRef}
			className={`px-3 py-3 rounded-lg text-xs flex items-center space-x-4 font-semibold group hover:bg-indigo-500 transition text-center ${
				snapshot.isDragging
					? "bg-white shadow-lg -mt-16"
					: "bg-indigo-50"
			}
			${selected ? "bg-indigo-500 text-white" : ""}
			`}
		>
			{selectable ? (
				<div
					className="cursor-pointer rounded-full w-8 h-8 bg-indigo-100 flex items-center group-hover:bg-white justify-center text-indigo-800 group-hover:shadow-lg"
					style={{
						minWidth: "calc(.25rem * 8)"
					}}
					onClick={toggleSelected.bind(this, action.id)}
				>
					{selected ? <FiCheck /> : <FiCircle />}
				</div>
			) : (
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
						<div className={"group-hover:hidden"}>
							{action.type === "loop" ? (
								<TiArrowRepeat />
							) : (
								index + 1
							)}
						</div>
					</div>
				</div>
			)}

			<div
				className={
					"opacity-90 text-xs flex flex-col text-left space-y-1"
				}
				style={{
					minWidth: 100
				}}
			>
				{action.position ||
				action.message ||
				action.keys ||
				action.duration ||
				action.loop ? (
					<div className="group-hover:text-white">
						{action.position ? (
							<div>
								{action.position.x}, {action.position.y}
							</div>
						) : null}

						{action.loop ? (
							<div className={"capitalize"}>
								{action.loop.times +
									" " +
									(action.loop.times === 1
										? "time"
										: "times")}
							</div>
						) : null}

						{action.keys ? (
							<div className={"uppercase"}>
								{action.keys.modifiers.length
									? `${action.keys.modifiers.join(" + ")} + `
									: ""}
								{action.keys.main}
							</div>
						) : null}

						{action.message?.length ? (
							<div className={"uppercase"}>
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
				<Menu
					closeTarget={containerRef?.current}
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
				>
					{menu.map((item, itemIndex) => (
						<MenuItem
							key={`add-above-item-${index}-${itemIndex}-${action.id}`}
							{...item}
						/>
					))}
				</Menu>

				<Menu
					closeTarget={containerRef?.current}
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
				>
					{menu.map((item, itemIndex) => (
						<MenuItem
							key={`add-below-item-${index}-${itemIndex}-${action.id}`}
							{...item}
						/>
					))}
				</Menu>

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
