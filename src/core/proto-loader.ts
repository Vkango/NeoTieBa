import { readTextFile } from '@tauri-apps/plugin-fs';
import { resolveResource } from '@tauri-apps/api/path';
import * as protobuf from 'protobufjs';

const protoRoots = new Map<string, protobuf.Root>();
const fileCache = new Map<string, string>();
const rootParsedFiles = new Map<string, Set<string>>();
const rootLoadingFiles = new Map<string, Set<string>>();

async function readProtoFile(protoPath: string): Promise<string> {
    if (fileCache.has(protoPath)) {
        return fileCache.get(protoPath)!;
    }

    try {
        const resourcePath = await resolveResource(`proto/${protoPath}`);
        const content = await readTextFile(resourcePath);
        fileCache.set(protoPath, content);
        return content;
    } catch (error: any) {
        throw new Error(`Failed to read proto file ${protoPath}: ${error.message}`);
    }
}

function extractImports(protoContent: string): string[] {
    const imports: string[] = [];
    const importRegex = /^\s*import\s+["']([^"']+)["']\s*;/gm;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(protoContent)) !== null) {
        imports.push(match[1]);
    }

    return imports;
}

async function loadProtoWithDependencies(
    root: protobuf.Root,
    rootKey: string,
    protoPath: string,
    depth = 0
): Promise<void> {
    if (!rootParsedFiles.has(rootKey)) {
        rootParsedFiles.set(rootKey, new Set());
    }
    if (!rootLoadingFiles.has(rootKey)) {
        rootLoadingFiles.set(rootKey, new Set());
    }

    const parsedFiles = rootParsedFiles.get(rootKey)!;
    const loadingFiles = rootLoadingFiles.get(rootKey)!;

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
        const content = await readProtoFile(protoPath);
        const imports = extractImports(content);

        for (const importPath of imports) {
            if (!parsedFiles.has(importPath)) {
                await loadProtoWithDependencies(root, rootKey, importPath, depth + 1);
            }
        }

        protobuf.parse(content, root, { keepCase: false });
        parsedFiles.add(protoPath);
    } catch (error: any) {
        parsedFiles.add(protoPath);
    } finally {
        loadingFiles.delete(protoPath);
    }
}

function getProtoRoot(rootKey: string): protobuf.Root {
    if (!protoRoots.has(rootKey)) {
        const root = new protobuf.Root();
        protoRoots.set(rootKey, root);
    }
    return protoRoots.get(rootKey)!;
}

interface ProtoConfig {
    path: string;
    namespace: string;
}

async function loadProtoForMessage(messageName: string): Promise<protobuf.Root> {
    const messageToProtoMap: Record<string, ProtoConfig> = {
        'ProfileReqIdl': { path: 'Profile/ProfileReqIdl.proto', namespace: 'Profile' },
        'ProfileResIdl': { path: 'Profile/ProfileResIdl.proto', namespace: 'Profile' },
        'UserPostReqIdl': { path: 'UserPost/UserPostReqIdl.proto', namespace: 'UserPost' },
        'UserPostResIdl': { path: 'UserPost/UserPostResIdl.proto', namespace: 'UserPost' },
        'PbPageReqIdl': { path: 'PbPage/PbPageReqIdl.proto', namespace: 'PbPage' },
        'PbPageResIdl': { path: 'PbPage/PbPageResIdl.proto', namespace: 'PbPage' },
    };

    const config = messageToProtoMap[messageName];

    if (!config) {
        throw new Error(`Unknown message type: ${messageName}. Please add mapping in proto-loader.ts`);
    }

    const rootKey = config.namespace;
    const root = getProtoRoot(rootKey);

    await loadProtoWithDependencies(root, rootKey, config.path);

    return root;
}

export interface ProtoLoader<T = any> {
    encode: (data: T) => Uint8Array;
    decode: (buffer: Uint8Array) => T;
}

export async function load<T = any>(messageName: string): Promise<ProtoLoader<T>> {
    try {
        const protoRoot = await loadProtoForMessage(messageName);
        const MessageType = protoRoot.lookupType(messageName);

        if (!MessageType) {
            throw new Error(`no such type: ${messageName}`);
        }

        return {
            encode: (data: T): Uint8Array => {
                const message = MessageType.create(data as any);
                return MessageType.encode(message).finish();
            },

            decode: (buffer: Uint8Array): T => {
                try {
                    const message = MessageType.decode(buffer);
                    return MessageType.toObject(message, {
                        longs: String,
                        enums: String,
                        bytes: String,
                        defaults: true,
                        arrays: true,
                        objects: true
                    }) as T;
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
