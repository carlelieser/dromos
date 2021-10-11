module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {}
	},
	variants: {
		extend: {
			display: ["group-hover"],
			translate: ["group-hover"],
			scale: ["group-hover"],
			pointerEvents: ["group-hover", "hover", "focus"]
		}
	},
	plugins: []
};
