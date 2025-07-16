import blocklistData from './blocklist.json';
// 同目录下请先新建blocklist.json，内容为：
// {
//     "blockedUserIds": [
//         1145141918,
//         1234567890
//     ]
// }
export default function (eventName, eventData) {
    const blockedUserIds = blocklistData.blockedUserIds || [];
    if (eventName === 'threadListUpdated') {
        eventData.thread_list = eventData.thread_list.filter(item => {
            if (blockedUserIds.includes(item.author_id)) {
                return false;
            }
            return true;
        });
        return eventData;
    }

    return undefined;
}