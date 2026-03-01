
import fs from 'fs';
import path from 'path';

// Manual metadata configuration
// TODO: Externalize this if it grows too large
const COMPONENT_METADATA: Record<string, {
    dependencies?: string[];
    registryDependencies?: string[];
    title?: string;
}> = {
    button: {
        // Actually button usually just needs CVA + clsx + tailwind-merge
    },
    // We can leave most empty and just default to common libs
};

const COMMON_DEPENDENCIES = ["clsx", "tailwind-merge", "class-variance-authority"];

const FRAMEWORKS = ['react', 'vue', 'weapp'];
const REGISTRY_ROOT = path.join(process.cwd(), 'registry');

interface RegistryItem {
    name: string;
    type: 'registry:ui';
    dependencies?: string[];
    registryDependencies?: string[];
    files: Array<{
        path: string;
        content: string;
        target: string;
        type: 'registry:ui';
    }>;
    meta?: {
        frameworks: string[];
    };
}

function getComponentFiles(framework: string, componentName: string): Array<{ path: string, content: string, target: string }> {
    const frameworkDir = path.join(REGISTRY_ROOT, framework, 'ui');
    if (!fs.existsSync(frameworkDir)) return [];

    let files: Array<{ path: string, content: string, target: string }> = [];

    // 1. Check for single file: e.g. registry/react/ui/button.tsx
    // Extensions to try: tsx, jsx, vue, html
    const extensions = framework === 'react' ? ['.tsx'] : framework === 'vue' ? ['.vue'] : ['.html'];

    // WeApp is folder-based usually, React/Vue can be file or folder.

    // Try file match first (React/Vue)
    for (const ext of extensions) {
        const filePath = path.join(frameworkDir, `${componentName}${ext}`);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            // Target: components/ui/button.tsx
            const target = `components/ui/${componentName}${ext}`;
            files.push({
                path: `${framework}/ui/${componentName}${ext}`,
                content,
                target
            });
        }
    }

    // 2. Check for directory: e.g. registry/vue/ui/button/ or registry/weapp/ui/button/
    const dirPath = path.join(frameworkDir, componentName);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const recursiveRead = (dir: string, baseRelative: string) => {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const relativePath = path.join(baseRelative, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    recursiveRead(fullPath, relativePath);
                } else {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    // Target logic:
                    // For WeApp: button/button.wxml
                    // For Vue: button/button.vue -> components/ui/button/button.vue (preserve structure)
                    // For React: if folder, presumably same.

                    // WeApp usually goes to distinct folders? 
                    // CLI add.ts: "targetPath = path.join(cwd, file.target)"

                    // Let's normalize target to "components/ui/..." or "src/..." relative to user project
                    // Default assume "components/ui" prefix.

                    // For WeApp, users might put in "miniprogram/components/..."
                    // CLI `add.ts` logic might need to be flexible.
                    // But here we set "default target".
                    // If we use "components/ui/" as base:
                    // React/Vue: components/ui/button/index.tsx
                    // WeApp: components/ui/button/button.wxml (maybe we want "components/button/..."?)
                    // Let's stick to "components/ui" as standard abstract path.

                    const target = `components/ui/${componentName}/${relativePath}`;

                    files.push({
                        path: `${framework}/ui/${componentName}/${relativePath}`,
                        content,
                        target
                    });
                }
            });
        };
        recursiveRead(dirPath, '');
    }

    return files;
}

const allComponentNames = new Set<string>();

// Discover all components
FRAMEWORKS.forEach(fw => {
    const dir = path.join(REGISTRY_ROOT, fw, 'ui');
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        // file: button.tsx -> button
        // dir: button -> button
        const name = path.basename(item, path.extname(item));
        allComponentNames.add(name);
    });
});

const registryItems: RegistryItem[] = [];

allComponentNames.forEach(name => {
    const item: RegistryItem = {
        name,
        type: 'registry:ui',
        dependencies: [
            ...COMMON_DEPENDENCIES,
            ...(COMPONENT_METADATA[name]?.dependencies || [])
        ],
        registryDependencies: COMPONENT_METADATA[name]?.registryDependencies || [],
        files: [],
        meta: {
            frameworks: []
        }
    };

    FRAMEWORKS.forEach(fw => {
        const files = getComponentFiles(fw, name);
        if (files.length > 0) {
            item.files.push(...files.map(f => ({
                ...f,
                type: 'registry:ui' as const
            })));
            item.meta!.frameworks.push(fw);
        }
    });

    // Special handling: if weapp has `button` and react has `button`, they merge into one item.
    // If a component only exists in React, it's still valid.


    // Auto-detect dependencies from WeApp json
    const weappJsonPath = path.join(REGISTRY_ROOT, 'weapp', 'ui', name, `${name}.json`);
    if (fs.existsSync(weappJsonPath)) {
        try {
            const jsonContent = JSON.parse(fs.readFileSync(weappJsonPath, 'utf-8'));
            if (jsonContent.usingComponents) {
                Object.values(jsonContent.usingComponents).forEach((compPath: object) => {
                    // path is usually "../component-name/component-name"
                    const parts = compPath.split('/');
                    const depName = parts[parts.length - 2]; // Get the folder name
                    if (allComponentNames.has(depName) && depName !== name) {
                        item.registryDependencies!.push(depName);
                    }
                });
            }
        } catch (e) {
            console.warn(`Failed to parse WeApp JSON for ${name}`, e);
        }
    }

    // Add utils dependency for WeApp components
    if (item.meta?.frameworks.includes('weapp')) {
        item.registryDependencies!.push('utils');
    }

    // Dedup registryDependencies
    item.registryDependencies = [...new Set(item.registryDependencies)];

    registryItems.push(item);
});

// Manual entry for WeApp utils
const weappUtilsPath = path.join(REGISTRY_ROOT, 'weapp', 'utils', 'machine.ts');
if (fs.existsSync(weappUtilsPath)) {
    registryItems.push({
        name: 'utils',
        type: 'registry:ui', // or logic?
        dependencies: [],
        registryDependencies: [],
        files: [{
            path: 'weapp/utils/machine.ts',
            content: fs.readFileSync(weappUtilsPath, 'utf-8'),
            target: 'components/utils/machine.ts', // Place in components/utils to satisfy ../../utils imports
            type: 'registry:ui'
        }],
        meta: {
            frameworks: ['weapp']
        }
    });
}

// Write registry-all.json
fs.writeFileSync(path.join(process.cwd(), 'registry-all.json'), JSON.stringify({ items: registryItems }, null, 2));
console.log(`Generated registry-all.json with ${registryItems.length} components.`);
