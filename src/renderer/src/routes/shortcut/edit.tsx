import React, { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ShortcutsContext } from "../../contexts/shortcut";

const ShortcutEdit: React.FC = () => {
	const params = useParams<{ id: string }>();
	const context = useContext(ShortcutsContext);
	const shortcut = useMemo(() => {
		return context.shortcuts.find((shortcut) => shortcut.id === params.id);
	}, [params.id]);
	return (
		<div>
			<h1>Edit Shortcut</h1>
			<p>{shortcut.id}</p>
		</div>
	);
}

export default ShortcutEdit;