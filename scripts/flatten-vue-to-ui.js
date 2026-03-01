#!/usr/bin/env node

/**
 * Vue 组件扁平化脚本
 * 将 Vue 组件从分类目录（form/, layout/, etc.）迁移到统一的 ui/ 目录
 * 以与 React 的 components/ui/ 结构保持一致
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../packages/vue/src/components');
const UI_DIR = path.join(COMPONENTS_DIR, 'ui');

const CATEGORIES = [
    'form',
    'layout',
    'navigation',
    'feedback',
    'data-display',
    'overlay',
    'advanced',
];

// Files that stay at the root of components/ (not moved)
const ROOT_FILES = ['primitive.ts', 'slot.vue', 'sonner.vue', 'toaster.vue', 'index.ts'];
const ROOT_LOOSE_VUE_FILES = [
    'navigation-menu-content.vue',
    'navigation-menu-indicator.vue',
    'navigation-menu-item.vue',
    'navigation-menu-link.vue',
    'navigation-menu-list.vue',
    'navigation-menu-trigger.vue',
    'navigation-menu-viewport.vue',
    'navigation-menu.vue',
    'scroll-bar.vue',
];

function run() {
    console.log('🚀 Flattening Vue components to components/ui/ ...\n');

    // 1. Create ui/ directory if it doesn't exist
    if (!fs.existsSync(UI_DIR)) {
        fs.mkdirSync(UI_DIR, { recursive: true });
        console.log('📁 Created ui/ directory');
    }

    let movedCount = 0;

    // 2. Move each category's component subdirectories into ui/
    for (const category of CATEGORIES) {
        const categoryDir = path.join(COMPONENTS_DIR, category);
        if (!fs.existsSync(categoryDir)) {
            console.log(`  ⚠️  Category not found: ${category}`);
            continue;
        }

        const entries = fs.readdirSync(categoryDir, { withFileTypes: true });

        for (const entry of entries) {
            // Skip the category-level index.ts
            if (entry.name === 'index.ts') continue;

            if (entry.isDirectory()) {
                const srcDir = path.join(categoryDir, entry.name);
                const destDir = path.join(UI_DIR, entry.name);

                if (fs.existsSync(destDir)) {
                    console.log(`  ⏭️  Already exists in ui/: ${entry.name}`);
                    continue;
                }

                // Copy the entire component directory
                fs.cpSync(srcDir, destDir, { recursive: true });
                movedCount++;
                console.log(`  ✓ ${category}/${entry.name} → ui/${entry.name}`);
            }
        }
    }

    // 3. Move root-level loose .vue files into ui/ as well
    for (const file of ROOT_LOOSE_VUE_FILES) {
        const srcPath = path.join(COMPONENTS_DIR, file);
        if (!fs.existsSync(srcPath)) continue;

        // Determine a component folder name from the file
        // e.g. "scroll-bar.vue" → ui/scroll-bar/scroll-bar.vue
        const baseName = file.replace('.vue', '');

        // Check if it already belongs to a moved component dir
        const destDir = path.join(UI_DIR, baseName);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        const destPath = path.join(destDir, file);
        if (!fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`  ✓ (root) ${file} → ui/${baseName}/${file}`);
            movedCount++;
        }
    }

    console.log(`\n✅ Moved ${movedCount} component(s) to ui/\n`);

    // 4. Fix relative imports inside the moved files
    console.log('🔧 Fixing relative import paths...');
    fixImports(UI_DIR);

    // 5. Create new ui/index.ts barrel export
    console.log('\n📝 Creating ui/index.ts barrel export...');
    createBarrelExport();

    // 6. Update components/index.ts to export from ui/ only
    console.log('📝 Updating components/index.ts...');
    updateComponentsIndex();

    console.log('\n🎉 Flattening complete!');
    console.log('⚠️  Remember to run `pnpm build` to verify the changes.');
}

function fixImports(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let fixCount = 0;

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            fixCount += fixImports(fullPath);
            continue;
        }

        if (!entry.name.endsWith('.vue') && !entry.name.endsWith('.ts')) continue;

        let content = fs.readFileSync(fullPath, 'utf-8');
        let changed = false;

        // Fix Primitive imports: ../../primitive → ../primitive
        // (was category/component/ depth 2, now ui/component/ depth 1 from primitive.ts which is at components/)
        if (content.includes("from '../../primitive'") || content.includes('from "../../primitive"')) {
            content = content.replace(
                /from ['"]\.\.\/\.\.\/primitive['"]/g,
                "from '../primitive'"
            );
            changed = true;
        }

        // Fix scroll-bar imports: ../../scroll-bar.vue → ../scroll-bar/scroll-bar.vue
        if (content.includes("from '../../scroll-bar.vue'") || content.includes('from "../../scroll-bar.vue"')) {
            content = content.replace(
                /from ['"]\.\.\/\.\.\/scroll-bar\.vue['"]/g,
                "from '../scroll-bar/scroll-bar.vue'"
            );
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(fullPath, content, 'utf-8');
            fixCount++;
            console.log(`  ✓ Fixed imports: ${path.relative(UI_DIR, fullPath)}`);
        }
    }

    return fixCount;
}

function createBarrelExport() {
    const entries = fs.readdirSync(UI_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name));

    const lines = [];
    for (const entry of entries) {
        const pascalCase = entry.name
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join('');

        // Check what .vue files exist
        const compDir = path.join(UI_DIR, entry.name);
        const mainFile = `${entry.name}.vue`;
        if (fs.existsSync(path.join(compDir, mainFile))) {
            lines.push(`export { default as ${pascalCase} } from './${entry.name}/${mainFile}'`);
        }
    }

    fs.writeFileSync(path.join(UI_DIR, 'index.ts'), lines.join('\n') + '\n');
    console.log(`  ✓ Created ui/index.ts with ${lines.length} exports`);
}

function updateComponentsIndex() {
    const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
    const content = `export * from './ui'\n`;
    fs.writeFileSync(indexPath, content);
    console.log('  ✓ Updated components/index.ts → export * from ./ui');
}

run();
