all:
	npm install
	node node_modules/browserify/bin/cmd.js color-scales.js > dist/color_scales.js
