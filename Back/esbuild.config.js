import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';

// Créer __dirname pour les modules ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fonction pour copier récursivement les fichiers
async function copyDir(src, dest) {
  // Créer le répertoire de destination s'il n'existe pas
  await fs.mkdir(dest, { recursive: true }).catch(() => {});
  
  // Lire le contenu du répertoire source
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Récursivement copier les sous-répertoires
      await copyDir(srcPath, destPath);
    } else {
      // Copier les fichiers
      await fs.copyFile(srcPath, destPath).catch(() => {});
    }
  }
}

async function build() {
  // Copier le dossier public vers dist/public
  const publicSrcDir = path.join(__dirname, 'public');
  const publicDestDir = path.join(__dirname, 'dist/public');
  
  try {
    await copyDir(publicSrcDir, publicDestDir);
    console.log('✅ Dossier public copié vers dist/public');
  } catch (err) {
    console.error('❌ Erreur lors de la copie du dossier public:', err);
  }

  // Configuration esbuild
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
    external: ['express', 'body-parser', 'path', 'fs', 'url', 'depd','typescript'],
    banner: {
      js: `
        import { createRequire } from 'module';
        const require = createRequire(import.meta.url);
        global.require = require;
      `,
    },
    logLevel: 'info'
  });
  
  await ctx.watch();
  console.log('🔁 Watching for changes...');
  
  // Observer les changements dans le dossier public
  fs.watch(publicSrcDir, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`Changement détecté dans public/${filename}, copie en cours...`);
      try {
        await copyDir(publicSrcDir, publicDestDir);
        console.log('✅ Dossier public mis à jour');
      } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du dossier public:', err);
      }
    }
  }).catch(err => {
    console.warn('⚠️ Impossible de surveiller le dossier public:', err);
  });
}

build().catch((err) => {
  console.error('❌ Erreur de build:', err);
  process.exit(1);
});