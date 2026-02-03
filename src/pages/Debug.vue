<script setup lang="ts">
import { inject, getCurrentInstance, ref, onMounted, type Component } from 'vue';
import Tip from '@/components/notification/Tip.vue';
import { open } from '@tauri-apps/plugin-dialog';

type NotificationHandler = (
  title: string,
  subtitle: string,
  component: Component,
  onClick: () => void,
  props: Record<string, unknown>,
  duration: number
) => void;

type ToastHandler = (message: string, duration: number) => void;

const sendNotification = inject<NotificationHandler>('sendNotification');
const sendToast = inject<ToastHandler>('sendToast');
const updateTabMeta = inject<(info: { key: unknown; title: string; icon: string }) => void>('updateTabMeta');
const instance = getCurrentInstance();

const emit = defineEmits<{
  (e: 'openLocalThread', path: string | null): void;
}>();
const props = defineProps({
  key_: {
    required: true
  },
});

onMounted(() => {
  updateTabMeta?.({ key: props.key_, title: "调试", icon: "/assets/bug.svg" });
});

const isDrawerOpen = instance?.appContext.config.globalProperties.$IsDrawerOpen as { state: boolean } | undefined;
const onClick = () => {
  console.log('点击了通知');
}
const notify = () => {
  sendNotification?.(
    '你有一条新回复',
    '<span class="material-symbols-outlined" style="font-size: 17px;">reply</span>消息',
    Tip,
    onClick,
    { Tip: '米线山🐉：你说什么？【米线山吧】' },
    60000
  )
};

const openFile = async () => {

  const file = await open({
    multiple: false,
    directory: true,
    // filters: [
    //   {
    //     name: 'tiezi-transfer',
    //     extensions: ['json'],
    //   },
    // ],
  });
  emit('openLocalThread', file);
}

const permissionInfo = ref([{
  name: '获取当前用户Cookies',
  status: 0,
  description: 'GetCurrentUserCookies',
  explain: '需要根据你的Cookies区分来源用户。',
}, {
  name: '发送通知',
  status: 0,
  description: 'SendNotification',
  explain: '展示处理结果',
}, {
  name: '获取当前用户名',
  status: 1,
  description: 'GetCurrentUserName',
}, {
  name: '获取当前用户信息',
  status: 2,
  description: 'GetCurrentUserProfile',
}, {
  name: '发送网络请求',
  status: 0,
  description: 'SendNetworkRequest',
  explain: '发送网络请求',
}])
</script>

<template>
  <Container>
    <div>调试工具</div>
    <button @click="notify">notify</button>
    <button @click="throw Error('跌我错了');">throw</button>
    <button @click="sendToast?.('更新收藏成功', 3000)">toast</button>
    <button @click="() => { if (isDrawerOpen) isDrawerOpen.state = true }">打开抽屉</button>
    <button @click="openFile()">打开文件</button>
  </Container>

  <Drawer ctitle="插件属性" width="450px" :top_position="false">
    <div id="drawer-content" style="padding: 0 15px;">
      <img src="/assets/delete.svg" width="45px" id="mod-icon">
      <div id="banner-text" style="display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 22px; font-weight: bold;">屏蔽列表</div>
          <div
            style="display: flex; gap: 10px; align-items: center; padding: 5px 10px; border-radius: 50px; background-color: rgba(0, 255, 0, 0.1);">
            <span class="material-symbols-outlined" style="font-size: 15px;">check_circle</span>
            <div style="font-weight: bold;">已启用</div>
          </div>
        </div>
        <div style="font-size: 15px; opacity: 0.5;">关键词屏蔽、用户名屏蔽，减少对看帖的打扰。</div>
      </div>
      <div id="details" style="display: flex; flex-direction: column; gap: 10px; margin-top: 30px;">
        <div id="detail-head" style="display: flex; flex-direction: column; gap: 5px;">
          <div style="font-weight: bold; font-size: 18px;">权限管理</div>
          <div style="font-size: 13px; opacity: 0.5;">轻按权限按钮以更改状态</div>
          <div style="font-size: 15px; font-weight: bold;">API</div>
          <div style="font-size: 13px; opacity: 0.5;">允许该插件获取的信息权限</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <RippleButton style="text-align: left; padding: 10px 13px; " v-for="item in permissionInfo">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
                  <div style="display: flex; gap: 10px; align-items: center; padding: 5px 10px; border-radius: 50px; "
                    :style="{ backgroundColor: item.status == 0 ? 'rgba(0, 255, 0, 0.1)' : item.status == 1 ? 'rgba(255, 120, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)' }">
                    <span class="material-symbols-outlined" style="font-size: 15px;">{{ item.status == 0 ?
                      'check_circle' : item.status == 1 ?
                        'account_box' : 'do_not_disturb_on' }}</span>
                    <div style="font-weight: bold; font-size: 15px;">{{ item.status == 0 ? '允许' : item.status == 1 ?
                      '空白返回' : '拒绝' }}
                    </div>
                  </div>
                  <div style="font-weight: bold; font-size: 15px;">{{ item.name }}<span
                      style="opacity: 0.5;">&nbsp;&nbsp;{{
                        item.description }}</span>
                  </div>
                </div>
                <div style="opacity: 0.5; font-size: 13px;" v-if="item.explain">插件声明：{{ item.explain }}</div>
                <div style="display: flex; align-items: center; gap: 10px; opacity: 0.5; color: red"
                  v-if="item.description == 'GetCurrentUserCookies'">
                  <span class="material-symbols-outlined" style="font-size: 18px">
                    error
                  </span>
                  <div>Cookies代表你的登录信息，请确保插件可信，否则会导致你的账号信息被盗用。</div>
                </div>
              </div>
            </RippleButton>
          </div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 10px;">Event</div>
          <div style="font-size: 13px; opacity: 0.5;">允许通知插件的事件权限</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <RippleButton style="text-align: left; padding: 10px 13px; ">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
                  <div
                    style="display: flex; gap: 10px; align-items: center; padding: 5px 10px; border-radius: 50px; background-color: rgba(0, 255, 0, 0.1);">
                    <span class="material-symbols-outlined" style="font-size: 15px;">check_circle</span>
                    <div style="font-weight: bold; font-size: 15px;">允许</div>
                  </div>
                  <div style="font-weight: bold; font-size: 15px;">OnContentLoading</div>
                </div>
                <div style="opacity: 0.5; font-size: 13px;">事件：块内容开始加载</div>
              </div>
            </RippleButton>
          </div>

        </div>
        <div style="font-weight: bold; font-size: 18px; margin-top: 10px;">操作</div>
        <RippleButton style="width: fit-content;">禁用插件</RippleButton>
        <RippleButton style="width: fit-content;">卸载插件</RippleButton>
        <RippleButton style="width: fit-content;">删除数据</RippleButton>
        <RippleButton style="width: fit-content;">重置插件</RippleButton>
        <RippleButton style="width: fit-content;">重启插件</RippleButton>
        <RippleButton style="width: fit-content;">打开管理页</RippleButton>
      </div>

    </div>
  </Drawer>
</template>
<style scoped></style>