<template>
    <Transition name="modal" appear>
        <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
            <Transition name="card" appear>
                <div v-if="visible" class="bar-card" @click.stop>
                    <RippleButton class="close-button" @click="$emit('close')">
                        <img src="/assets/close.svg" />
                    </RippleButton>

                    <!-- Tabs -->
                    <div class="tabs-container">
                        <RippleButton class="tab" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">
                            信息
                        </RippleButton>
                        <RippleButton class="tab" :class="{ active: activeTab === 'my' }" @click="activeTab = 'my'">
                            我在本吧
                        </RippleButton>
                        <RippleButton class="tab" :class="{ active: activeTab === 'rule' }" @click="activeTab = 'rule'">
                            吧规
                        </RippleButton>
                        <RippleButton class="tab" :class="{ active: activeTab === 'bawu' }" @click="activeTab = 'bawu'">
                            吧务团队
                        </RippleButton>
                    </div>

                    <!-- Content Area -->
                    <Transition name="fade1">
                        <div class="content-area" v-if="!isLoading">
                            <!-- 吧信息 Tab -->
                            <div v-if="activeTab === 'info'" class="tab-content">
                                <div class="bar-header-section">
                                    <div class="bar-avatar-wrapper">
                                        <img :src="barInfo.avatar" :alt="barInfo.name" class="bar-avatar"
                                            referrerpolicy="no-referrer" />
                                    </div>
                                    <div class="bar-main-info">
                                        <h2 class="bar-name">{{ barInfo.name }}吧</h2>
                                        <div class="bar-slogan">{{ barInfo.slogan }}</div>
                                        <div class="bar-category">{{ barInfo.category }}</div>
                                    </div>
                                </div>

                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <div class="stat-label">吧ID</div>
                                        <div class="stat-value">{{ barInfo.id }}</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-label">关注数</div>
                                        <div class="stat-value">{{ formatNumber(barInfo.member_num) }}</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-label">帖子数</div>
                                        <div class="stat-value">{{ formatNumber(barInfo.post_num) }}</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-label">主题帖数</div>
                                        <div class="stat-value">{{ formatNumber(barInfo.thread_num) }}</div>
                                    </div>
                                </div>

                                <div v-if="barInfo.description" class="bar-description">
                                    <h3>简介</h3>
                                    <p>{{ barInfo.description }}</p>
                                </div>

                            </div>

                            <!-- 我在本吧 Tab -->
                            <div v-if="activeTab === 'my'" class="tab-content">
                                <div v-if="!isLoggedIn" class="not-logged-in">
                                    <p>请先登录以查看你在本吧的信息</p>
                                </div>
                                <!--<div v-else-if="isLoading" class="loading-state">
                                <p>加载中...</p>
                            </div>-->
                                <div v-else class="my-info-section">
                                    <div class="follow-status">
                                        <div class="status-text">
                                            {{ userInfo.is_like ? `你已关注 ${barInfo.name}吧` : `你还未关注 ${barInfo.name}吧` }}
                                        </div>
                                        <button class="action-btn" @click="handleToggleFollow">
                                            {{ userInfo.is_like ? '取消关注' : '关注' }}
                                        </button>
                                    </div>

                                    <div class="level-section">
                                        <div class="level-info">
                                            <div class="level-badge">
                                                <span class="level-number">Lv.{{ userInfo.level_id }}</span>
                                            </div>
                                            <div class="level-details">
                                                <div class="level-name">{{ userInfo.level_name }}</div>
                                                <div class="exp-bar">
                                                    <div class="exp-progress" :style="{ width: expPercentage + '%' }">
                                                    </div>
                                                </div>
                                                <div class="exp-text">
                                                    {{ userInfo.cur_score }} / {{ userInfo.levelup_score }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="sign-section">
                                        <button class="sign-btn" :disabled="userInfo.is_sign_in" @click="handleSignIn">
                                            {{ userInfo.is_sign_in ? '今日已签到' : '签到' }}
                                        </button>
                                        <div class="sign-stats">
                                            <div class="sign-stat">
                                                <span class="sign-label">累计签到</span>
                                                <span class="sign-value">{{ userInfo.sign_in_count }}天</span>
                                            </div>
                                            <div class="sign-stat">
                                                <span class="sign-label">连续签到</span>
                                                <span class="sign-value">{{ userInfo.cont_sign_num }}天</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="activity-stats">
                                        <div class="activity-item">
                                            <span class="activity-label">关注天数</span>
                                            <span class="activity-value">{{ userInfo.follow_days }}天</span>
                                        </div>
                                        <div class="activity-item">
                                            <span class="activity-label">总发帖数</span>
                                            <span class="activity-value">{{ userInfo.thread_num }}</span>
                                        </div>
                                        <div class="activity-item">
                                            <span class="activity-label">今日发帖</span>
                                            <span class="activity-value">{{ userInfo.day_post_num }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 吧规 Tab -->
                            <div v-if="activeTab === 'rule'" class="tab-content">
                                <div v-if="barRule.title" class="rule-content">
                                    <h2 class="rule-title">{{ barRule.title }}</h2>
                                    <div v-if="barRule.preface" class="rule-preface">
                                        <h3>前言</h3>
                                        <p>{{ barRule.preface }}</p>
                                    </div>
                                    <div v-for="(rule, index) in barRule.rules" :key="index" class="rule-section">
                                        <h3>{{ rule.title }}</h3>
                                        <div v-for="(item, idx) in rule.content" :key="idx" class="rule-item">
                                            <p v-if="item.type === '0'">{{ item.text }}</p>
                                            <a v-else-if="item.type === '1'" :href="item.link" target="_blank">{{
                                                item.text
                                                }}</a>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="no-rule">
                                    <p>本吧暂无吧规, 请遵守贴吧社区规范</p>
                                </div>
                            </div>

                            <div v-if="activeTab === 'bawu'" class="tab-content">
                                <div v-if="bawuList.length > 0" class="bawu-list">
                                    <div v-for="group in groupedBawu" :key="group.type" class="bawu-group">
                                        <h3 class="bawu-type">{{ group.type }}</h3>
                                        <div class="bawu-members">
                                            <div v-for="bawu in group.members" :key="bawu.id" class="bawu-item">
                                                <img :src="bawu.portrait" :alt="bawu.name" class="bawu-avatar" />
                                                <div class="bawu-info">
                                                    <div class="bawu-name">{{ bawu.name }}</div>
                                                    <div class="bawu-level">Lv.{{ bawu.level }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="no-bawu">
                                    <p>暂无吧务信息</p>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <transition name="fade1">
                        <Loading class="loading-box" v-if="isLoading"></Loading>
                    </transition>
                </div>
            </Transition>
        </div>

    </Transition>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import RippleButton from './RippleButton.vue'
import { tieBaAPI } from '../tieba-api.js'
import { get_current_user } from '../user-manage.js'
import Loading from './Loading.vue'
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    forumData: {
        type: Object,
        required: true,
        default: () => ({
            id: '',
            name: '',
            avatar: '',
            slogan: '',
            member_num: 0,
            post_num: 0,
            thread_num: 0,
            first_class: '',
            second_class: ''
        })
    }
})

const emit = defineEmits(['close'])

const activeTab = ref('info')
const isLoading = ref(false)
const isLoggedIn = ref(false)
const n = new tieBaAPI()

// 数据状态
const barInfo = ref({
    id: '',
    name: '',
    avatar: '',
    slogan: '',
    description: '',
    category: '',
    member_num: 0,
    post_num: 0,
    thread_num: 0,
    background: ''
})

const userInfo = ref({
    is_like: false,
    level_id: 0,
    level_name: '',
    cur_score: 0,
    levelup_score: 1,
    is_sign_in: false,
    sign_in_count: 0,
    cont_sign_num: 0,
    follow_days: 0,
    thread_num: 0,
    day_post_num: 0
})

const barRule = ref({
    title: '',
    preface: '',
    rules: []
})

const bawuList = ref([])

const expPercentage = computed(() => {
    if (userInfo.value.levelup_score === 0) return 0
    return (userInfo.value.cur_score / userInfo.value.levelup_score) * 100
})

const groupedBawu = computed(() => {
    const groups = {}
    bawuList.value.forEach(bawu => {
        if (!groups[bawu.type]) {
            groups[bawu.type] = {
                type: bawu.type,
                members: []
            }
        }
        groups[bawu.type].members.push(bawu)
    })
    return Object.values(groups)
})

const formatNumber = (num) => {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '亿'
    } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万'
    }
    return num.toString()
}

