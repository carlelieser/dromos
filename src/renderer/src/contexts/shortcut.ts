import { createContext } from "react";
import { IShortcut } from "../types";
import { Spec } from "immutability-helper";

interface IShortcutContext {
	shortcuts: Array<IShortcut>;
	create: () => void;
	remove: (id: string) => void;
	update: (id: string, spec: Spec<IShortcut>) => void;
}

export const ShortcutsContext = createContext<IShortcutContext>({
	shortcuts: [],
	create: () => {},
	remove: () => {},
	update: () => {}
});
