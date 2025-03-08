export interface IShortcut {
	name: string;
	commands: Array<ICommand>;
	icon: string;
	color: string;
	id: string;
}

export type ICommand = IClickCommandConfig | IDoubleClickCommandConfig | IKeyboardCommandConfig;

export interface IClickCommandConfig {
	type: "click";
	config: IPointerCoordinates;
}

export interface IDoubleClickCommandConfig {
	type: "double-click";
	config: IPointerCoordinates;
}

export interface IKeyboardCommandConfig {
	type: "keyboard";
	config: number;
}

export interface IPointerCoordinates {
	x: number;
	y: number;
}
