<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import Container from '../components/Container.vue';
import { ApiLogin } from '../qr-login.js';
const qr_api = new ApiLogin();
onMounted(async () => {
    await qr_api.get_auth_cookie();
    console.log('get auth cookie done', qr_api.BAIDUID);
    login();
})
const desc = ref("正在等待扫描");
const tip = ref("使用百度贴吧扫一扫以登录")
const login_info = ref({
    user_name: '',
    avatar: '',
    finished: false
});
onBeforeUnmount(() => {
    qr_api.isCancelled = true; // Rust API will be cancelled
});
const login = async () => {
      if (qr_api.isScanning) return;
      qr_api.isScanning = true;
      let i = 0;
      qr_api.scanTimer = setInterval(async () => {
        i++;
        if (i === 120) {
          qr_api.isScanning = false;
          clearInterval(qr_api.scanTimer);
          qr_api.refreshQRCode();
          return;
        }
        try {
          const status = await qr_api.get_scan_status();
          console.log("login_status", status);
          desc.value = '正在等待扫描';
          if (status.includes('status\\":1')) {
            desc.value = '扫描成功！请在手机上确认！';
          }
          if (status.includes('"status\\":0,\\"v\\":')) {
            qr_api.isScanning = false;
            clearInterval(qr_api.scanTimer);
            const re = /"v\\":\\"(.*?)\\"/;
            qr_api.bdussd = re.exec(status)[1];
            const response = await qr_api.login_with_bduss();
            const reDisplayName = /displayName": "(.*?)"/;
            const rePortrait = /portraitUrl": "(.*?)"/;
            const displayName = reDisplayName.exec(response);
            const portrait = rePortrait.exec(response);
            login_info.value.user_name = displayName[1];
            login_info.value.avatar = portrait[1];
            login_info.value.finished = true;
            console.log(login_info.value);
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      }, 5000);
    }
</script>

<template>
    <Container class="qrcode-login">
        <div class="qr-content" v-if="!login_info.finished">
            <div class="qr-title">扫码登录喵</div>
            <div class="qr-desc">{{ desc }}</div>
            <div class="qrcode-login__content__qrcode">
                <img id="qrCodeImg" alt="二维码" />
            </div>
            <div class="tip">{{ tip }}</div>
        </div>
        <div class="login-success" v-if="login_info.finished">
            <img class="avatar" alt="avatar" :src="login_info.avatar" referrerpolicy="no-referrer"/>
            <div class="qr-title">{{ login_info.user_name }}</div>
            <div class="tip">登录成功<br>单击以添加到用户列表</div>
        </div>
    </Container>
</template>

<style scoped>
.avatar {
    width: 110px;
    height: 110px;
    border-radius: 110px;
}
.login-success {
    background-color: rgba(var(--text-color), 0.1);
    padding: 20px 25px;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.time {
    opacity: 0.5;
    font-size: 80%;
    text-align: center;
}
.tip {
    opacity: 0.5;
    text-align: center;
}
.qr-desc {
    font-size: 18px;
}
.qr-title {
    font-weight: bold;
    font-size: 30px;
    margin-bottom: 5px;
}
#qrCodeImg {
    padding: 10px;
    background-color: white;
    width: 225px;
    height: 225px;
}
.qr-content {
    background-color: rgba(var(--text-color), 0.1);
    padding: 20px 25px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
}
.qrcode-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>