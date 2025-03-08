import { electronApp, is } from "@electron-toolkit/utils";
import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { join } from "path";
import Store from "electron-store";

Store.initRenderer();

app.commandLine.appendSwitch("disable-renderer-backgrounding");

const createWindow = async (): Promise<BrowserWindow> => {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		title: "Dromos",
		resizable: true,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false
		}
	});

	window.setMenuBarVisibility(false);
	// window.setAlwaysOnTop(true, "screen-saver");

	window.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	window.once("ready-to-show", () => {
		window.show();
	});

	if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
		window.webContents.openDevTools();
		await window.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		await window.loadFile(path.join(__dirname, "../renderer/index.html"));
	}

	return window;
};

const createCaptureWindow = async (): Promise<BrowserWindow> => {
	const window = new BrowserWindow({
		transparent: true,
		fullscreen: true,
		hasShadow: false,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		}
	});

	await window.loadFile(path.join(__dirname, "capture.html"));

	return window;
};

app.whenReady().then(async () => {
	electronApp.setAppUserModelId("com.dromos.app");
	await createWindow();

	app.on("activate", async () => {
		if (BrowserWindow.getAllWindows().length === 0) await createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
