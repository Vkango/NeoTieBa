<script setup lang="ts">
import { getCurrentUser } from '@/services/user-manage';
import { useApiStore } from '@/stores';
import { ref, onMounted, inject } from 'vue';
import Container from '@/components/common/Container.vue';

// 类型定义
interface ForumInfo {
  forum_name: string;
  avatar: string;
  user_level: number;
  user_level_name: string;
  is_sign_in: boolean;
}

interface Props {
  key_: string | number;
}

interface Emits {
  (e: 'BarNameClicked', barName: string): void;
  (e: 'setTabInfo', info: { key: string | number; title: string; icon: string }): void;
}

// Props & Emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Inject
const updateTabMeta = inject<(info: { key: string | number; title: string; icon: string }) => void>('updateTabMeta');

// State
const naviListItem = ref<ForumInfo[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  const cookie = await getCurrentUser();
  const apiStore = useApiStore();
  const api = apiStore.getApi();
  const result = (await api.followbar_list(cookie.bduss, cookie.stoken)).forum_info.sort(
    (a: ForumInfo, b: ForumInfo) => b.user_level - a.user_level
  );
  console.log(result);

  // 检查pluginManager是否存在
  if (window.pluginManager) {
    naviListItem.value = await window.pluginManager.dispatchEvent('followBarUpdated', result);
    console.log(naviListItem.value);
    console.log(await window.pluginManager.dispatchEvent('followBarUpdated', result));
  } else {
    naviListItem.value = result;
  }

  isLoading.value = false;
  updateTabMeta?.({ key: props.key_, title: "进吧", icon: "/assets/apps.svg" });
})

</script>

<template>
  <Container>
    <div class="bgr">
      <div class="list-title">关注的吧</div>
      <transition name="fade1">
        <div class="list-view" v-if="!isLoading">
          <button class="bar-button" v-if="naviListItem.length > 0" v-for="item in naviListItem"
            @click="emit('BarNameClicked', item.forum_name)">
            <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
            <div style="margin-left: 5px;">
              <div class="bar-name">{{ item.forum_name }} </div>
              <div class="desc"><span class="level"
                  :class="{ 'color1': item.user_level >= 0 && item.user_level < 4, 'color2': item.user_level >= 4 && item.user_level < 10, 'color3': item.user_level >= 10 && item.user_level < 16, 'color4': item.user_level > 16 }">{{
                    item.user_level }}</span><span>{{ item.user_level_name }} | {{ item.is_sign_in ? `已签` : `未签` }}</span>
              </div>
            </div>
          </button>
          <div v-if="naviListItem.length === 0">没有关注的吧</div>
        </div>
      </transition>
    </div>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.list-view {
  display: grid;
  gap: 10px 10px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  align-items: start;
}

.level {
  margin: 0;
}

.bgr {
  width: 80%;
  justify-self: center;
  margin-bottom: 10px;
}

.desc {
  font-size: 13px;
  opacity: 0.5;
  display: flex;
  align-items: center;
  gap: 5px;
}

.bar-name {
  font-size: 16px;
  font-weight: bold;
  width: 200px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}

.bar-button {
  display: flex;
  gap: 10px;
  background-color: rgba(var(--text-color), 0.05);
  box-shadow: none;
  text-align: left;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px 15px;
  border-radius: 5px;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.list-title {
  padding: 10px 5px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}
</style>