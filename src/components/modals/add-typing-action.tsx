import React, { useEffect, useState, ChangeEvent } from "react";
import Modal from "../modal";
import { IAction } from "../shortcut";
import uuid from "uuid-random";
import Button from "../button";
import { MdAdd } from "react-icons/all";

const AddTypingAction = ({ show, close, addKeyboardCommandAction }) => {
	const [keyboardAction, setKeyboardAction] = useState<IAction>();

	const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const message = e.target.value;
		const prevAction = { ...keyboardAction } as IAction;
		prevAction.message = message;
		setKeyboardAction(prevAction);
	};

	const handleAddKeyboardCommand = () => {
		addKeyboardCommandAction(keyboardAction);
		close();
	};

	useEffect(() => {
		const defaultKeyboardAction: IAction = {
			id: uuid(),
			type: "keyboard",
			message: ""
		};

		setKeyboardAction(defaultKeyboardAction);
	}, [show]);

	return (
		<Modal
			show={show}
			title={"Add typing action"}
			hideBg={true}
			close={close}
		>
			<div>
				<div className={"uppercase text-xs opacity-70"}>Message</div>
				<input
					type={"text"}
					value={keyboardAction?.message}
					onChange={handleMessageChange}
					className={
						"outline-none font-semibold w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 transition ease-in-out"
					}
					placeholder={"Something something something"}
				/>
			</div>
			<div className={"flex items-center justify-end mt-4"}>
				<Button
					label={"Add action"}
					icon={MdAdd}
					className={"bg-indigo-500 text-white"}
					onClick={handleAddKeyboardCommand}
				/>
			</div>
		</Modal>
	);
};

export default AddTypingAction;
