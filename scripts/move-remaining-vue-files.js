#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '../packages/vue/src/components-backup');
const TARGET_DIR = path.join(__dirname, '../packages/vue/src/components');

// 组件分类映射
const COMPONENT_MAP = {
    // Form
    'button': 'form',
    'checkbox': 'form',
    'checkbox-tree': 'advanced',
    'input': 'form',
    'label': 'form',
    'radio-group': 'form',
    'select': 'form',
    'select-native': 'form',
    'slider': 'form',
    'switch': 'form',
    'tags-input': 'form',
    'textarea': 'form',
    'toggle': 'form',
    'toggle-group': 'form',

    // Layout
    'accordion': 'layout',
    'card': 'layout',
    'collapsible': 'layout',
    'resizable': 'layout',
    'scroll-area': 'layout',
    'scroll-bar': 'layout',
    'separator': 'layout',
    'sheet': 'layout',

    // Navigation
    'breadcrumb': 'navigation',
    'dropdown-menu': 'navigation',
    'navigation-menu': 'navigation',
    'pagination': 'navigation',
    'tabs': 'navigation',

    // Feedback
    'alert': 'feedback',
    'alert-dialog': 'feedback',
    'dialog': 'feedback',
    'progress': 'feedback',
    'toast': 'feedback',
    'tooltip': 'feedback',

    // Data Display
    'avatar': 'data-display',
    'badge': 'data-display',
    'banner': 'data-display',
    'calendar': 'data-display',
    'calendar-rac': 'data-display',
    'table': 'data-display',
    'timeline': 'data-display',
    'notification': 'data-display',
    'navbar': 'data-display',

    // Overlay
    'hover-card': 'overlay',
    'popover': 'overlay',
    'command': 'overlay',

    // Advanced
    'combobox': 'advanced',
    'cropper': 'advanced',
    'date-picker': 'advanced',
    'datefield': 'advanced',
    'datefield-rac': 'advanced',
    'multiselect': 'advanced',
    'stepper': 'advanced',
    'tree': 'advanced',
};

function getComponentName(filename) {
    const baseName = filename.replace(/\.(vue|ts)$/, '');

    // 跳过辅助文件
    if (['index', 'primitive', 'slot', 'sonner', 'toaster'].includes(baseName)) {
        return null;
    }

    // 查找匹配的组件
    for (const comp of Object.keys(COMPONENT_MAP)) {
        if (baseName === comp || baseName.startsWith(comp + '-')) {
            return comp;
        }
    }

    return null;
}

async function moveRemainingFiles() {
    console.log('🔄 移动剩余的 Vue 组件文件...\n');

    const files = fs.readdirSync(BACKUP_DIR).filter(f =>
        f.endsWith('.vue') || f.endsWith('.ts')
    );

    let movedCount = 0;

    for (const file of files) {
        const componentName = getComponentName(file);

        if (!componentName) {
            console.log(`  ⏭️  跳过: ${file}`);
            continue;
        }

        const category = COMPONENT_MAP[componentName];
        if (!category) {
            console.log(`  ⚠️  未找到分类: ${file} (${componentName})`);
            continue;
        }

        // 创建目标目录
        const targetComponentDir = path.join(TARGET_DIR, category, componentName);
        if (!fs.existsSync(targetComponentDir)) {
            fs.mkdirSync(targetComponentDir, { recursive: true });
        }

        // 复制文件
        const srcPath = path.join(BACKUP_DIR, file);
        const destPath = path.join(targetComponentDir, file);

        if (!fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            movedCount++;
            console.log(`  ✓ ${category}/${componentName}/${file}`);
        }
    }

    console.log(`\n✅ 完成！共移动 ${movedCount} 个文件`);
}

moveRemainingFiles().catch(console.error);
