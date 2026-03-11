const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const distDir = path.join(__dirname, 'dist');

if (fs.existsSync(distDir)) {
    const files = walk(distDir);

    files.forEach(file => {
        // Only process JS, MJS, CJS, TS (d.ts) and MTS files
        if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.cjs') || file.endsWith('.ts') || file.endsWith('.mts') || file.endsWith('.cts')) {
            let content = fs.readFileSync(file, 'utf-8');

            let targetExt = '.js'; // default to .js for .js and .d.ts files
            if (file.endsWith('.mjs') || file.endsWith('.mts') || file.endsWith('.d.mts')) {
                targetExt = '.mjs';
            } else if (file.endsWith('.cjs') || file.endsWith('.cts') || file.endsWith('.d.cts')) {
                targetExt = '.cjs';
            }

            // Replace ".vue" or '.vue' with ".js" or ".mjs"
            let newContent = content.replace(/\.vue(['"])/g, targetExt + '$1');

            // Inline the /plugin-vue/export-helper virtual module
            // For ESM:
            newContent = newContent.replace(
                /import\s+(\w+)\s+from\s+['"](?:\\0|\0)?\/plugin-vue\/export-helper['"];?/g,
                'const $1 = (sfc, props) => { const target = sfc.__vccOpts || sfc; for (const [key, val] of props) { target[key] = val; } return target; };'
            );
            // For CJS:
            newContent = newContent.replace(
                /var\s+(\w+)\s*=\s*(?:__toESM\()?require\(['"](?:\\0|\x00|\0)?\/plugin-vue\/export-helper['"]\)\)?;?/g,
                'var $1 = { default: (sfc, props) => { const target = sfc.__vccOpts || sfc; for (const [key, val] of props) { target[key] = val; } return target; } };\\nvar ${1}_default = $1.default;'
            );

            if (newContent !== content) {
                fs.writeFileSync(file, newContent, 'utf-8');
            }
        }
    });
}
