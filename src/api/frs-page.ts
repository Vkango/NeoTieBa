import { callProtoEndpoint, createCommon, type ProtoCallOptions } from '@/core/proto-client';

const BAR_PAGE_CLIENT_VERSION = '12.64.1.1';
const DEFAULT_RN = 50;
const DEFAULT_SORT_TYPE = 6;

type AnyRecord = Record<string, any>;

export interface BrowseBarProtoOptions {
    rn?: number;
    sortType?: number;
    isGood?: boolean;
    bduss?: string;
    stoken?: string;
}

function stringValue(value: unknown, fallback = ''): string {
    if (value === null || value === undefined) {
        return fallback;
    }
    return String(value);
}

function numberValue(value: unknown, fallback = 0): number {
    const result = Number(value);
    return Number.isFinite(result) ? result : fallback;
}

function arrayValue<T = AnyRecord>(value: unknown): T[] {
    return Array.isArray(value) ? value as T[] : [];
}

function normalizeContentType(type: number): number {
    if (type === 20) {
        return 3;
    }
    if (type === 11) {
        return 2;
    }
    if ([9, 27, 35, 36, 37].includes(type)) {
        return 0;
    }
    return type;
}

function normalizeColor(raw: AnyRecord = {}): AnyRecord {
    return {
        ...raw,
        common_color: stringValue(raw.commonColor ?? raw.common_color),
        dark_color: stringValue(raw.darkColor ?? raw.dark_color),
        light_color: stringValue(raw.lightColor ?? raw.light_color),
        pattern_image: stringValue(raw.patternImage ?? raw.pattern_image),
        font_color: stringValue(raw.fontColor ?? raw.font_color),
    };
}

function normalizeThemeColor(raw: AnyRecord = {}): AnyRecord {
    return {
        ...raw,
        day: normalizeColor(raw.day),
        night: normalizeColor(raw.night),
        dark: normalizeColor(raw.dark),
    };
}

function normalizeForum(raw: AnyRecord = {}, fallbackName = ''): AnyRecord {
    const themeColor = normalizeThemeColor(raw.themeColor ?? raw.theme_color);

    return {
        ...raw,
        id: stringValue(raw.id),
        name: stringValue(raw.name, fallbackName),
        first_class: stringValue(raw.firstClass ?? raw.first_class),
        second_class: stringValue(raw.secondClass ?? raw.second_class),
        cur_score: numberValue(raw.curScore ?? raw.cur_score),
        level_id: numberValue(raw.levelId ?? raw.level_id),
        levelup_score: numberValue(raw.levelupScore ?? raw.levelup_score),
        level_name: stringValue(raw.levelName ?? raw.level_name),
        user_level: numberValue(raw.userLevel ?? raw.user_level),
        member_num: numberValue(raw.memberNum ?? raw.member_num),
        post_num: numberValue(raw.postNum ?? raw.post_num),
        thread_num: numberValue(raw.threadNum ?? raw.thread_num),
        managers: arrayValue(raw.managers).map((manager) => ({
            ...manager,
            id: stringValue(manager.id),
            name: stringValue(manager.name),
            show_name: stringValue(manager.showName ?? manager.show_name),
            portrait: stringValue(manager.portrait),
        })),
        avatar: stringValue(raw.avatar),
        slogan: stringValue(raw.slogan),
        theme_color: themeColor,
        themeColor,
        f_share_img: stringValue(raw.fShareImg ?? raw.f_share_img),
        forum_share_link: stringValue(raw.forumShareLink ?? raw.forum_share_link),
    };
}

function normalizeUser(raw: AnyRecord = {}): AnyRecord {
    return {
        ...raw,
        id: stringValue(raw.id ?? raw.uid ?? raw.userId),
        name: stringValue(raw.name ?? raw.userName ?? raw.user_name),
        name_show: stringValue(raw.nameShow ?? raw.name_show ?? raw.displayName ?? raw.name ?? raw.userName),
        portrait: stringValue(raw.portrait ?? raw.avatar),
        level_id: numberValue(raw.levelId ?? raw.level_id),
        ip_address: stringValue(raw.ipAddress ?? raw.ip_address),
    };
}

