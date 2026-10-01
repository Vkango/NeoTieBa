import protobuf from 'protobufjs/light';
import { getProtoMessageConfig } from '@/api/proto-endpoints';

const descriptors = import.meta.glob<protobuf.INamespace>('./generated/proto/*.json', {
    import: 'default',
});
const rootPromises = new Map<string, Promise<protobuf.Root>>();
const messageLoaderPromises = new Map<string, Promise<ProtoLoader>>();

function loadRoot(namespace: string): Promise<protobuf.Root> {
    const cached = rootPromises.get(namespace);
    if (cached) return cached;
    const promise = (async () => {
        const importDescriptor = descriptors[`./generated/proto/${namespace}.json`];
        if (!importDescriptor) {
            throw new Error(`Missing protobuf descriptor for ${namespace}. Run pnpm proto:generate.`);
        }
        const root = protobuf.Root.fromJSON(await importDescriptor());
        root.resolveAll();
        return root;
    })();
    rootPromises.set(namespace, promise);
    void promise.catch(() => rootPromises.delete(namespace));
    return promise;
}

export interface ProtoLoader<T = any> {
    encode: (data: T) => Uint8Array;
    decode: (buffer: Uint8Array) => T;
}

export async function load<T = any>(messageName: string): Promise<ProtoLoader<T>> {
    const cached = messageLoaderPromises.get(messageName);
    if (cached) return cached as Promise<ProtoLoader<T>>;
    const promise = (async (): Promise<ProtoLoader> => {
        const { namespace } = getProtoMessageConfig(messageName);
        const root = await loadRoot(namespace);
        const MessageType = root.lookupType(messageName);
        return {
            encode: (data) => MessageType.encode(MessageType.create(data)).finish(),
            decode: (buffer) => MessageType.toObject(MessageType.decode(buffer), {
                longs: String,
                enums: String,
                bytes: String,
                defaults: true,
                arrays: true,
                objects: true,
            }),
        };
    })();
    messageLoaderPromises.set(messageName, promise);
    void promise.catch(() => messageLoaderPromises.delete(messageName));
    return promise as Promise<ProtoLoader<T>>;
}
