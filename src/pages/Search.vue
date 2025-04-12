<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import { read_file } from '../read_file';
import { tieBaAPI } from '../tieba-api';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
import RippleButton from '../components/RippleButton.vue';
const returnData = ref({});
const isLoading = ref(true);
const searchResult = ref();
const searchType = ref(1);
onMounted(async () => {
  isLoading.value = true;
  const bduss = await read_file(import.meta.env.PROD ? './cookie.txt' : '../cookie.txt');
  const api = new tieBaAPI;
  returnData.value = await api.myProfile(bduss);
  console.log(await api.searchUser("米米世界大佬"));
  searchResult.value = (await api.searchUser("米米世界大佬")).data;
  isLoading.value = false;
});
const emit = defineEmits(['BarNameClicked', 'UserNameClicked']);
</script>

<template>
  <Container @yscroll="onScroll">
    <div v-if="!isLoading" class="container1">
      <div class="list-title">搜索</div>
      <input placeholder="键入关键词后按下回车键进行搜索……"></input>
      <div class="navi-buttons">
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 0 }" @click="searchType = 0">搜吧
        </RippleButton>
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 1 }" @click="searchType = 1">搜贴
        </RippleButton>
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 2 }" @click="searchType = 2">搜人
        </RippleButton>
      </div>
      <div class="result" v-if="searchType == 0">
        <div v-if="searchResult.exactMatch.avatar != undefined">
          <Tag>最佳匹配</Tag>
          <div style="margin-top: 10px; display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
            <button class="bar-button" @click="emit('BarNameClicked', searchResult.exactMatch.forum_name)">
              <img class="avatar" :src="searchResult.exactMatch.avatar" referrerpolicy="no-referrer">
              <div style="margin-left: 5px;">
                <div class="bar-name">{{ searchResult.exactMatch.forum_name }} </div>
                <div class="desc"><span>贴子数 {{ searchResult.exactMatch.post_num }}</span></div>
              </div>
            </button>
          </div>
        </div>
        <div v-if="searchResult.fuzzyMatch.avatar != undefined">
          <Tag>相关匹配</Tag>
          <div style="margin-top: 10px; display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
            <button class="bar-button" v-for="item in searchResult.fuzzyMatch"
              @click="emit('BarNameClicked', item.forum_name)">
              <img class="avatar" :src="item.avatar" referrerpolicy="no-referrer">
              <div style="margin-left: 5px;">
                <div class="bar-name">{{ item.forum_name }} </div>
                <div class="desc"><span>贴子数 {{ item.post_num }}</span></div>
              </div>
            </button>
          </div>
        </div>

      </div>
      <div class="result" v-if="searchType == 2">
        <div v-if="searchResult.exactMatch.id != undefined">
          <Tag>最佳匹配</Tag>
          <div style="margin-top: 10px; display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
            <button class="bar-button" @click="emit('UserNameClicked', searchResult.exactMatch.id)">
              <img class="avatar" :src="searchResult.exactMatch.portrait" referrerpolicy="no-referrer">
              <div style="margin-left: 5px;">
                <div class="bar-name">{{ searchResult.exactMatch.name }} ({{ searchResult.exactMatch.show_nickname }})
                </div>
                <div class="desc"><span v-html="searchResult.exactMatch.intro"></span></div>
              </div>
            </button>
          </div>
        </div>
        <div v-if="searchResult.fuzzyMatch[0].id != undefined">
          <Tag>相关匹配</Tag>
          <div style="margin-top: 10px; display: flex; gap: 10px; flex-direction: row; flex-wrap: wrap;">
            <button class="bar-button" v-for="item in searchResult.fuzzyMatch"
              @click="emit('UserNameClicked', item.id)">
              <img class="avatar" :src="item.portrait" referrerpolicy="no-referrer">
              <div style="margin-left: 5px;">
                <div class="bar-name">{{ item.name }} ({{ item.show_nickname }})</div>
                <div class="desc"><span>{{ item.intro }}</span></div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isThreadsLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
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
  width: 300px;
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

.result {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-nostyle.selected {
  color: rgba(var(--text-color), 1);
  border-bottom: 2px solid rgba(var(--text-color), 1);
  font-weight: bold;
}

.button-nostyle {
  background-color: transparent;
  box-shadow: none;
  width: fit-content;
  justify-self: center;
  font-size: 13px;
  color: rgba(var(--text-color), 0.5);
  border-radius: 0;
}

.navi-buttons {
  margin-top: 5px;
  display: flex;
  gap: 10px;
}

.list-title {
  padding: 10px 5px;
  font-size: 16px;
  font-weight: bold;
  position: relative;
}

.container1 {
  width: 80%;
  justify-self: center;
}

input {
  border: none;
  outline-style: none;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
}
</style>