const handleOverlayClick = () => {
    emit('close')
}

// 加载数据
const loadData = async () => {
    if (!props.forumData.id) return

    isLoading.value = true

    try {
        const forumId = props.forumData.id
        let bduss = ''
        let stoken = ''

        // 尝试获取当前登录用户
        try {
            const user = await get_current_user()
            bduss = user.bduss
            stoken = user.stoken
            isLoggedIn.value = true
        } catch (error) {
            console.log('用户未登录:', error.message)
            isLoggedIn.value = false
        }

        // 获取吧扩展信息
        const forumDetail = await n.getForumDetail(forumId, bduss, stoken)

        if (forumDetail.error_code === '0' && forumDetail.forum_info) {
            const info = forumDetail.forum_info
            console.log('info', info);

            // 填充吧信息
            barInfo.value = {
                id: forumId,
                name: props.forumData.name,
                avatar: info.avatar_origin || props.forumData.avatar,
                slogan: info.slogan || props.forumData.slogan,
                description: info.content?.[0]?.text || '',
                category: `${props.forumData.first_class || ''} - ${props.forumData.second_class || ''}`,
                member_num: props.forumData.member_num,
                post_num: props.forumData.post_num,
                thread_num: props.forumData.thread_num,
                background: props.forumData.avatar || ''
            }

            // 如果用户已登录，获取用户在本吧的信息
            if (bduss) {
                // 获取签到信息
                const signInfo = await n.getUserSign(forumId, bduss, stoken)
                console.log("dd", signInfo);
                if (signInfo.error_code == 0 && signInfo.data?.forum?.[0]) {
                    const userSignInfo = signInfo.data.forum[0].sign_in_info.user_info

                    // 获取用户等级信息
                    const levelInfo = await n.getUserForumLevelInfo(forumId, bduss, stoken)
                    console.log("cc", levelInfo);
                    if (levelInfo.error_code === 0 && levelInfo.data) {
                        const userForumInfo = levelInfo.data.user_forum_info
                        console.log('userForumInfo', userForumInfo);
                        userInfo.value = {
                            is_like: Boolean(parseInt(userForumInfo.is_follow)),
                            level_id: parseInt(userForumInfo.level_id),
                            level_name: userForumInfo.level_name || '',
                            cur_score: parseInt(userForumInfo.cur_score),
                            levelup_score: parseInt(userForumInfo.levelup_score),
                            is_sign_in: Boolean(userSignInfo.is_sign_in),
                            sign_in_count: parseInt(userSignInfo.cout_total_sign_num),
                            cont_sign_num: parseInt(userSignInfo.cont_sign_num),
                            follow_days: parseInt(userForumInfo.follow_days),
                            thread_num: parseInt(userForumInfo.thread_num),
                            day_post_num: parseInt(userForumInfo.day_post_num)
                        }
                    }
                }
            }
        }

        // 获取吧规
        const ruleData = await n.getForumRule(forumId, bduss, stoken)
        if (ruleData.error_code === '0' && ruleData.forum_rule_id) {
            barRule.value = {
                title: ruleData.title || '',
                preface: ruleData.preface || '',
                rules: [
                    ...(ruleData.rules || []),
                    ...(ruleData.default_rules || []),
                    ...(ruleData.new_rules || [])
                ].map(rule => ({
                    title: rule.title,
                    content: rule.content_list?.flatMap(item => item.content || []) || rule.content || []
                }))
            }
        }

        // 获取吧务信息
        const bawuInfo = await n.getBawuInfo(forumId)

        if (bawuInfo.error_code === '0') {
            console.log(bawuInfo);
            const bawuTypes = {
                'admin': '大吧主',
                'manager': '小吧主',
                'assist': '吧务助理'
            }

            const tempBawuList = []
            for (const [key, typeName] of Object.entries(bawuTypes)) {
                const members = bawuInfo[key] || []
                members.forEach(member => {
                    tempBawuList.push({
                        id: member.id,
                        name: member.name_show || member.name,
                        portrait: `https://tb.himg.baidu.com/sys/portrait/item/${member.portrait}`,
                        level: member.level_id || 0,
                        type: typeName
                    })
                })
            }

            bawuList.value = tempBawuList
        }

    } catch (error) {
        console.error('加载吧详情失败:', error)
    } finally {
        isLoading.value = false
    }
}

