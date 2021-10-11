import React from "react";
import Modal from "../modal";
import Button from "../button";

import { IoMdHappy } from "react-icons/io";
import { HiCursorClick } from "react-icons/hi";
import { FaRegAngry } from "react-icons/all";

const WaitForUserPrompt = ({ show, close }) => {
	const handleConfirm = () => {
		close(true);
	};

	const handleCancel = () => {
		close();
	};

	return (
		<Modal title="Prompt" show={show} close={close}>
			<div className="flex flex-col space-y-4 text-center items-center justify-center">
				<div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800">
					<IoMdHappy size={24} />
				</div>

				<div className={"space-y-1"}>
					<div className="font-semibold">
						Hi, we just need you to hit confirm when you're ready.
					</div>
					<div className={"opacity-70 text-xs"}>
						Cancelling will prevent the current sequence from
						executing further.
					</div>
				</div>

				<div className={"flex flex-col space-y-2"}>
					<Button
						label="Confirm"
						className={"bg-indigo-500 text-white"}
						icon={HiCursorClick}
						onClick={handleConfirm}
					/>
					<div className={"transform scale-75"}>
						<Button
							label="Cancel"
							className="bg-gray-100"
							icon={FaRegAngry}
							onClick={handleCancel}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default WaitForUserPrompt;
