import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@assets/css/main.css";
import App from "./app";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Shortcuts from "@components/shortcuts";
import ShortcutEdit from "@routes/shortcut/edit";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Shortcuts />
			},
			{
				path: "/shortcut/:id",
				element: <ShortcutEdit/>
			}
		]
	}
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
