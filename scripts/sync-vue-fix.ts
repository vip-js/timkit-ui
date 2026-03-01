
import fs from 'fs';
import path from 'path';

const REGISTRY_DIR = '/Users/jiawei01.mao/sine/timkit-ui/apps/docs/registry/default/vue';
const PACKAGE_DIR = '/Users/jiawei01.mao/sine/timkit-ui/packages/vue/src/components';

const filesToSync = [
    'checkbox.vue',
    'dialog.vue',
    'dialog-content.vue',
    'dialog-trigger.vue',
    'dialog-title.vue',
    'dialog-description.vue',
    'accordion.vue',
    'accordion-item.vue',
    'accordion-trigger.vue',
    'accordion-content.vue'
];

filesToSync.forEach(file => {
    const srcPath = path.join(REGISTRY_DIR, file);
    const destPath = path.join(PACKAGE_DIR, file);

    if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf-8');
        // Adjust imports for package context
        content = content.replace(/@\/lib\/utils/g, '@timui/core');

        fs.writeFileSync(destPath, content);
        console.log(`Synced ${file} to packages/vue`);
    } else {
        console.warn(`Source file not found: ${srcPath}`);
    }
});
