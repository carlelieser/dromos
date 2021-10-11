const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

const dev = !!process.argv.find((argument) => argument.includes("=dev"));

const Store = require("electron-store");
const store = new Store();
const robot = require("robotjs");

let mainWindow = null;
let captureWindow = null;

app.commandLine.appendSwitch("disable-renderer-backgrounding");

function createWindow() {
	const size = {
		width: 350,
		height: 540
	};
	mainWindow = new BrowserWindow({
		width: size.width,
		height: size.height,
		resizable: false,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		}
	});

	const page = dev
		? "http://localhost:3000"
		: url.format({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file",
				slashes: true
		  });

	mainWindow.setMenuBarVisibility(false);
	mainWindow.setAlwaysOnTop(true, "screen-saver");

	if (dev) mainWindow.loadURL(page);
	else mainWindow.loadFile("./build/index.html");

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});

	if (dev) mainWindow.webContents.openDevTools();
}

const createCaptureWindow = () => {
	const captureWindow = new BrowserWindow({
		transparent: true,
		fullscreen: true,
		hasShadow: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		}
	});

	captureWindow.loadFile(path.join(__dirname, "empty.html"));

	return captureWindow;
};

const stopRecording = () => {
	if (captureWindow) {
		captureWindow.destroy();
		captureWindow = null;
	} else {
		console.log("Capture window does not exist.");
	}
};

ipcMain.on("begin-recording", (event, arg) => {
	captureWindow = createCaptureWindow();
});

ipcMain.on("event-recorded", (e, event) => {
	stopRecording();
	mainWindow.webContents.send("add-shortcut-action", event);
});

ipcMain.on("store-item", (e, item) => {
	store.set(item.key, item.value);
});

ipcMain.on("get-item", (e, key) => {
	const item = store.get(key);
	e.returnValue = item;
});

ipcMain.on("remove-item", (e, key) => {
	store.delete(key);
});

ipcMain.on("execute-action", (e, action) => {
	if (action.type === "mouse") {
		if (!action.position) return;
		robot.moveMouse(action.position.x, action.position.y);
		robot.mouseClick("left");
	} else if (action.type === "keyboard") {
		if (!action.message) return;
		if (action.message.length === 1) robot.keyTap(action.message);
		else robot.typeString(action.message);
	}
});

ipcMain.on("get-mouse-position", (e) => {
	e.reply("mouse-position-received", robot.getMousePos());
});

ipcMain.on("stop-recording", stopRecording);

ipcMain.on("show-main-window", () => {
	mainWindow.show();
});

ipcMain.on("hide-main-window", (e) => {
	mainWindow.hide();
});

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});