function normalizeContent(raw: AnyRecord = {}): AnyRecord {
    const type = normalizeContentType(numberValue(raw.type));
    const text = stringValue(raw.text ?? raw.c);
    const bigSrc = stringValue(raw.bigSrc ?? raw.big_src);
    const cdnSrc = stringValue(raw.cdnSrc ?? raw.cdn_src);
    const bigCdnSrc = stringValue(raw.bigCdnSrc ?? raw.big_cdn_src);
    const originSrc = stringValue(raw.originSrc ?? raw.origin_src);

    return {
        ...raw,
        type,
        text,
        c: stringValue(raw.c ?? text),
        link: stringValue(raw.link),
        src: stringValue(raw.src),
        bsize: stringValue(raw.bsize),
        bigSrc,
        big_src: bigSrc,
        cdnSrc,
        cdn_src: cdnSrc,
        bigCdnSrc,
        big_cdn_src: bigCdnSrc,
        originSrc,
        origin_src: originSrc,
        uid: stringValue(raw.uid),
        during_time: numberValue(raw.duringTime ?? raw.during_time),
        width: numberValue(raw.width),
        height: numberValue(raw.height),
        is_long_pic: numberValue(raw.isLongPic ?? raw.is_long_pic),
    };
}

function normalizeMedia(raw: AnyRecord = {}): AnyRecord {
    const bigPic = stringValue(raw.bigPic ?? raw.big_pic ?? raw.bigCdnSrc ?? raw.big_cdn_src);
    const originPic = stringValue(raw.originPic ?? raw.origin_pic ?? raw.originSrc ?? raw.origin_src);
    const smallPic = stringValue(raw.smallPic ?? raw.small_pic ?? raw.src ?? raw.cdnSrc ?? raw.cdn_src);

    return {
        ...raw,
        type: numberValue(raw.type),
        small_pic: smallPic,
        big_pic: bigPic || originPic || smallPic,
        water_pic: stringValue(raw.waterPic ?? raw.water_pic),
        vpic: stringValue(raw.vpic),
        vsrc: stringValue(raw.vsrc),
        vhsrc: stringValue(raw.vhsrc),
        src_pic: stringValue(raw.srcPic ?? raw.src_pic),
        origin_pic: originPic,
        dynamic_pic: stringValue(raw.dynamicPic ?? raw.dynamic_pic),
        width: numberValue(raw.width),
        height: numberValue(raw.height),
        bsize: stringValue(raw.bsize),
        origin_size: numberValue(raw.originSize ?? raw.origin_size),
        is_long_pic: numberValue(raw.isLongPic ?? raw.is_long_pic),
    };
}

function contentToMedia(content: AnyRecord): AnyRecord[] {
    if (content.type === 3 || content.type === 20) {
        const src = stringValue(
            content.bigCdnSrc
            ?? content.big_cdn_src
            ?? content.originSrc
            ?? content.origin_src
            ?? content.bigSrc
            ?? content.big_src
            ?? content.cdnSrc
            ?? content.cdn_src
            ?? content.src
        );

        return src ? [normalizeMedia({ type: 3, big_pic: src, origin_pic: src })] : [];
    }

    if (content.type === 5) {
        const vsrc = stringValue(content.link ?? content.src);
        const vpic = stringValue(content.src ?? content.bigCdnSrc ?? content.big_cdn_src);
        return vsrc || vpic ? [normalizeMedia({ type: 5, vsrc, vpic })] : [];
    }

    return [];
}

