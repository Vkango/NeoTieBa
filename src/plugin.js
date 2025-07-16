class PluginManager {
    constructor(pluginDirectory) {
        this.pluginDirectory = pluginDirectory;
        this.plugins = [];
    }

    async loadPlugins() {
        try {
            // Use a static path for the glob pattern
            const pluginFiles = await import.meta.glob('/src/plugins/*.js');
            for (const [path, loadPlugin] of Object.entries(pluginFiles)) {
                try {
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

    async dispatchEvent(eventName, eventData) {
        let feedback;
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
        if (!feedback) return eventData;
        return feedback;
    }

    async dispatchEventMultiRet(eventName, eventData) {
        let feedback;
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