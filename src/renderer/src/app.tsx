import { Container, createTheme, Paper, ThemeProvider } from "@mui/material";
import { ReactElement } from "react";
import Navbar from "@components/navbar";
import ShortcutProvider from "@providers/shortcut";
import { Outlet } from "react-router-dom";

const App = (): ReactElement => {
	const theme = createTheme({
		palette: {
			mode: "dark",
			primary: {
				main: "#7c4df6",
				contrastText: "#fff"
			}
		},
		typography: {
			fontFamily: "Roboto, sans-serif"
		}
	});

	return (
		<ShortcutProvider>
			<ThemeProvider theme={theme}>
				<Paper
					sx={{
						width: "100%",
						height: "100%",
						overflowX: "hidden",
						padding: 2
					}}
					square={true}
				>
					<Container
						sx={{
							display: "flex",
							flex: 1,
							flexDirection: "column",
							gap: 2
						}}
					>
						<Navbar />
						<Outlet />
					</Container>
				</Paper>
			</ThemeProvider>
		</ShortcutProvider>
	);
};
export default App;