const handleToggleFollow = async () => {

}

const handleSignIn = async () => {

}

watch(() => props.visible, (newVal) => {
    if (newVal) {
        loadData()
    }
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    backdrop-filter: blur(0);
}

.bar-card {
    background: rgba(var(--background-color), 1);
    border: 1px solid rgba(var(--text-color), 0.1);
    border-radius: 12px;
    box-shadow:
        0 24px 48px rgba(0, 0, 0, 0.3),
        0 8px 24px rgba(0, 0, 0, 0.15);
    height: 80vh;
    width: 70vw;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.card-enter-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.card-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}

.card-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}

.close-button {
    position: absolute;
    top: 0px;
    right: 0px;
    background: rgba(var(--text-color), 0.0);
    box-shadow: none;
    padding: 0;
    margin: 0;
    border: none;
    padding-top: 5px;
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
    border-radius: 0;
}

.close-button:hover {
    background: rgba(var(--text-color), 0.1);
}

.close-button img {
    width: 20px;
    height: 20px;
    opacity: 0.7;
}

/* Tabs */
.tabs-container {
    display: flex;
    gap: 0;
    padding: 0 10px;
    border-bottom: 1px solid rgba(var(--text-color), 0.1);
    background: rgba(var(--text-color), 0.02);
}

.tab {
    padding: 12px 24px;
    cursor: pointer;
    color: rgba(var(--text-color), 0.6);
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
    position: relative;
    background-color: transparent;
    box-shadow: none;
    border-radius: 0;
}

