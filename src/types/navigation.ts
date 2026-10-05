export type OpenThreadPayload = string | number;
export type OpenUserPayload = string | number;
export type OpenBarPayload = string;

export interface OpenSearchInBarPayload {
  barName: string;
  barIcon: string;
}

export interface OpenThreadOptions {
  local?: boolean;
  title?: string;
}
