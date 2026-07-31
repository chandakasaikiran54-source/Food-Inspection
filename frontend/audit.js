import fs from 'fs';
import path from 'path';

const getFiles = (dir, filesList = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, filesList);
        } else if (file.match(/\.(js|jsx)$/)) {
            filesList.push(filePath);
        }
    }
    return filesList;
};

const files = getFiles('./src');
const deps = new Set();
const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;

for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const pkg = match[1];
        if (!pkg.startsWith('.')) {
            const basePkg = pkg.startsWith('@') ? pkg.split('/').slice(0, 2).join('/') : pkg.split('/')[0];
            deps.add(basePkg);
        }
    }
}

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
console.log('--- FOUND EXTERNAL IMPORTS ---');
console.log(Array.from(deps).sort());

console.log('\n--- MISSING DEPS IN PACKAGE.JSON ---');
for (const d of deps) {
    if (!installedDeps[d] && d !== 'react' && d !== 'react-dom') {
        console.log(d);
    }
}
