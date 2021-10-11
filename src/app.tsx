import React from "react";
import Header from "./components/header";
import Shortcuts from "./components/shortcuts";
import { useEffect, useState } from "react";
import { IAction, IShortcut } from "./components/shortcut";
import WaitForUserPrompt from "./components/modals/wait-for-user-prompt";
import { ipcRenderer } from "electron";

interface IPromptPromiseRef {
	promise: Promise<unknown>;
	resolve: any;
	reject: any;
}

const App = () => {
	const [shortcuts, setShortcuts] = useState<Array<IShortcut>>([]);
	const [showAddShortcutModal, setShowAddShortcutModal] =
		useState<boolean>(false);
	const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
	const [promptPromise, setPromptPromise] = useState<IPromptPromiseRef>();

	const addShortcut = (shortcut: IShortcut) => {
		let shortcutCopy = [...shortcuts];
		let prevIndex = shortcutCopy.findIndex(
			(shortcutRef) => shortcutRef.id === shortcut.id
		);

		if (prevIndex > -1) {
			shortcutCopy[prevIndex] = shortcut;
		} else {
			shortcutCopy.push(shortcut);
		}

		setShortcuts(shortcutCopy);
	};

	const removeShortcut = (id: string) => {
		let shortcutCopy = [...shortcuts];
		let prevIndex = shortcutCopy.findIndex(
			(shortcutRef) => shortcutRef.id === id
		);
		shortcutCopy.splice(prevIndex, 1);
		setShortcuts(shortcutCopy);
	};

	const openAddShortcutModal = () => {
		setShowAddShortcutModal(true);
	};

	const closeAddShortcutModal = () => {
		setShowAddShortcutModal(false);
	};

	const openPromptModal = () => {
		setShowPromptModal(true);
	};

	const closePromptModal = (continueExecution: boolean = false) => {
		if (promptPromise) promptPromise.resolve(continueExecution);
		setShowPromptModal(false);
	};

	const waitForPromptModalClose = () => {
		let refs: any = {};

		const promise = new Promise((resolve, reject) => {
			refs.resolve = resolve;
			refs.reject = reject;
		});

		const ref: IPromptPromiseRef = {
			promise,
			resolve: refs.resolve,
			reject: refs.reject
		};

		return ref;
	};

	const delay = (duration: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, duration);
		});
	};

	const executeActions = async (actions: Array<IAction>) => {
		for await (const action of actions) {
			await delay(50);
			if (action.type === "delay") {
				await delay(action.duration as number);
			} else if (action.type === "prompt") {
				// ipcRenderer.send("show-main-window");
				openPromptModal();
				const promptRef = waitForPromptModalClose();
				setPromptPromise(promptRef);
				const shouldContinue = await promptRef.promise;
				if (!shouldContinue) break;
			} else {
				ipcRenderer.send("execute-action", action);
			}
		}
		// ipcRenderer.send("show-main-window");
	};

	useEffect(() => {
		const storedShortcuts =
			ipcRenderer.sendSync("get-item", "shortcuts") ?? [];
		setShortcuts(storedShortcuts);
	}, []);

	useEffect(() => {
		ipcRenderer.send("store-item", {
			key: "shortcuts",
			value: shortcuts
		});
	}, [shortcuts]);

	return (
		<div className={"bg-indigo-500 w-full h-full absolute overflow-hidden"}>
			<WaitForUserPrompt
				show={showPromptModal}
				close={closePromptModal}
			/>
			<Header />
			<Shortcuts
				shortcuts={shortcuts}
				executeActions={executeActions}
				showAddShortcutModal={showAddShortcutModal}
				addShortcut={addShortcut}
				removeShortcut={removeShortcut}
				openAddShortcutModal={openAddShortcutModal}
				closeAddShortcutModal={closeAddShortcutModal}
			/>
		</div>
	);
};
export default App;
