import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function injectPrecache() {
  return {
    name: 'inject-precache',
    closeBundle() {
      const dist = path.resolve('dist');
      const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(f =>
        f.isDirectory() ? walk(path.join(d, f.name)) : [path.relative(dist, path.join(d, f.name))]);
      const files = walk(dist).filter(f => f !== 'sw.js').map(f => './' + f.split(path.sep).join('/'));
      const sw = path.join(dist, 'sw.js');
      fs.writeFileSync(sw, fs.readFileSync(sw, 'utf8').replace('__PRECACHE__', JSON.stringify(['./', ...files])));
    }
  };
}
export default defineConfig({ base: './', plugins: [react(), injectPrecache()] });
