import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	IconButton,
	Typography
} from "@mui/material";
import { FC } from "react";
import { IShortcut } from "../types";
import { ContentCopy, Delete, Edit, PlayArrow } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Shortcut: FC<IShortcut> = ({ id, name, color }) => {
	const navigate = useNavigate();

	const edit = () => {
		navigate(`/shortcut/${id}`);
	};

	return (
		<Card elevation={2} sx={{ borderRadius: 4 }}>
			<CardMedia component={"div"} sx={{ bgcolor: color, height: 36 }} />
			<CardHeader title={name} />
			<CardContent>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					This impressive paella is a perfect party dish and a fun meal to cook together with your
					guests. Add 1 cup of frozen peas along with the mussels, if you like.
				</Typography>
			</CardContent>
			<CardActions
				sx={{
					display: "flex",
					justifyContent: "center"
				}}
			>
				<IconButton color={"primary"}>
					<PlayArrow />
				</IconButton>
				<IconButton aria-label="edit" onClick={edit}>
					<Edit />
				</IconButton>
				<IconButton aria-label="duplicate">
					<ContentCopy />
				</IconButton>
				<IconButton color={"error"} aria-label="remove">
					<Delete />
				</IconButton>
			</CardActions>
		</Card>
	);
};

export default Shortcut;
