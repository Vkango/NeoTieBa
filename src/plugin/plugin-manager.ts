import PluginManager from '@/plugin/plugin';
import { provide } from 'vue';

const pluginManager = new PluginManager('/src/plugins');

(async () => {
    await pluginManager.loadPlugins();
    provide('pluginManager', pluginManager);
    (window as any).pluginManager = pluginManager;
})();

export default pluginManager;
