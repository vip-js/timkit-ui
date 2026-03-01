#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../packages/vue/src/components');

const categories = ['form', 'layout', 'navigation', 'feedback', 'data-display', 'overlay', 'advanced'];

console.log('📝 生成导出文件...\n');

for (const category of categories) {
    const categoryDir = path.join(COMPONENTS_DIR, category);
    const componentDirs = fs.readdirSync(categoryDir).filter(f => {
        const fullPath = path.join(categoryDir, f);
        return fs.statSync(fullPath).isDirectory();
    });

    const exports = componentDirs.map(comp => {
        const pascalCase = comp.split('-').map(w =>
            w.charAt(0).toUpperCase() + w.slice(1)
        ).join('');

        // 检查主组件文件是否存在
        const mainFile = path.join(categoryDir, comp, `${comp}.vue`);
        if (!fs.existsSync(mainFile)) {
            console.log(`  ⚠️  ${category}/${comp}: 主文件不存在`);
            return null;
        }

        return `export { default as ${pascalCase} } from './${comp}/${comp}.vue'`;
    }).filter(Boolean);

    const indexPath = path.join(categoryDir, 'index.ts');
    fs.writeFileSync(indexPath, exports.join('\n') + '\n');
    console.log(`  ✓ ${category}/index.ts (${exports.length} exports)`);
}

// 创建总导出文件
const mainIndexPath = path.join(COMPONENTS_DIR, 'index.ts');
const mainExports = categories.map(cat => `export * from './${cat}'`).join('\n');
fs.writeFileSync(mainIndexPath, mainExports + '\n');
console.log(`  ✓ index.ts\n`);

console.log('✅ 导出文件生成完成！');
