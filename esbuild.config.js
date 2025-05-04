const esbuild = require('esbuild');
const path = require('path');

esbuild
	.build({
		entryPoints: [path.resolve(__dirname, 'src/bin/cli.ts')],
		outfile: path.resolve(__dirname, 'dist/index.js'),
		bundle: true,
		platform: 'node',
		target: 'node16',
		format: 'cjs',
		sourcemap: false,
		external: ['node_modules/*'],
		minify: true,
	})
	.catch(() => process.exit(1));
