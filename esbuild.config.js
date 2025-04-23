const esbuild = require('esbuild');
const path = require('path');

esbuild
	.build({
		entryPoints: [path.resolve(__dirname, 'src/index.ts')], // Your main entry point
		outfile: path.resolve(__dirname, 'dist/index.js'), // Output file
		bundle: true, // Bundle dependencies
		platform: 'node', // Target Node.js
		target: 'node16', // Target a specific Node.js version (adjust as needed)
		format: 'cjs', // Output format (CommonJS)
		sourcemap: true, // Generate sourcemaps for debugging
		external: ['node_modules/*'], // Optionally exclude node_modules
	})
	.catch(() => process.exit(1));
