import type { PluginManager } from '@/plugin/plugin-manager';

declare global {
  interface Window {
    pluginManager?: PluginManager;
  }
}

export { };