.tab:hover {
    color: rgb(var(--text-color));
    background: rgba(var(--text-color), 0.03);
}

.tab.active {
    color: rgb(var(--primary-color));
    border-bottom-color: rgb(var(--primary-color));
}

/* Content Area */
.content-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
}

.tab-content {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 吧信息 Tab */
.bar-header-section {
    display: flex;
    gap: 20px;
    align-items: start;
    margin-bottom: 24px;
}

.bar-avatar-wrapper {
    flex-shrink: 0;
}

.bar-avatar {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid rgba(var(--text-color), 0.1);
}

.bar-main-info {
    flex: 1;
}

.bar-name {
    font-size: 24px;
    font-weight: bold;
    color: rgb(var(--text-color));
    margin: 0 0 8px 0;
}

.bar-slogan {
    font-size: 14px;
    color: rgba(var(--text-color), 0.7);
    margin-bottom: 6px;
}

.bar-category {
    font-size: 12px;
    color: rgba(var(--text-color), 0.5);
    padding: 4px 8px;
    background: rgba(var(--text-color), 0.05);
    border-radius: 4px;
    display: inline-block;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.stat-item {
    background: rgba(var(--text-color), 0.03);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid rgba(var(--text-color), 0.08);
}

.stat-label {
    font-size: 12px;
    color: rgba(var(--text-color), 0.6);
    margin-bottom: 4px;
}

.stat-value {
    font-size: 20px;
    font-weight: bold;
    color: rgb(var(--text-color));
}

.bar-description,
.bar-background {
    margin-bottom: 24px;
}

.bar-description h3,
.bar-background h3 {
    font-size: 16px;
    font-weight: 600;
    color: rgb(var(--text-color));
    margin: 0 0 12px 0;
}

.bar-description p {
    font-size: 14px;
    color: rgba(var(--text-color), 0.7);
    line-height: 1.6;
}

.background-img {
    width: 100%;
    border-radius: 8px;
    max-height: 300px;
    object-fit: cover;
}

/* 我在本吧 Tab */
.not-logged-in {
    text-align: center;
    padding: 60px 20px;
    color: rgba(var(--text-color), 0.5);
}

.my-info-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.follow-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: rgba(var(--primary-color), 0.05);
    border-radius: 8px;
    border: 1px solid rgba(var(--primary-color), 0.1);
}

.status-text {
    font-size: 14px;
    color: rgb(var(--text-color));
}

.action-btn {
    padding: 8px 20px;
    background: rgb(var(--primary-color));
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.level-section {
    background: rgba(var(--text-color), 0.03);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid rgba(var(--text-color), 0.08);
}

.level-info {
    display: flex;
    gap: 16px;
    align-items: center;
}

.level-badge {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, rgb(var(--primary-color)), rgba(var(--primary-color), 0.7));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.level-number {
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.level-details {
    flex: 1;
}

.level-name {
    font-size: 16px;
    font-weight: 600;
    color: rgb(var(--text-color));
    margin-bottom: 8px;
}

.exp-bar {
    height: 8px;
    background: rgba(var(--text-color), 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4px;
}

.exp-progress {
    height: 100%;
    background: linear-gradient(90deg, rgb(var(--primary-color)), rgba(var(--primary-color), 0.7));
    transition: width 0.3s ease;
}

.exp-text {
    font-size: 12px;
    color: rgba(var(--text-color), 0.6);
}

.sign-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sign-btn {
    padding: 12px;
    background: linear-gradient(135deg, rgb(var(--primary-color)), rgba(var(--primary-color), 0.8));
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.sign-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--primary-color), 0.3);
}

.sign-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.sign-stats {
    display: flex;
    gap: 24px;
    padding: 12px 16px;
    background: rgba(var(--text-color), 0.03);
    border-radius: 6px;
}

.sign-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.sign-label {
    font-size: 12px;
    color: rgba(var(--text-color), 0.6);
}

.sign-value {
    font-size: 18px;
    font-weight: bold;
    color: rgb(var(--text-color));
}

.activity-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.activity-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    background: rgba(var(--text-color), 0.03);
    border-radius: 8px;
    text-align: center;
}

.activity-label {
    font-size: 12px;
    color: rgba(var(--text-color), 0.6);
}

.activity-value {
    font-size: 20px;
    font-weight: bold;
    color: rgb(var(--text-color));
}

/* 吧规 Tab */
.rule-content {
    max-width: 800px;
}

.rule-title {
    font-size: 22px;
    font-weight: bold;
    color: rgb(var(--text-color));
    margin: 0 0 16px 0;
}

.rule-preface {
    margin-bottom: 24px;
}

.rule-preface h3 {
    font-size: 16px;
    font-weight: 600;
    color: rgb(var(--text-color));
    margin: 0 0 8px 0;
}

.rule-preface p {
    font-size: 14px;
    color: rgba(var(--text-color), 0.7);
    line-height: 1.6;
}

.rule-section {
    margin-bottom: 24px;
    padding: 16px;
    background: rgba(var(--text-color), 0.02);
    border-radius: 8px;
    border-left: 3px solid rgb(var(--primary-color));
}

.rule-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: rgb(var(--text-color));
    margin: 0 0 12px 0;
}

