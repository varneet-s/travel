import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '../../..');
export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const SRC_DIR = path.join(ROOT_DIR, 'src');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

export function loadDistFile(relativePath) {
  const fullPath = path.join(DIST_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

export function loadSrcFile(relativePath) {
  const fullPath = path.join(SRC_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

export function loadPublicFile(relativePath) {
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

export function fileExists(fullOrRelativePath, baseDir = ROOT_DIR) {
  const p = path.isAbsolute(fullOrRelativePath) ? fullOrRelativePath : path.join(baseDir, fullOrRelativePath);
  return fs.existsSync(p);
}

export function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(listFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

export function getBundledCss() {
  const astroAssetsDir = path.join(DIST_DIR, '_astro');
  if (!fs.existsSync(astroAssetsDir)) return '';
  const cssFiles = fs.readdirSync(astroAssetsDir).filter(f => f.endsWith('.css'));
  return cssFiles.map(f => fs.readFileSync(path.join(astroAssetsDir, f), 'utf8')).join('\n');
}
