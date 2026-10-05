/**
 * 本地主题色提取（移植自 dropin 的 MonetThemeExtractor）
 * K-means 聚类提取主色，并派生深/浅两套主题色（仅主题色，不含完整 MD3 色板）
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface AccentPair {
  light: string;
  dark: string;
}

interface ClusterColor extends Rgb {
  saturation: number;
  hex: string;
}

const SAMPLE_SIZE = 64;
const CLUSTER_COUNT = 6;
const MAX_ITERATIONS = 10;
/** 饱和度低于该阈值视为无彩色，直接沿用原色（避免灰度图被强制染成红色） */
const NEUTRAL_SATURATION = 0.08;

let canvas: HTMLCanvasElement | null = null;
let canvasCtx: CanvasRenderingContext2D | null = null;

function getCanvasContext(): CanvasRenderingContext2D | null {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;
    canvasCtx = canvas.getContext('2d', { willReadFrequently: true });
  }
  return canvasCtx;
}

export function clampRgb(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function rgbToHex(color: Rgb): string {
  const toHex = (n: number): string => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

export function hexToRgb(value: string): Rgb | null {
  if (typeof value !== 'string') return null;
  const raw = value.trim().replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(raw)) return null;
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

export function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const diff = max - min;
  const sum = max + min;
  const l = sum / 2;
  let h = 0;
  let s = 0;
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - sum) : diff / sum;
    switch (max) {
      case rn:
        h = (gn - bn) / diff + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / diff + 2;
        break;
      default:
        h = (rn - gn) / diff + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

export function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  const hn = (h % 360) / 360;
  const hue2rgb = (p: number, q: number, t: number): number => {
    let tv = t;
    if (tv < 0) tv += 1;
    if (tv > 1) tv -= 1;
    if (tv < 1 / 6) return p + (q - p) * 6 * tv;
    if (tv < 1 / 2) return q;
    if (tv < 2 / 3) return p + (q - p) * (2 / 3 - tv) * 6;
    return p;
  };
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hn + 1 / 3);
    g = hue2rgb(p, q, hn);
    b = hue2rgb(p, q, hn - 1 / 3);
  }
  return { r: clampRgb(r * 255), g: clampRgb(g * 255), b: clampRgb(b * 255) };
}

function getSaturation({ r, g, b }: Rgb): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function colorDistance(a: Rgb, b: Rgb): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** K-means 聚类，与 dropin 一致；初始质心用等间隔取样保证同图结果稳定 */
function kMeansClustering(colors: Rgb[], k: number = CLUSTER_COUNT, maxIterations: number = MAX_ITERATIONS): ClusterColor[] {
  if (colors.length === 0) return [];

  const centroids: Rgb[] = [];
  for (let i = 0; i < k; i++) {
    const index = Math.min(colors.length - 1, Math.floor((i * colors.length) / k));
    centroids.push({ ...colors[index] });
  }

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const clusters: Rgb[][] = Array.from({ length: k }, () => []);
    colors.forEach((color) => {
      let minDistance = Infinity;
      let closestCentroid = 0;
      centroids.forEach((centroid, index) => {
        const distance = colorDistance(color, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = index;
        }
      });
      clusters[closestCentroid].push(color);
    });

    const newCentroids = clusters.map((cluster, index) => {
      if (cluster.length === 0) return centroids[index];
      const avgR = cluster.reduce((sum, c) => sum + c.r, 0) / cluster.length;
      const avgG = cluster.reduce((sum, c) => sum + c.g, 0) / cluster.length;
      const avgB = cluster.reduce((sum, c) => sum + c.b, 0) / cluster.length;
      return { r: clampRgb(avgR), g: clampRgb(avgG), b: clampRgb(avgB) };
    });

    let converged = true;
    for (let i = 0; i < k; i++) {
      if (colorDistance(centroids[i], newCentroids[i]) > 1) {
        converged = false;
        break;
      }
    }
    for (let i = 0; i < k; i++) centroids[i] = newCentroids[i];
    if (converged) break;
  }

  return centroids
    .map((color) => ({ ...color, saturation: getSaturation(color), hex: rgbToHex(color) }))
    .sort((a, b) => b.saturation - a.saturation);
}

/** 与 dropin 的 selectPrimaryColor 一致：优先取饱和度较高且亮度适中的簇 */
function selectPrimaryColor(colors: ClusterColor[]): Rgb | null {
  if (colors.length === 0) return null;
  const suitable = colors.filter((color) => {
    const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
    return color.saturation > 0.3 && brightness > 50 && brightness < 200;
  });
  return suitable.length > 0 ? suitable[0] : colors[0];
}

function samplePixels(img: HTMLImageElement): Rgb[] {
  const ctx = getCanvasContext();
  if (!ctx || !canvas) return [];
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const imageData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const pixels = imageData.data;
  const colors: Rgb[] = [];
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue;
    colors.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
  }
  return colors;
}

/** 由源色派生深浅主题色：仅取色相，浅色 s0.7/l0.45、深色 s0.6/l0.8（与 dropin 生成主题的 primary 一致） */
export function deriveAccentPair(source: Rgb): AccentPair {
  const { h, s } = rgbToHsl(source);
  if (s < NEUTRAL_SATURATION) {
    return { light: rgbToHex(source), dark: rgbToHex(source) };
  }
  return {
    light: rgbToHex(hslToRgb({ h, s: 0.7, l: 0.45 })),
    dark: rgbToHex(hslToRgb({ h, s: 0.6, l: 0.8 })),
  };
}

/** 用户手动指定的种子色 → 深浅主题色（对应 dropin 的 generateThemeFromColor） */
export function seedToAccentPair(seed: string): AccentPair | null {
  const rgb = hexToRgb(seed);
  if (!rgb) return null;
  return deriveAccentPair(rgb);
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
}

async function loadExtractableImage(url: string): Promise<HTMLImageElement | null> {
  const isLocal = url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('file:');
  if (!isLocal) {
    try {
      const { fetchImage } = await import('@/core/request');
      const { normalizeMediaUrl } = await import('@/utils/settings-policy');
      const dataUrl = await fetchImage(normalizeMediaUrl(url));
      return await loadImageElement(dataUrl);
    } catch {
      // 网络管线失败时回退直连（可能因 canvas 污染失败，由上层捕获）
    }
  }
  try {
    return await loadImageElement(url);
  } catch {
    return null;
  }
}

export async function extractSourceColor(url: string): Promise<Rgb | null> {
  const img = await loadExtractableImage(url);
  if (!img) return null;
  try {
    const colors = samplePixels(img);
    return selectPrimaryColor(kMeansClustering(colors));
  } catch {
    return null;
  }
}

const pairCache = new Map<string, AccentPair>();
const pendingPairs = new Map<string, Promise<AccentPair | null>>();

/** 从图片 URL 提取深浅主题色对（带会话级缓存与并发去重），失败返回 null */
export function extractAccentPair(url: string): Promise<AccentPair | null> {
  if (!url) return Promise.resolve(null);
  const cached = pairCache.get(url);
  if (cached) return Promise.resolve(cached);
  const pending = pendingPairs.get(url);
  if (pending) return pending;

  const task = extractSourceColor(url)
    .then((source) => {
      const pair = source ? deriveAccentPair(source) : null;
      if (pair) pairCache.set(url, pair);
      return pair;
    })
    .catch(() => null)
    .finally(() => {
      pendingPairs.delete(url);
    });
  pendingPairs.set(url, task);
  return task;
}
