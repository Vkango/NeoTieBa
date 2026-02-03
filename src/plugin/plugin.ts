export type PluginFunction = (eventName: string, eventData: any) => any;

class PluginManager {
    private _pluginDirectory: string;
    private plugins: PluginFunction[] = [];

    constructor(pluginDirectory: string) {
        this._pluginDirectory = pluginDirectory;
    }

    async loadPlugins(): Promise<void> {
        try {
            const pluginFiles = import.meta.glob<{ default: PluginFunction }>('/src/plugins/*.ts');
            for (const [path, loadPlugin] of Object.entries(pluginFiles)) {
                try {
                    console.log(`Loading plugins from ${this._pluginDirectory}`);
                    const plugin = await loadPlugin();
                    if (typeof plugin.default === 'function') {
                        this.plugins.push(plugin.default);
                        console.log(`Loaded plugin from ${path}`);
                    } else {
                        console.warn(`Plugin at ${path} is not a valid function.`);
                    }
                } catch (error) {
                    console.error(`Failed to load plugin at ${path}:`, error);
                }
            }
        } catch (error) {
            console.error(`Failed to load plugins:`, error);
        }
    }

    async dispatchEvent<T = any>(eventName: string, eventData: T): Promise<T> {
        let feedback: T | undefined;
        this.plugins.forEach(plugin => {
            try {
                const result = plugin(eventName, eventData);
                if (result !== undefined) {
                    feedback = result;
                }
            } catch (error) {
                console.error(`Error in plugin during event ${eventName}:`, error);
            }
        });
        return feedback !== undefined ? feedback : eventData;
    }

    async dispatchEventMultiRet(eventName: string, eventData: any): Promise<any[]> {
        const feedback: any[] = [];
        this.plugins.forEach(plugin => {
            try {
                const result = plugin(eventName, eventData);
                if (result !== undefined) {
                    feedback.push(result);
                }
            } catch (error) {
                console.error(`Error in plugin during event ${eventName}:`, error);
            }
        });
        return feedback;
    }
}

export default PluginManager;
