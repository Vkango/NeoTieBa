import { readTextFile } from '@tauri-apps/plugin-fs';
import { resolveResource } from '@tauri-apps/api/path';
import * as protobuf from 'protobufjs';

const protoRoots = new Map();
const fileCache = new Map();
const rootParsedFiles = new Map();
const rootLoadingFiles = new Map();

async function readProtoFile(protoPath) {
    if (fileCache.has(protoPath)) {
        return fileCache.get(protoPath);
    }

    try {
        const resourcePath = await resolveResource(`proto/${protoPath}`);
        const content = await readTextFile(resourcePath);
        fileCache.set(protoPath, content);
        return content;
    } catch (error) {
        throw new Error(`Failed to read proto file ${protoPath}: ${error.message}`);
    }
}

function extractImports(protoContent) {
    const imports = [];
    const importRegex = /^\s*import\s+["']([^"']+)["']\s*;/gm;
    let match;

    while ((match = importRegex.exec(protoContent)) !== null) {
        imports.push(match[1]);
    }

    return imports;
}

async function loadProtoWithDependencies(root, rootKey, protoPath, depth = 0) {
    // 获取此 root 的解析状态
    if (!rootParsedFiles.has(rootKey)) {
        rootParsedFiles.set(rootKey, new Set());
    }
    if (!rootLoadingFiles.has(rootKey)) {
        rootLoadingFiles.set(rootKey, new Set());
    }

    const parsedFiles = rootParsedFiles.get(rootKey);
    const loadingFiles = rootLoadingFiles.get(rootKey);

    if (parsedFiles.has(protoPath)) {
        return;
    }

    if (loadingFiles.has(protoPath)) {
        console.warn(`[Warn] Circular dependency detected: ${protoPath}`);
        return;
    }

    if (depth > 50) {
        console.error(`[Error] Max recursion depth reached for: ${protoPath}`);
        return;
    }

    loadingFiles.add(protoPath);

    try {
        // console.log(`${'  '.repeat(depth)}[${rootKey}] Loading: ${protoPath} (depth: ${depth})`);
        const content = await readProtoFile(protoPath);
        const imports = extractImports(content);

        if (imports.length > 0) {
            // console.log(`${'  '.repeat(depth)} Dependencies: ${imports.join(', ')}`);
        }

        for (const importPath of imports) {
            if (!parsedFiles.has(importPath)) {
                await loadProtoWithDependencies(root, rootKey, importPath, depth + 1);
            }
        }
        protobuf.parse(content, root, { keepCase: false });
        parsedFiles.add(protoPath);
        // console.log(`${'  '.repeat(depth)}[${rootKey}] Parsed: ${protoPath}`);

    } catch (error) {
        // console.error(`${'  '.repeat(depth)}[Error] Failed: ${protoPath}`, error.message);
        parsedFiles.add(protoPath);
    } finally {
        loadingFiles.delete(protoPath);
    }
}

function getProtoRoot(rootKey) {
    if (!protoRoots.has(rootKey)) {
        const root = new protobuf.Root();
        protoRoots.set(rootKey, root);
        console.log(`[Info] Proto root initialized for: ${rootKey}`);
    }
    return protoRoots.get(rootKey);
}

async function loadProtoForMessage(messageName) {
    const messageToProtoMap = {
        'ProfileReqIdl': { path: 'Profile/ProfileReqIdl.proto', namespace: 'Profile' },
        'ProfileResIdl': { path: 'Profile/ProfileResIdl.proto', namespace: 'Profile' },
        'UserPostReqIdl': { path: 'UserPost/UserPostReqIdl.proto', namespace: 'UserPost' },
        'UserPostResIdl': { path: 'UserPost/UserPostResIdl.proto', namespace: 'UserPost' }
    };

    const config = messageToProtoMap[messageName];

    if (!config) {
        throw new Error(`Unknown message type: ${messageName}. Please add mapping in proto-loader.js`);
    }

    const rootKey = config.namespace;
    const root = getProtoRoot(rootKey);

    console.log(`Loading proto for message type: ${messageName} (namespace: ${rootKey})`);
    await loadProtoWithDependencies(root, rootKey, config.path);

    return root;
}

export async function load(messageName) {
    try {
        const protoRoot = await loadProtoForMessage(messageName);
        const MessageType = protoRoot.lookupType(messageName);

        if (!MessageType) {
            throw new Error(`no such type: ${messageName}`);
        }

        return {
            encode: (data) => {
                const errMsg = MessageType.verify(data);
                if (errMsg) {
                    throw new Error(`Proto verification failed: ${errMsg}`);
                }
                const message = MessageType.create(data);
                return MessageType.encode(message).finish();
            },

            decode: (buffer) => {
                try {
                    const message = MessageType.decode(buffer);
                    return MessageType.toObject(message, {
                        longs: String,
                        enums: String,
                        bytes: String,
                        defaults: true,
                        arrays: true,
                        objects: true
                    });
                } catch (error) {
                    console.error('Proto decode error:', error);
                    throw error;
                }
            }
        };
    } catch (error) {
        console.error(`[Error] Loading proto message ${messageName}:`, error);
        throw error;
    }
}
