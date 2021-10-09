import Header from "./components/header";
import Shortcuts from "./components/shortcuts";
import { useState } from "react";
import { IShortcut } from "./components/shortcut";

const App = () => {
	const [shortcuts, setShortcuts] = useState<Array<IShortcut>>([]);
	const [showAddShortcutModal, setShowAddShortcutModal] = useState<boolean>(false);

	const addShortcut = (shortcut: IShortcut) => {
		let shortcutCopy = [...shortcuts];
		shortcutCopy.push(shortcut);
		setShortcuts(shortcutCopy);
	};

	const openAddShortcutModal = () => {
		console.log("Opening the thing");
		setShowAddShortcutModal(true);
	};

	const closeAddShortcutModal = () => {
		setShowAddShortcutModal(false);
	};

	return (
		<div className={"bg-indigo-500 w-full h-full absolute"}>
			<Header />
			<Shortcuts shortcuts={shortcuts} showAddShortcutModal={showAddShortcutModal} addShortcut={addShortcut} openAddShortcutModal={openAddShortcutModal} closeAddShortcutModal={closeAddShortcutModal}/>
		</div>
	);
};
export default App;
