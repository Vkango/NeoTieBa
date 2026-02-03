import blocklistData from '@/plugins/blocklist.json';

interface BlocklistData {
    blockedUserIds?: number[];
}

interface ThreadListEvent {
    thread_list: Array<{
        author_id: number;
        [key: string]: any;
    }>;
}

export default function (eventName: string, eventData: any): any {
    const blockedUserIds = (blocklistData as BlocklistData).blockedUserIds || [];

    if (eventName === 'threadListUpdated') {
        const data = eventData as ThreadListEvent;
        data.thread_list = data.thread_list.filter(item => {
            return !blockedUserIds.includes(item.author_id);
        });
        return data;
    }

    return undefined;
}
