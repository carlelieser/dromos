import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { ReactElement, useContext } from "react";
import Add from "@mui/icons-material/Add";
import logo from "@assets/images/logo.svg";
import { ShortcutsContext } from "@contexts/shortcut";

const Navbar = (): ReactElement => {
	const context = useContext(ShortcutsContext);
	const handleCreateNewShortcut = (): void => {
		context.create();
	};

	return (
		<AppBar
			position="static"
			elevation={0}
			sx={{
				borderRadius: 4
			}}
		>
			<Toolbar
				sx={{
					gap: 2
				}}
			>
				<img alt={"logo"} src={logo} width={36} height={36} />
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Shortcuts
				</Typography>
				<Button color="primary" startIcon={<Add />} onClick={handleCreateNewShortcut}>
					<Typography variant="button">New</Typography>
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
