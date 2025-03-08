import { FC, PropsWithChildren, useState } from "react";
import { ShortcutsContext } from "@contexts/shortcut";
import update, { Spec } from "immutability-helper";
import uuid from "uuid-random";
import { IShortcut } from "../types";
import { randomColor } from "randomcolor";

const ShortcutProvider: FC<PropsWithChildren> = ({ children }) => {
	const [shortcuts, setShortcuts] = useState<Array<IShortcut>>([]);

	const create = (): void => {
		const shortcut: IShortcut = {
			id: uuid(),
			name: "New Shortcut",
			commands: [],
			icon: "",
			color: randomColor()
		};

		setShortcuts((prevShortcuts) =>
			update(prevShortcuts, {
				$push: [shortcut]
			})
		);
	};

	const edit = (id: string, spec: Spec<IShortcut>): void => {
		const index = shortcuts.findIndex((shortcut) => shortcut.id === id);

		setShortcuts(
			(prevShortcuts) =>
				update(prevShortcuts, {
					[index]: spec
				}) as Array<IShortcut>
		);
	};

	const remove = (id: string): void => {
		const index = shortcuts.findIndex((shortcut) => shortcut.id === id);

		setShortcuts((prevShortcuts) =>
			update(prevShortcuts, {
				$splice: [[index, 1]]
			})
		);
	};

	return (
		<ShortcutsContext.Provider
			value={{
				shortcuts,
				create,
				update: edit,
				remove
			}}
		>
			{children}
		</ShortcutsContext.Provider>
	);
};

export default ShortcutProvider;
