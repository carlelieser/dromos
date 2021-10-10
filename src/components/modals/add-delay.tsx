import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "../modal";
import Button from "../button";

const AddDelayModal = ({ show, close, addDelayAction }) => {
	const [duration, setDuration] = useState<number>(200);

	const handleDurationChange = (e) => {
		const duration = e.target.value;
		setDuration(duration);
	};

	const handleDelayAdd = () => {
		addDelayAction(duration);
		close();
	};

	return (
		<>
			<Modal show={show} title="Add delay" close={close} hideBg={true}>
				<div className="space-y-4">
					<div>
						<div className={"uppercase text-xs opacity-70"}>Duration (ms)</div>
						<input type={"number"}
							   value={duration}
							   onChange={handleDurationChange}
							   className={"text-xl outline-none font-semibold w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 transition ease-in-out"}
							   placeholder={"Untitled"} />
					</div>
					<div className="flex items-center justify-end">
						<Button label="Add" icon={<MdAdd color="white" />} bg="indigo-500" color="white" size={12}
								onClick={handleDelayAdd} />
					</div>
				</div>
			</Modal>
		</>
	);
};

export default AddDelayModal;
