<script setup>
import Container from '../components/Container.vue';
import RippleButton from '../components/RippleButton.vue';
import { defineEmits } from 'vue';
const emit = defineEmits(['QRLogin'])
</script>

<template>
  <Container class="page" @yscroll="onScroll">
    <div style="width: 80%; justify-self: center;">
      <h2>设置</h2>
      <div>调整设置内容</div>
      <h3>账户列表</h3>
      <div class="current-user">
        <div style="opacity: 0.5;">当前账户</div>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
          <img class="avatar" :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/'"
            referrerpolicy="no-referrer">
          <div class="desc">
            <div class="title" style="font-weight: bold;">用户名</div>
            <div class="description">用户描述</div>
          </div>

        </div>
        <RippleButton @click="emit('QRLogin')">账号管理</RippleButton>
        <RippleButton>查看主页</RippleButton>
      </div>
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
</style>
