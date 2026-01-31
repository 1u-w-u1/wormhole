/**
 * Packaging script for Wormhole extension
 * Bundles the extension files into a ZIP file for publication
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DIST_DIR = 'dist';
const ZIP_NAME = 'wormhole-extension.zip';

const FILES_TO_COPY = [
    'manifest.json',
    'service-worker.js',
    'content-script.js',
    'firebase-config.js',
    'icons',
    'lib',
    'offscreen',
    'sidepanel',
    'options'
];

async function run() {
    try {
        console.log('🚀 Starting packaging process...');

        // 1. Run the build script first
        console.log('📦 Running build...');
        execSync('npm run build', { stdio: 'inherit' });

        // 2. Clean/Create dist directory
        if (fs.existsSync(DIST_DIR)) {
            console.log(`🧹 Cleaning ${DIST_DIR} directory...`);
            fs.rmSync(DIST_DIR, { recursive: true, force: true });
        }
        fs.mkdirSync(DIST_DIR);

        // 3. Copy files to dist
        console.log('📂 Copying files to dist...');
        for (const file of FILES_TO_COPY) {
            const src = path.join(process.cwd(), file);
            const dest = path.join(DIST_DIR, file);

            if (fs.existsSync(src)) {
                if (fs.lstatSync(src).isDirectory()) {
                    fs.cpSync(src, dest, {
                        recursive: true,
                        filter: (srcPath) => !srcPath.endsWith('.js.map')
                    });
                } else {
                    fs.copyFileSync(src, dest);
                }
            } else {
                console.warn(`⚠️ Warning: ${file} not found, skipping.`);
            }
        }

        // 4. Create ZIP file
        console.log(`🤐 Creating ${ZIP_NAME}...`);

        // Use native zip command on Mac/Linux
        try {
            // Change directory to DIST_DIR to avoid including the 'dist/' folder in the ZIP
            execSync(`cd ${DIST_DIR} && zip -r ../${ZIP_NAME} ./*`, { stdio: 'inherit' });
            console.log(`✅ Successfully created ${ZIP_NAME}`);
        } catch (zipError) {
            console.error('❌ Failed to create ZIP file. Ensure "zip" utility is installed.');
            throw zipError;
        }

        console.log('\n✨ Packaging complete! You can find the bundle at:', path.resolve(ZIP_NAME));

    } catch (error) {
        console.error('\n❌ Packaging failed:', error.message);
        process.exit(1);
    }
}

run();
