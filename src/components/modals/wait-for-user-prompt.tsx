import React from "react";
import Modal from "../../modal";
import Button from "../button";

import {IoMdHappy} from "react-icons/io";
import { HiCursorClick } from "react-icons/hi";

const WaitForUserPrompt = ({show, close}) => {
	return (
		<Modal title="Prompt" show={show} close={close}>
			<div className="flex flex-col space-y-4 text-center items-center justify-center">
				<div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800">
					<IoMdHappy size={24}/>
				</div>
				<div className="font-semibold">We're just waiting for you to click the button below.</div>
				<Button label="Confirm" bg="indigo-500" color="white" icon={<HiCursorClick size={18} color="white"/>} onClick={close}/>
			</div>
		</Modal>
	)
}

export default WaitForUserPrompt;