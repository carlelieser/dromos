import Header from "./components/header";
import Shortcuts from "./components/shortcuts";
import { useState } from "react";
import { IAction, IShortcut } from "./components/shortcut";
import WaitForUserPrompt from "./components/modals/wait-for-user-prompt";
import { ipcRenderer } from "electron";

interface IPromptPromiseRef {
	promise: Promise<unknown>;
	resolve: any;
}

const App = () => {
	const [shortcuts, setShortcuts] = useState<Array<IShortcut>>([]);
	const [showAddShortcutModal, setShowAddShortcutModal] = useState<boolean>(false);
	const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
	const [promptPromise, setPromptPromise] = useState<IPromptPromiseRef>();

	const addShortcut = (shortcut: IShortcut) => {
		let shortcutCopy = [...shortcuts];
		let prevIndex = shortcutCopy.findIndex(shortcutRef => shortcutRef.id === shortcut.id);
		
		if (prevIndex > -1) {
			shortcutCopy[prevIndex] = shortcut;
		} else{
			shortcutCopy.push(shortcut);
		}
		
		setShortcuts(shortcutCopy);
	};

	const openAddShortcutModal = () => {
		console.log("Opening the thing");
		setShowAddShortcutModal(true);
	};

	const closeAddShortcutModal = () => {
		setShowAddShortcutModal(false);
	};

	const openPromptModal = () => {
		setShowPromptModal(true);
	}

	const closePromptModal = () => {
		if (promptPromise) promptPromise.resolve();
		setShowPromptModal(false);
	}

	const waitForPromptModalClose = () => {
		let resolveRef;
		
		const promise = new Promise((resolve) => {
			resolveRef = resolve;
		});

		const ref: IPromptPromiseRef = {
			promise,
			resolve: resolveRef
		}

		return ref;
	}

	const delay = (duration: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, duration)
		});
	}

	const executeActions = async (actions: Array<IAction>) => {
		console.log("applying these actions", actions);
		for await (const action of actions) {
			await delay(100);
			if (action.type === "delay"){
				await delay(action.duration as number);
			} else if(action.type === "prompt"){
				openPromptModal();
				const promptPromise = waitForPromptModalClose();
				setPromptPromise(promptPromise);
				await promptPromise.promise;
				console.log("continuing after prompt");
			} else {
				ipcRenderer.send("execute-action", action);
			}
		}
	};

	return (
		<div className={"bg-indigo-500 w-full h-full absolute"}>
			<WaitForUserPrompt show={showPromptModal} close={closePromptModal}/>
			<Header />
			<Shortcuts shortcuts={shortcuts} executeActions={executeActions} showAddShortcutModal={showAddShortcutModal} addShortcut={addShortcut} openAddShortcutModal={openAddShortcutModal} closeAddShortcutModal={closeAddShortcutModal}/>
		</div>
	);
};
export default App;
