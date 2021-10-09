import React, { ReactChildren, ReactElement } from "react";
import Button from "./components/button";
import { MdClose } from "react-icons/all";

interface IModalProps {
	show: boolean;
	title: string;
	icon?: ReactElement;
	close?: () => void;
}

const Modal: React.FC<IModalProps> = ({ show, close, title, icon, children }) => {
	return (
		<div
			className={`modal-container transition ease-in-out z-100 top-0 left-0 absolute w-full h-full ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
			<div
				className={`${show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} w-full left-0 absolute bottom-0 z-100 p-5 space-y-4 transition transform ease-in-out bg-white rounded-t-xl`}
				style={{ minHeight: 200 }}>
				<div className={"flex items-center justify-between"}>
					<div className={"font-semibold text-xl"}>{title}</div>
					<Button icon={<MdClose />} size={8} onClick={close} />
				</div>
				<div>
					{show ? children : null}
				</div>
			</div>
			<div className={"z-0 absolute top-0 left-0 w-full h-full bg-black opacity-50"} onClick={close}></div>
		</div>
	);
};

export default Modal;
