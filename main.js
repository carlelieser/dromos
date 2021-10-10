const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");

const env = process.argv.find((argument) => argument.includes("env="));
const dev = env ? env.split("=")[1] === "dev" : true;

const Store = require("electron-store");
const store = new Store();
const robot = require("robotjs");

let mainWindow = null;
let captureWindow = null;

function createWindow() {
	const size = {
		width: 350,
		height: 540
	};
	mainWindow = new BrowserWindow({
		width: size.width,
		height: size.height,
		minWidth: size.width,
		minHeight: size.height,
		maxWidth: size.width,
		maxHeight: size.height,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		}
	});

	const url = dev ? "http://localhost:3000" : url.format({
		pathname: path.join(__dirname, "build", "index.html"),
		protocol: "file",
		slashes: true
	});

	mainWindow.setMenuBarVisibility(false);
	mainWindow.loadURL(url);

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
		captureWindow.close();
		captureWindow = null;
	} else {
		console.log("Capture window does not exist.");
	}
};

ipcMain.on("begin-recording", (event, arg) => {
	mainWindow.setAlwaysOnTop(true, "screen-saver");
	captureWindow = createCaptureWindow();
});

ipcMain.on("event-recorded", (e, event) => {
	console.log(event);
	stopRecording();
	mainWindow.webContents.send("add-shortcut-action", event);
});

ipcMain.on("execute-action", (e, action) => {
	if (action.type === "mouse") {
		if (!action.position) return;
		robot.moveMouse(action.position.x, action.position.y);
		robot.mouseClick("left");
	} else if (action.type === "keyboard") {
		if (!action.message) return;
		robot.keyTap(action.message);
	}
});

ipcMain.on("get-mouse-position", (e) => {
	e.reply("mouse-position-received", robot.getMousePos());
});

ipcMain.on("stop-recording", stopRecording);

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function() {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", function() {
	if (process.platform !== "darwin") app.quit();
});

