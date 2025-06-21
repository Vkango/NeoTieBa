<script setup>
import Container from '../components/Container.vue';
import RippleButton from '../components/RippleButton.vue';
import { defineEmits, onMounted, ref } from 'vue';
import { getUserList } from '../user-manage';
import Bar from '../components/Bar.vue';
const emit = defineEmits(['QRLogin'])
const user = ref({ user_name: '', avatar: '' });
onMounted(async () => {
  user.value = await getUserList();
})
</script>

<template>
  <Container class="page" @yscroll="onScroll">
    <div style="width: 80%; justify-self: center;">
      <h2>设置</h2>
      <div>调整设置内容</div>
      <h3>账号列表</h3>
      <div>轻按来切换用户，右键可进行更多操作。若登录信息失效，重新进行登录即可更新用户信息。</div>
      <RippleButton class="current-user" style="align-items: left; text-align: left;">
        <div v-for="item in user" style="display: flex; gap: 10px; margin: 10px 0;">
          <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
          <div class="desc">
            <div class="title" style="font-weight: bold;">{{ item.user_name }}</div>
            <div class="description">{{ item.current ? '当前账户' : '已登录' }}</div>
          </div>

        </div>
        <div v-if="user.length == 0">没有登录的账户。请点击添加。</div>
        <RippleButton @click="emit('QRLogin')">扫码登录</RippleButton>
      </RippleButton>
      <h3>通用</h3>
      <div>语言 (简体中文)</div>

      <h3>浏览</h3>
      <div>同时显示用户名与ID</div>
      <div>只看楼主</div>
      <div>无图模式</div>
      <h3>网络</h3>
      <div>使用代理</div>
      <div>连接测试</div>
      <h3>插件</h3>
      <Bar style="margin: 5px 0"></Bar>
      <div>共 0 个插件，已加载 0 个。</div>
      <div>自动签到工具</div>
      <div>屏蔽列表</div>
      <div>提醒喝水小助手</div>
      <h3>关于</h3>
      <div>NeoTieBa
        <br>版本号：-1
        <br>Tauri：2
        <br>Vue：3
        <br>作者：Lonyou
        <br>本软件仅供学习交流使用，出现的任何后果作者概不负责！
      </div>
    </div>
  </Container>
</template>

<style scoped>
.current-user {
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: rgba(var(--text-color), 0.1);
  gap: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}
</style>
