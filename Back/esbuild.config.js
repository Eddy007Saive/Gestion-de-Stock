import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Créer __dirname pour les modules ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function  build(){
  const ctx = await esbuild.context({
    entryPoints: ['./src/app.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',  // Gardez ESM
    outfile: './dist/app.js',
    sourcemap: true,
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    external: ['express', 'body-parser', 'path', 'fs', 'url', 'depd','typescript' ],
    banner: {
      js: `
        import { createRequire } from 'module';
        const require = createRequire(import.meta.url);
        global.require = require;
      `,
    },
    logLevel: 'info'
})
    await ctx.watch();
    console.log('🔁 Watching for changes...');
}

build().catch(() => process.exit(1));