import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
 plugins: [react()],
 // GitHub Pages hosts this project below /scent-and-wander/.
 // Leave the local development URL at the root.
 base: process.env.VITE_BASE_PATH || '/',
});
