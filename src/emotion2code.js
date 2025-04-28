const emoticonMap = {
    "呵呵": "image_emoticon1",
    "哈哈": "image_emoticon2",
    "吐舌": "image_emoticon3",
    "啊": "image_emoticon4",
    "酷": "image_emoticon5",
    "怒": "image_emoticon6",
    "开心": "image_emoticon7",
    "汗": "image_emoticon8",
    "泪": "image_emoticon9",
    "黑线": "image_emoticon10",
    "鄙视": "image_emoticon11",
    "不高兴": "image_emoticon12",
    "真棒": "image_emoticon13",
    "钱": "image_emoticon14",
    "疑问": "image_emoticon15",
    "阴险": "image_emoticon16",
    "吐": "image_emoticon17",
    "咦": "image_emoticon18",
    "委屈": "image_emoticon19",
    "花心": "image_emoticon20",
    "呼~": "image_emoticon21",
    "笑眼": "image_emoticon22",
    "冷": "image_emoticon23",
    "太开心": "image_emoticon24",
    "滑稽": "image_emoticon25",
    "勉强": "image_emoticon26",
    "狂汗": "image_emoticon27",
    "乖": "image_emoticon28",
    "睡觉": "image_emoticon29",
    "惊哭": "image_emoticon30",
    "生气": "image_emoticon31",
    "惊讶": "image_emoticon32",
    "喷": "image_emoticon33",
    "爱心": "image_emoticon34",
    "心碎": "image_emoticon35",
    "玫瑰": "image_emoticon36",
    "礼物": "image_emoticon37",
    "彩虹": "image_emoticon38",
    "星星月亮": "image_emoticon39",
    "太阳": "image_emoticon40",
    "钱币": "image_emoticon41",
    "灯泡": "image_emoticon42",
    "茶杯": "image_emoticon43",
    "蛋糕": "image_emoticon44",
    "音乐": "image_emoticon45",
    "haha": "image_emoticon46",
    "胜利": "image_emoticon47",
    "大拇指": "image_emoticon48",
    "弱": "image_emoticon49",
    "OK": "image_emoticon50",
    "沙发": "image_emoticon77",
    "手纸": "image_emoticon78",
    "香蕉": "image_emoticon79",
    "便便": "image_emoticon80",
    "药丸": "image_emoticon81",
    "红领巾": "image_emoticon82",
    "蜡烛": "image_emoticon83",
    "三道杠": "image_emoticon84"
};

export function convertEmoticonToCode(emoticonName) {
    return emoticonMap[emoticonName] || "unknown_emoticon";
}

export function replaceEmoticonsWithImages(htmlString) {
    const emoticonRegex = /(\[|\()(.*?)(\]|\))/g;
    return htmlString.replace(emoticonRegex, (match, bracket, emoticonName) => {
        const emoticonCode = emoticonMap[emoticonName];
        if (emoticonCode) {
            return `<img class="emotion" src="/assets/emotion/${emoticonCode}.png" alt="${emoticonName}" />`;
        }
        return match;
    });
}