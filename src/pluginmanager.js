import PluginManager from './plugin.js';
import { provide } from 'vue';

const pluginManager = new PluginManager('/src/plugins');

(async () => {
    await pluginManager.loadPlugins();
    // 挂载到 Vue 的全局属性
    provide('pluginManager', pluginManager);
    window.pluginManager = pluginManager; // 挂载到全局对象
})();

export default pluginManager;