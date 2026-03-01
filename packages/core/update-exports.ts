
import fs from 'fs';
import path from 'path';

const componentsDir = path.join(__dirname, 'src/components');
const packageJsonPath = path.join(__dirname, 'package.json');

const componentNames = fs.readdirSync(componentsDir).filter(name => {
    return fs.statSync(path.join(componentsDir, name)).isDirectory();
});

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const exports = {
    ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.mjs",
        "require": "./dist/index.js"
    },
    "./tailwind-preset": {
        "types": "./src/shared/tailwind.ts",
        "import": "./src/shared/tailwind.ts",
        "require": "./src/shared/tailwind.ts"
    },
    "./utils": {
        "types": "./dist/shared/utils.d.ts",
        "import": "./dist/shared/utils.mjs",
        "require": "./dist/shared/utils.js"
    },
    "./button.css": "./button.css"
};

componentNames.forEach(name => {
    const componentPath = path.join(componentsDir, name);
    const files = fs.readdirSync(componentPath);

    // export ./button -> ./dist/components/button/index.js
    if (files.includes('index.ts')) {
        exports[`./${name}`] = {
            "types": `./dist/components/${name}/index.d.ts`,
            "import": `./dist/components/${name}/index.mjs`,
            "require": `./dist/components/${name}/index.js`
        };
    }

    // export ./button/variants -> ./dist/components/button/variants.js
    if (files.includes('variants.ts')) {
        exports[`./${name}/variants`] = {
            "types": `./dist/components/${name}/variants.d.ts`,
            "import": `./dist/components/${name}/variants.mjs`,
            "require": `./dist/components/${name}/variants.js`
        };
    }

    // export ./button/machine -> ./dist/components/button/machine.js
    if (files.includes('machine.ts')) {
        exports[`./${name}/machine`] = {
            "types": `./dist/components/${name}/machine.d.ts`,
            "import": `./dist/components/${name}/machine.mjs`,
            "require": `./dist/components/${name}/machine.js`
        };
    }

    // export ./button/schema -> ./dist/components/button/schema.js
    if (files.includes('schema.ts')) {
        exports[`./${name}/schema`] = {
            "types": `./dist/components/${name}/schema.d.ts`,
            "import": `./dist/components/${name}/schema.mjs`,
            "require": `./dist/components/${name}/schema.js`
        };
    }

    // export ./button/props -> ./dist/components/button/props.js
    if (files.includes('props.ts')) {
        exports[`./${name}/props`] = {
            "types": `./dist/components/${name}/props.d.ts`,
            "import": `./dist/components/${name}/props.mjs`,
            "require": `./dist/components/${name}/props.js`
        };
    }
});

pkg.exports = exports;
pkg.scripts.build = "tsup"; // Use config file

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
console.log('Updated package.json exports');
