import { FC, useContext } from "react";
import { ShortcutsContext } from "@contexts/shortcut";
import Shortcut from "./shortcut";
import Masonry from "@mui/lab/Masonry";

interface ShortcutsProps {}

const Shortcuts: FC<ShortcutsProps> = () => {
	const context = useContext(ShortcutsContext);

	return (
		<Masonry
			columns={{
				xs: 1,
				sm: 2,
				md: 3,
				xl: 4
			}}
			spacing={2}
		>
			{context.shortcuts.map((shortcut) => (
				<Shortcut {...shortcut} key={shortcut.id} />
			))}
		</Masonry>
	);
};

export default Shortcuts;