.rule-item {
    margin-bottom: 8px;
}

.rule-item p {
    font-size: 14px;
    color: rgba(var(--text-color), 0.7);
    line-height: 1.6;
    margin: 0;
}

.rule-item a {
    color: rgb(var(--primary-color));
    text-decoration: none;
}

.rule-item a:hover {
    text-decoration: underline;
}

.no-rule {
    text-align: center;
    padding: 60px 20px;
    color: rgba(var(--text-color), 0.5);
}

/* 吧务 Tab */
.bawu-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.bawu-group {
    background: rgba(var(--text-color), 0.02);
    padding: 16px;
    border-radius: 8px;
}

.bawu-type {
    font-size: 16px;
    font-weight: 600;
    color: rgb(var(--text-color));
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(var(--text-color), 0.1);
}

.bawu-members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
}

.bawu-item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px;
    background: rgba(var(--text-color), 0.03);
    border-radius: 8px;
    transition: all 0.2s ease;
}

.bawu-item:hover {
    background: rgba(var(--text-color), 0.05);
    transform: translateX(4px);
}

.bawu-avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
}

.bawu-info {
    flex: 1;
}

.bawu-name {
    font-size: 14px;
    font-weight: 500;
    color: rgb(var(--text-color));
}

.bawu-level {
    font-size: 12px;
    color: rgba(var(--text-color), 0.6);
}

.no-bawu {
    text-align: center;
    padding: 60px 20px;
    color: rgba(var(--text-color), 0.5);
}

@media (max-width: 768px) {
    .bar-card {
        width: 95vw;
        height: 90vh;
    }

    .content-area {
        padding: 16px;
    }

    .bar-header-section {
        flex-direction: column;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .activity-stats {
        grid-template-columns: 1fr;
    }

    .bawu-members {
        grid-template-columns: 1fr;
    }
}
</style>
