import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const THEMES_DIR = path.join(process.cwd(), 'public', 'themes');

async function fixFontUrls() {
    try {
        // Find all CSS files in the themes directory
        const cssFiles = await glob('**/*.css', { cwd: THEMES_DIR });

        for (const file of cssFiles) {
            const filePath = path.join(THEMES_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Replace @bryntum/core-thin/fonts/ with ~@bryntum/core-thin/fonts/
            const updatedContent = content.replace(
                /@bryntum\/core-thin\/fonts\//g,
                'fonts/'
            );

            // Only write if changes were made
            if (content !== updatedContent) {
                fs.writeFileSync(filePath, updatedContent);
                console.log(`Updated font URLs in ${file}`);
            }
        }

        console.log('Font URL transformation completed successfully');
    } catch (error) {
        console.error('Error fixing font URLs:', error);
        process.exit(1);
    }
}

fixFontUrls();
