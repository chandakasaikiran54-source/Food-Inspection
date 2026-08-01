import fs from 'fs';
import path from 'path';

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = getFiles('src');
const deps = new Set();
const pkgText = fs.readFileSync('package.json', 'utf8');
const pkg = JSON.parse(pkgText);
const allCurrentDeps = Object.keys(pkg.dependencies || {});

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /import.*?from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let dep = match[1];
        if (!dep.startsWith('.') && !dep.startsWith('/')) {
            // handle scoped packages like @hookform/resolvers
            if (dep.startsWith('@')) {
                deps.add(dep.split('/').slice(0, 2).join('/'));
            } else {
                deps.add(dep.split('/')[0]);
            }
        }
    }
});

const usedDeps = Array.from(deps);
const missing = usedDeps.filter(d => !allCurrentDeps.includes(d));
const unused = allCurrentDeps.filter(d => !usedDeps.includes(d));

fs.writeFileSync('report.json', JSON.stringify({ missing, unused }, null, 2));
console.log('Wrote report.json');
