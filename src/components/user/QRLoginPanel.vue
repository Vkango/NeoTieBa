<template>
    <div class="qr-login-panel">
        <div class="qr-content" v-if="!loginInfo.finished">
            <RippleButton class="back-button" @click="$emit('back')">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span class="material-symbols-outlined">arrow_back</span>
                    <span>返回</span>
                </div>

            </RippleButton>
            <div class="qr-title">扫码登录</div>
            <div class="qr-desc">{{ scanStatus }}</div>
            <div class="qrcode-container">
                <img id="qrCodeImg" alt="二维码" />
            </div>
            <div class="tip">使用百度贴吧扫一扫以登录</div>
        </div>

        <div class="login-success-content" v-else>
            <div class="success-icon">
                <span class="material-symbols-outlined">check_circle</span>
            </div>
            <img class="user-avatar" alt="avatar" :src="loginInfo.avatar" referrerpolicy="no-referrer" />
            <div class="user-name">{{ loginInfo.user_name }}</div>
            <div class="success-tip">登录成功！</div>

            <div class="action-buttons">
                <RippleButton class="filter-button" @click="$emit('back')">
                    返回
                </RippleButton>
                <RippleButton class="filter-button" @click="handleFinishLogin">
                    添加账号
                </RippleButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ApiLogin } from '@/api/qr-login';

const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['back', 'success']);

const qr_api = new ApiLogin();
const scanStatus = ref("正在等待扫描");
const loginInfo = ref({
    user_name: '',
    avatar: '',
    finished: false,
    bduss: '',
    stoken: ''
});

const cleanup = () => {
    if (qr_api.scanTimer) {
        clearInterval(qr_api.scanTimer);
        qr_api.scanTimer = null;
    }
    qr_api.isCancelled = true;
    qr_api.isScanning = false;
};

const startLogin = async () => {
    if (qr_api.isScanning) return;

    loginInfo.value = {
        user_name: '',
        avatar: '',
        finished: false,
        bduss: '',
        stoken: ''
    };
    scanStatus.value = "正在等待扫描";

    await qr_api.get_auth_cookie();

    qr_api.isScanning = true;
    let i = 0;

    qr_api.scanTimer = setInterval(async () => {
        i++;
        if (i === 120) {
            qr_api.isScanning = false;
            if (qr_api.scanTimer !== null) {
                clearInterval(qr_api.scanTimer);
            }
            scanStatus.value = '二维码已过期，正在刷新...';
            await qr_api.refreshQRCode();
            i = 0;
            qr_api.isScanning = true;
            return;
        }

        try {
            const status = await qr_api.get_scan_status();
            if (!status) return;

            scanStatus.value = '正在等待扫描';

            if (status.includes('status\\":1')) {
                scanStatus.value = '扫描成功！请在手机上确认！';
            }

            if (status.includes('"status\\":0,\\"v\\":')) {
                qr_api.isScanning = false;
                if (qr_api.scanTimer !== null) {
                    clearInterval(qr_api.scanTimer);
                }

                const re = /"v\\":\\"(.*?)\\"/;
                const bdussdMatch = re.exec(status);
                if (!bdussdMatch) return;

                qr_api.bdussd = bdussdMatch[1];
                const response = await qr_api.login_with_bduss();
                if (!response) return;

                const reDisplayName = /displayName": "(.*?)"/;
                const rePortrait = /portraitUrl": "(.*?)"/;
                const bduss = /bduss": "(.*?)"/;
                const stoken = /stoken": "(.*?)"/;

                const displayName = reDisplayName.exec(response);
                const portrait = rePortrait.exec(response);
                const bdussMatch = bduss.exec(response);
                const stokenMatch = stoken.exec(response);

                if (displayName && portrait && bdussMatch && stokenMatch) {
                    loginInfo.value.user_name = displayName[1];
                    loginInfo.value.avatar = portrait[1];
                    loginInfo.value.finished = true;
                    loginInfo.value.bduss = bdussMatch[1];
                    loginInfo.value.stoken = stokenMatch[1];
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            scanStatus.value = '扫描出错，请重试';
        }
    }, 5000);
};

const handleFinishLogin = () => {
    cleanup();
    emit('success', {
        user_name: loginInfo.value.user_name,
        avatar: loginInfo.value.avatar,
        bduss: loginInfo.value.bduss,
        stoken: loginInfo.value.stoken
    });
};

// 监听 active 状态
watch(() => props.active, async (newVal) => {
    if (newVal) {
        await startLogin();
    } else {
        cleanup();
    }
});

onMounted(async () => {
    if (props.active) {
        await startLogin();
    }
});

onBeforeUnmount(() => {
    cleanup();
});

defineExpose({
    cleanup,
    startLogin
});
</script>

<style scoped>
.qr-login-panel {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.qr-content {
    background-color: rgba(var(--text-color), 0.05);
    padding: 30px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    text-align: center;
    position: relative;
    max-width: 400px;
    width: 100%;
}

.back-button {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: transparent;
    color: rgb(var(--text-color));
    font-size: 14px;
    font-weight: 500;
    box-shadow: none;
}

.back-button .material-symbols-outlined {
    font-size: 18px;
}

.qr-title {
    font-weight: bold;
    font-size: 28px;
    margin-top: 20px;
    color: rgb(var(--text-color));
}

.qr-desc {
    font-size: 16px;
    color: rgba(var(--text-color), 0.8);
    margin-bottom: 10px;
}

.qrcode-container {
    display: flex;
    justify-content: center;
    margin: 10px 0;
}

#qrCodeImg {
    padding: 10px;
    background-color: white;
    width: 225px;
    height: 225px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tip {
    font-size: 14px;
    color: rgba(var(--text-color), 0.5);
    text-align: center;
}

/* 登录成功样式 */
.login-success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
    max-width: 400px;
    width: 100%;
}

.success-icon {
    animation: scaleIn 0.4s ease;
}

.success-icon .material-symbols-outlined {
    font-size: 64px;
    color: rgb(255, 255, 255);
}

@keyframes scaleIn {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(var(--text-color), 0.1);
}

.user-name {
    font-size: 24px;
    font-weight: bold;
    color: rgb(var(--text-color));
}

.success-tip {
    font-size: 16px;
    color: rgba(var(--text-color), 0.6);
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    width: 100%;
}

.action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    border-radius: 10px;
    font-weight: 500;
    transition: all 0.2s;
}

.action-btn.primary {
    background-color: rgb(36, 200, 219);
    color: white;
}

.action-btn.secondary {
    background-color: rgba(var(--text-color), 0.1);
    color: rgb(var(--text-color));
}
</style>
