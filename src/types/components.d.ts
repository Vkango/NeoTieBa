declare module '@/components' {
  import type { Component } from 'vue';

  export interface NotificationItem {
    id: string | number;
    timestamp: number;
    title?: string;
    source?: string;
    component?: any;
    props?: Record<string, any>;
    duration?: number;
    visible?: boolean;
    hidden?: boolean;
    click?: () => void;
    [key: string]: any;
  }

  export interface NotificationComponent {
    notifications: NotificationItem[];
    hiddenNotifications: NotificationItem[];
    addNotification: (
      title: string,
      source: string,
      component: Component,
      clickHandler: (() => void) | null,
      props: Record<string, unknown>,
      duration?: number
    ) => void;
    deleteNotification?: (id: string | number) => void;
  }

  export interface TabItem {
    id?: number | string;
    key: string | number;
    title: string;
    icon?: string;
    icon_invert?: boolean;
    selected?: boolean;
    show?: boolean;
    if?: boolean;
    origin?: { icon?: string; title?: string };
    component: Component | any;
    props?: Record<string, any>;
    closable?: boolean;
    persistent?: boolean;
    renderKey?: string;
  }

  export interface TabsComponent {
    tabs: TabItem[];
    addTab: (
      key: string | number,
      icon: string,
      title: string,
      component: Component,
      props?: Record<string, any>,
      closable?: boolean,
      persistent?: boolean,
      tooltip?: string
    ) => void;
    handleClick: (id: string | number) => void;
    handleDelete: (id: string | number) => void;
    findIdByKey: (key: string | number) => number;
    setTitle: (key: string | number, title: string) => void;
    setIcon: (key: string | number, icon: string) => void;
    getTab: (id: number | string) => TabItem | undefined;
    setTab: (id: number | string, tab: Partial<TabItem>) => void;
  }
}
