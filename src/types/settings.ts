export interface BaseSettingItem {
    id: string;
    icon: string;
    title: string;
    desc: string;
    type: string;
}

export interface ToggleSettingItem extends BaseSettingItem {
    type: 'toggle';
    value: boolean;
}

export interface SelectSettingItem extends BaseSettingItem {
    type: 'select';
    value: string;
    options: string[];
}

export interface InputSettingItem extends BaseSettingItem {
    type: 'input';
    value: string;
    placeholder?: string;
}

export interface ButtonSettingItem extends BaseSettingItem {
    type: 'button';
    action?: string;
    value?: never;
    options?: never;
    placeholder?: never;
}

export type SettingItem = ToggleSettingItem | SelectSettingItem | InputSettingItem | ButtonSettingItem;

export function isToggleSetting(item: SettingItem): item is ToggleSettingItem {
    return item.type === 'toggle';
}

export function isSelectSetting(item: SettingItem): item is SelectSettingItem {
    return item.type === 'select';
}

export function isInputSetting(item: SettingItem): item is InputSettingItem {
    return item.type === 'input';
}

export function isButtonSetting(item: SettingItem): item is ButtonSettingItem {
    return item.type === 'button';
}

export interface MenuSettingItem {
    title: string;
    icon: string;
    id: number;
}

export interface InfoItem {
    title: string;
    icon: string;
    desc: string;
    id?: number;
}
