<script setup>
import Container from '../components/Container.vue';
import RippleButton from '../components/RippleButton.vue';
import { defineEmits, onMounted, ref } from 'vue';
import { getUserList } from '../user-manage';
import Bar from '../components/Bar.vue';
import Item from '../components/Item.vue';
const emit = defineEmits(['QRLogin'])
const user = ref({ user_name: '', avatar: '' });
onMounted(async () => {
  user.value = await getUserList();
})
const currentPage = ref(0);
const generalSettingItems = ref([{
  title: '显示',
  icon: '/assets/personalize.svg',
  id: 0,
},
{
  title: '网络',
  icon: '/assets/network_check.svg',
  id: 1,
}, {
  title: '关于',
  icon: '/assets/info.svg',
  id: 2,
}]);
const pluginSettings = ref([{
  title: '插件管理',
  icon: '/assets/plugin.svg',
  id: 3,
}, {
  title: '自动签到',
  icon: '/assets/plugin.svg',
  id: 4,
}, {
  title: '屏蔽列表',
  icon: '/assets/plugin.svg',
  id: 5,
}, {
  title: '喝水小助手',
  icon: '/assets/plugin.svg',
  id: 6,
}]);
const currentSettingItems = ref([{ title: 'NeoTieBa', icon: 'rocket', desc: 'InDev 2025', id: 7 }, { title: '更新历史', icon: 'history', desc: '查看拉了什么史' }, { title: '联系', icon: 'hub', desc: '查看项目地址 (GitHub)' }, { title: '作者', icon: 'person', desc: 'Vkango' }, { title: '警告', icon: 'warning', desc: '仅供学习交流使用，出现的任何后果作者概不负责。' }, { title: '检查更新', icon: 'update', desc: '不知道有没有更新 (因为没服务器' }]);
</script>

<template>
  <Container class="page" @yscroll="onScroll">
    <div style="width: 80%; justify-self: center; padding-top: 20px;">

      <div style="display: flex; gap: 15px; margin-top: 10px;">

        <div style="display: flex; flex-direction: column; width: 25%; min-width: 200px; gap: 10px">
          <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px">
            <RippleButton
              style="background-color: transparent; box-shadow: none; padding: 0; width: 20%; min-width: 200px;"
              @click="emit('QRLogin')">

              <div v-for="item in user.filter(item => item.current == 1)"
                style="display: flex; gap: 10px; text-align: left;">
                <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
                <div style="display: flex; flex-direction: column;">
                  <div
                    style="font-weight: bold; color: rgb(var(--text-color)); font-size: 20px; white-space: nowrap; text-overflow: ellipsis;">
                    {{
                      item.user_name }}</div>
                  <div style="text-align: left; font-size: 14px; color: rgba(var(--text-color), 0.5)">{{ item.current ?
                    '轻按进入账号管理' : '已登录' }}
                  </div>
                </div>

              </div>
            </RippleButton>
          </div>
          <div class="filter-button" style="padding: 0 8px">通用</div>
          <RippleButton v-for="item in generalSettingItems" class="filter-button"
            :class="{ selected: item.id === currentPage }" @click="currentPage = item.id"
            style="box-shadow: none; padding: 6px 8px; justify-self: right; font-size: 14px;opacity: 1;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <img :src=item.icon width="16px" class="icon_">
              <span>{{ item.title }}</span>
            </div>
          </RippleButton>
          <div class="filter-button" style="padding: 0 8px">插件</div>
          <RippleButton v-for="item in pluginSettings" class="filter-button"
            :class="{ selected: item.id === currentPage }" @click="currentPage = item.id"
            style="box-shadow: none; padding: 6px 8px; justify-self: right; font-size: 14px; opacity: 1;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <img :src=item.icon width="16px" class="icon_">
              <span>{{ item.title }}</span>
            </div>
          </RippleButton>
        </div>
        <div>

        </div>
        <div style="width: 100%;">
          <!-- <div>轻按来切换用户，右键可进行更多操作。若登录信息失效，重新进行登录即可更新用户信息。</div>
          <RippleButton class="current-user" style="align-items: left; text-align: left;">
            <div v-for="item in user" style="display: flex; gap: 10px; margin: 10px 0;">
              <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
              <div class="desc">
                <div class="title" style="font-weight: bold;">{{ item.user_name }}</div>
                <div class="description">{{ item.current ? '当前账户' : '已登录' }}</div>
              </div>

            </div>
            <div v-if="user.length == 0">没有登录的账户。请点击添加。</div>

          </RippleButton> -->
          <!-- <h3>通用</h3>
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
          <div>提醒喝水小助手</div> -->
          <div style="display: flex; text-align: left; gap: 10px; align-items: center; margin-bottom: 15px;">
            <div style="font-size: 25px; font-weight: bold;">关于</div>
            <div
              style=" display: flex; align-items: center; gap: 10px; background-color: rgba(255,193, 49, 0.15); padding-right: 10px; border-radius: 5px; margin-left: auto;">
              <span
                style="font-size: 14px; font-weight: bold; padding: 5px 10px; background-color: rgba( 36,200,219, 0.15); border-radius: 5px 0px 0px 5px;">Built
                with</span>
              <img src="/assets/tauri-logo.svg" height="20px">
            </div>


          </div>
          <div style="display: flex; flex-direction: column; gap: 10px">
            <Item v-for="item in currentSettingItems" :icon=item.icon :title=item.title :desc=item.desc
              style="width: 100%;"></Item>
          </div>


        </div>
      </div>



    </div>
  </Container>
</template>

<style scoped>
.filter-button.selected {
  background-color: rgba(var(--text-color), 0.05);
  font-weight: bold;
}

.filter-button:hover {
  opacity: 0.5;
}

.filter-button {
  background-color: transparent;
  font-weight: normal;
}

.navi-bar {
  text-align: left;
}

.current-user {
  width: 100%;
  padding: 6px 8px;
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
