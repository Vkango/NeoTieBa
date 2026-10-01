import Favourite from '@/pages/user/Favourite.vue';
import History from '@/pages/user/History.vue';
import SearchInBar from '@/pages/search/SearchInBar.vue';
import User from '@/pages/user/User.vue';
import ViewBarThreads from '@/pages/threads/ViewBarThreads.vue';
import ViewThread from '@/pages/threads/ViewThread.vue';
import { read_file } from '@/core/file-io';
import type { TabItem } from '@/types/common';
import type {
  OpenBarPayload,
  OpenSearchInBarPayload,
  OpenThreadOptions,
  OpenThreadPayload,
  OpenUserPayload
} from '@/types/navigation';
import { useTabStore } from '@/stores/tabs';

function generateUniqueId(text: string): number {
  let hash = 0;
  if (text.length === 0) return hash;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return Math.abs(hash);
}

const loadingOrigin = (icon: string, title: string): TabItem =>
  ({ icon, title } as unknown) as TabItem;

export function useTabNavigation() {
  const tabStore = useTabStore();

  const openThread = (id: OpenThreadPayload, options: OpenThreadOptions = {}): void => {
    const key = generateUniqueId(`ViewThread${id}`);
    tabStore.addTab({
      key: String(key),
      icon: '/assets/loading.svg',
      title: '正在加载',
      component: ViewThread,
      props: {
        tid: id,
        key_: key,
        ...(options.local ? { local: true, local_dir: options.local_dir } : {})
      },
      origin: loadingOrigin('/assets/loading.svg', options.title || '正在加载')
    });
  };

  const openBar = (barName: OpenBarPayload): void => {
    const key = generateUniqueId(`ViewBarThreads${barName}`);
    tabStore.addTab({
      key: String(key),
      icon: '/assets/loading.svg',
      title: '正在加载',
      component: ViewBarThreads,
      props: { key_: key, barName },
      origin: loadingOrigin('/assets/loading.svg', '正在加载')
    });
  };

  const openUser = (uid: OpenUserPayload): void => {
    const key = generateUniqueId(`User${uid}`);
    tabStore.addTab({
      key: String(key),
      icon: '/assets/loading.svg',
      title: '正在加载',
      component: User,
      props: { key_: key, uid },
      origin: loadingOrigin('/assets/loading.svg', '正在加载')
    });
  };

  const openSearchInBar = ({ barName, barIcon }: OpenSearchInBarPayload): void => {
    const key = generateUniqueId(`Search${barName}`);
    tabStore.addTab({
      key: String(key),
      icon: '/assets/search.svg',
      title: '吧内搜索',
      component: SearchInBar,
      props: { key_: key, barName, barIcon },
      icon_invert: true,
      origin: loadingOrigin('/assets/search.svg', '吧内搜索')
    });
  };

  const openFavourite = (): void => {
    const key = generateUniqueId('Favourite');
    tabStore.addTab({
      key: String(key),
      icon: '/assets/favourite.svg',
      title: '我的收藏',
      component: Favourite,
      props: { key_: key },
      icon_invert: true,
      origin: loadingOrigin('/assets/favourite.svg', '我的收藏')
    });
  };

  const openHistory = (): void => {
    const key = generateUniqueId('History');
    tabStore.addTab({
      key: String(key),
      icon: '/assets/schedule.svg',
      title: '浏览历史',
      component: History,
      props: { key_: key },
      icon_invert: true,
      origin: loadingOrigin('/assets/schedule.svg', '浏览历史')
    });
  };

  const openLocalThread = async (file: string): Promise<void> => {
    let tid = 0;
    try {
      const ret = JSON.parse(await read_file(`${file}/page1.json`));
      tid = ret.thread.id;
    } catch {
      throw new Error('目录无效');
    }

    openThread(tid, { local: true, local_dir: file, title: file });
  };

  return {
    openThread,
    openBar,
    openUser,
    openSearchInBar,
    openFavourite,
    openHistory,
    openLocalThread
  };
}
