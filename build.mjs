/**
 * Build script for Wormhole extension
 * Bundles Firebase SDK for use in offscreen document
 */

import * as esbuild from 'esbuild';

// Bundle the offscreen document with Firebase
await esbuild.build({
    entryPoints: ['src/offscreen.js'],
    bundle: true,
    outfile: 'offscreen/offscreen.js',
    format: 'esm',
    target: 'chrome114',
    minify: false,
    sourcemap: true,
});

console.log('Build complete!');
