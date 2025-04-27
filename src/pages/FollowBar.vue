<script setup>
import RippleButton from '../components/RippleButton.vue';
import { onMounted, ref } from 'vue';
import Tag from '../components/Tag.vue';
import { get_current_user_cookies, get_current_user } from '../user-manage';
import { tieBaAPI } from '../tieba-api';
import Container from '../components/Container.vue';
import Loading from '../components/Loading.vue';
const naviListItem = ref([]);
const isLoading = ref(true);
onMounted(async () => {
  const cookie = await get_current_user();
  const api = new tieBaAPI;
  naviListItem.value = (await api.followbar_list(cookie.bduss, cookie.stoken)).forum_info.sort((a, b) => b.user_level - a.user_level);;
  isLoading.value = false;
})
const emit = defineEmits(['BarNameClicked']);
</script>

<template>
  <Container>
    <div class="bgr">
      <div class="list-title">关注的吧</div>
      <transition name="fade1">
        <div class="list-view" v-if="!isLoading">
          <button class="bar-button" v-for="item in naviListItem" @click="emit('BarNameClicked', item.forum_name)">
            <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
            <div style="margin-left: 5px;">
              <div class="bar-name">{{ item.forum_name }} </div>
              <div class="desc"><span class="level"
                  :class="{ 'color1': item.user_level >= 0 && item.user_level < 4, 'color2': item.user_level >= 4 && item.user_level < 10, 'color3': item.user_level >= 10 && item.user_level < 16, 'color4': item.user_level > 16 }">{{
                    item.user_level }}</span><span>{{ item.user_level_name }} | {{ item.is_sign_in ? `已签` : `未签` }}</span>
              </div>
            </div>
          </button>
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