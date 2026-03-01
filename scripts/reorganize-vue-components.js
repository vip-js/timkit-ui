#!/usr/bin/env node

/**
 * Vue 组件重组脚本
 * 将所有 Vue 组件从单一目录重组为分类目录
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../packages/vue/src/components');
const BACKUP_DIR = path.join(__dirname, '../packages/vue/src/components-backup');

// 组件分类映射
const COMPONENT_CATEGORIES = {
    form: [
        'button', 'checkbox', 'input', 'label', 'radio-group',
        'select', 'slider', 'switch', 'tags-input', 'textarea', 'toggle'
    ],
    layout: [
        'accordion', 'card', 'collapsible', 'resizable',
        'scroll-area', 'separator', 'sheet'
    ],
    navigation: [
        'breadcrumb', 'dropdown-menu', 'navigation-menu',
        'pagination', 'tabs'
    ],
    feedback: [
        'alert', 'alert-dialog', 'dialog', 'progress',
        'toast', 'tooltip'
    ],
    'data-display': [
        'avatar', 'badge', 'banner', 'calendar',
        'table', 'timeline', 'notification', 'navbar'
    ],
    overlay: [
        'hover-card', 'popover', 'command'
    ],
    advanced: [
        'combobox', 'cropper', 'date-picker', 'datefield',
        'multiselect', 'stepper', 'tree', 'checkbox-tree'
    ]
};

// 辅助函数：获取组件的分类
function getCategoryForComponent(componentName) {
    for (const [category, components] of Object.entries(COMPONENT_CATEGORIES)) {
        if (components.includes(componentName)) {
            return category;
        }
    }
    return null;
}

// 辅助函数：获取组件基础名称
function getComponentBaseName(filename) {
    // 移除文件扩展名
    const baseName = filename.replace(/\.(vue|ts)$/, '');

    // 特殊处理：跳过 index, primitive, slot, sonner, toaster 等辅助文件
    if (['index', 'primitive', 'slot', 'sonner', 'toaster'].includes(baseName)) {
        return null;
    }

    // 对于每个已知组件，检查文件名是否匹配
    for (const [category, components] of Object.entries(COMPONENT_CATEGORIES)) {
        for (const comp of components) {
            // 完全匹配或以 "组件名-" 开头
            if (baseName === comp || baseName.startsWith(comp + '-')) {
                return comp;
            }
        }
    }

    return null;
}

async function reorganizeComponents() {
    console.log('🚀 开始重组 Vue 组件...\n');

    // 1. 备份原始目录
    console.log('📦 备份原始组件目录...');
    if (fs.existsSync(BACKUP_DIR)) {
        fs.rmSync(BACKUP_DIR, { recursive: true });
    }
    fs.cpSync(BASE_DIR, BACKUP_DIR, { recursive: true });
    console.log('✅ 备份完成\n');

    // 2. 创建分类目录
    console.log('📁 创建分类目录结构...');
    for (const category of Object.keys(COMPONENT_CATEGORIES)) {
        const categoryDir = path.join(BASE_DIR, category);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }
        console.log(`  ✓ ${category}/`);
    }
    console.log('');

    // 3. 读取所有组件文件
    const files = fs.readdirSync(BASE_DIR).filter(f =>
        f.endsWith('.vue') || f.endsWith('.ts')
    );

    // 4. 按组件分组
    const componentGroups = {};
    for (const file of files) {
        const baseName = getComponentBaseName(file);
        if (!componentGroups[baseName]) {
            componentGroups[baseName] = [];
        }
        componentGroups[baseName].push(file);
    }

    // 5. 移动文件到对应分类
    console.log('🔄 移动组件文件...');
    let movedCount = 0;

    for (const [componentName, componentFiles] of Object.entries(componentGroups)) {
        const category = getCategoryForComponent(componentName);

        if (!category) {
            console.log(`  ⚠️  未分类: ${componentName}`);
            continue;
        }

        // 创建组件子目录
        const componentDir = path.join(BASE_DIR, category, componentName);
        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }

        // 移动所有相关文件
        for (const file of componentFiles) {
            const srcPath = path.join(BASE_DIR, file);
            const destPath = path.join(componentDir, file);

            if (fs.existsSync(srcPath) && !srcPath.includes(category)) {
                fs.renameSync(srcPath, destPath);
                movedCount++;
            }
        }

        console.log(`  ✓ ${category}/${componentName}/ (${componentFiles.length} files)`);
    }

    console.log(`\n✅ 移动完成！共移动 ${movedCount} 个文件\n`);

    // 6. 创建分类导出文件
    console.log('📝 创建导出文件...');
    for (const [category, components] of Object.entries(COMPONENT_CATEGORIES)) {
        const indexPath = path.join(BASE_DIR, category, 'index.ts');
        const exports = components
            .map(comp => {
                const pascalCase = comp.split('-').map(w =>
                    w.charAt(0).toUpperCase() + w.slice(1)
                ).join('');
                return `export { default as ${pascalCase} } from './${comp}/${comp}.vue'`;
            })
            .join('\n');

        fs.writeFileSync(indexPath, exports + '\n');
        console.log(`  ✓ ${category}/index.ts`);
    }

    // 7. 创建总导出文件
    const mainIndexPath = path.join(BASE_DIR, 'index.ts');
    const mainExports = Object.keys(COMPONENT_CATEGORIES)
        .map(cat => `export * from './${cat}'`)
        .join('\n');
    fs.writeFileSync(mainIndexPath, mainExports + '\n');
    console.log(`  ✓ index.ts\n`);

    console.log('🎉 Vue 组件重组完成！');
    console.log(`📦 原始文件已备份到: ${BACKUP_DIR}`);
}

// 执行重组
reorganizeComponents().catch(console.error);
