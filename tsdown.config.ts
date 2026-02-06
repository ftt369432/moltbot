import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/entry.ts',
    ],
    format: 'esm',
    clean: true,
    outDir: 'dist',
    target: 'node20',
});