function normalizeThread(raw: AnyRecord = {}): AnyRecord {
    const author = raw.author ? normalizeUser(raw.author) : undefined;
    const firstPostContent = arrayValue(raw.firstPostContent ?? raw.first_post_content).map(normalizeContent);
    const richAbstract = arrayValue(raw.richAbstract ?? raw.rich_abstract).map(normalizeContent);
    const content = richAbstract.length > 0 ? richAbstract : firstPostContent;
    const media = arrayValue(raw.media).map(normalizeMedia);
    const fallbackMedia = content.flatMap(contentToMedia);

    return {
        ...raw,
        id: stringValue(raw.id ?? raw.tid),
        tid: stringValue(raw.tid ?? raw.id),
        title: stringValue(raw.title),
        reply_num: numberValue(raw.replyNum ?? raw.reply_num),
        view_num: numberValue(raw.viewNum ?? raw.view_num),
        last_time_int: numberValue(raw.lastTimeInt ?? raw.last_time_int ?? raw.createTime ?? raw.create_time),
        is_top: numberValue(raw.isTop ?? raw.is_top),
        is_good: numberValue(raw.isGood ?? raw.is_good),
        author_id: stringValue(raw.authorId ?? raw.author_id ?? author?.id),
        first_post_id: stringValue(raw.firstPostId ?? raw.first_post_id),
        post_id: stringValue(raw.postId ?? raw.post_id),
        media: media.length > 0 ? media : fallbackMedia,
        rich_abstract: content,
        first_post_content: firstPostContent,
        author,
    };
}

function normalizePage(raw: AnyRecord = {}): AnyRecord {
    const hasMore = numberValue(raw.hasMore ?? raw.has_more);

    return {
        ...raw,
        page_size: numberValue(raw.pageSize ?? raw.page_size),
        current_page: numberValue(raw.currentPage ?? raw.current_page),
        total_count: numberValue(raw.totalCount ?? raw.total_count),
        total_page: numberValue(raw.totalPage ?? raw.total_page),
        has_more: hasMore,
        has_prev: numberValue(raw.hasPrev ?? raw.has_prev),
    };
}

function normalizeNavTabInfo(raw: AnyRecord = {}): AnyRecord {
    return {
        ...raw,
        tab: arrayValue(raw.tab).map((tab) => ({
            ...tab,
            tab_id: numberValue(tab.tabId ?? tab.tab_id),
            tab_type: numberValue(tab.tabType ?? tab.tab_type),
            tab_name: stringValue(tab.tabName ?? tab.tab_name),
            tab_url: stringValue(tab.tabUrl ?? tab.tab_url),
        })),
    };
}

export function normalizeFrsPageResponse(response: AnyRecord, barName: string): AnyRecord {
    const data = response.data ?? {};
    const error = response.error ?? {};
    const errorCode = numberValue(error.errorno);

    return {
        error_code: errorCode,
        error_msg: stringValue(error.errmsg),
        forum: normalizeForum(data.forum, barName),
        page: normalizePage(data.page),
        thread_list: arrayValue(data.threadList ?? data.thread_list).map(normalizeThread),
        user_list: arrayValue(data.userList ?? data.user_list).map(normalizeUser),
        nav_tab_info: normalizeNavTabInfo(data.navTabInfo ?? data.nav_tab_info),
        forum_rule: data.forumRule ?? data.forum_rule ?? {},
        data,
        raw: response,
    };
}

export async function browse_bar_protobuf(
    barName: string,
    page = 1,
    options: ProtoCallOptions = {},
    browseOptions: BrowseBarProtoOptions = {}
): Promise<any> {
    const rn = browseOptions.rn ?? DEFAULT_RN;
    const sortType = browseOptions.sortType ?? DEFAULT_SORT_TYPE;
    const isGood = browseOptions.isGood ?? false;

    const requestData = {
        data: {
            common: createCommon(BAR_PAGE_CLIENT_VERSION, options),
            kw: barName,
            pn: page <= 1 ? 0 : page,
            rn,
            rnNeed: rn + 5,
            isGood: Number(isGood),
            sortType,
        },
    };

    const response = await callProtoEndpoint<typeof requestData, AnyRecord>('barPage', requestData, options);
    const error = response.error ?? {};
    const errorNo = numberValue(error.errorno);

    if (errorNo) {
        throw new Error(`Tieba server error: ${errorNo} - ${stringValue(error.errmsg)}`);
    }

    return normalizeFrsPageResponse(response, barName);
}
