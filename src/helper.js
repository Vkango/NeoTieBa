export function getTimeInterval(previousTimestamp) {
    const currentTimestamp = Date.now(); // 获取当前时间戳（单位为毫秒）
    // 计算两个时间戳之间的差值（单位为秒）
    const diffInSeconds = (currentTimestamp - previousTimestamp) / 1000;
    console.log(diffInSeconds)
    if (diffInSeconds < 60) {
        // 不足1分钟
        return "刚刚";
    } else if (diffInSeconds < 60 * 60) {
        // 不足1小时
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}分钟前`;
    } else if (diffInSeconds < 60 * 60 * 24) {
        // 不足1天
        const hours = Math.floor(diffInSeconds / (60 * 60));
        return `${hours}小时前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 7) {
        // 不足1周
        const days = Math.floor(diffInSeconds / (60 * 60 * 24));
        return `${days}天前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 30) {
        // 不足1月（这里假设1月为30天）
        const weeks = Math.floor(diffInSeconds / (60 * 60 * 24 * 7));
        return `${weeks}周前`;
    } else if (diffInSeconds < 60 * 60 * 24 * 365) {
        // 不足1年（这里假设1年为365天）
        const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
        return `${months}个月前`;
    } else {
        // 超过1年
        const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));
        return `${years}年前`;
    }
}