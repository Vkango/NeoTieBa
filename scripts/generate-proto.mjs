import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import protobuf from 'protobufjs';

const projectDir = fileURLToPath(new URL('../', import.meta.url));
const protoDir = path.join(projectDir, 'src-tauri/proto');
export const outputDir = path.join(projectDir, 'src/core/generated/proto');
export const messages = JSON.parse(fs.readFileSync(path.join(projectDir, 'src/api/proto-messages.json'), 'utf8'));

// Each API needs its own Root: the schemas reuse unqualified DataReq/DataRes names.
export function buildRoots() {
    const roots = new Map();
    const parsed = new Map();
    const sources = new Map();
    function load(root, seen, file) {
        if (seen.has(file)) return;
        seen.add(file);
        let content = sources.get(file);
        if (content === undefined) {
            content = fs.readFileSync(path.join(protoDir, file), 'utf8');
            sources.set(file, content);
        }
        for (const match of content.matchAll(/^\s*import\s+["']([^"']+)["']\s*;/gm)) {
            load(root, seen, match[1]);
        }
        protobuf.parse(content, root, { keepCase: false });
    }
    for (const { namespace, path: file } of Object.values(messages)) {
        if (!roots.has(namespace)) {
            roots.set(namespace, new protobuf.Root());
            parsed.set(namespace, new Set());
        }
        load(roots.get(namespace), parsed.get(namespace), file);
    }
    for (const root of roots.values()) root.resolveAll();
    for (const [name, { namespace }] of Object.entries(messages)) roots.get(namespace).lookupType(name);
    return roots;
}

export function generate() {
    const roots = buildRoots();
    fs.mkdirSync(outputDir, { recursive: true });
    for (const [namespace, root] of roots) {
        const destination = path.join(outputDir, `${namespace}.json`);
        const content = JSON.stringify(root.toJSON()) + '\n';
        if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8') !== content) {
            fs.writeFileSync(destination, content);
        }
    }
    console.log(`Generated ${roots.size} protobuf descriptors.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
