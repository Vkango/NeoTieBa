<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import { read_file } from '../read_file';
import { tieBaAPI } from '../tieba-api';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
import RippleButton from '../components/RippleButton.vue';
import Thread from '../components/Thread.vue';

const isLoading = ref(false);
const searchResult = ref();
const searchType = ref(0);
const searchContent = ref("");
const emit = defineEmits(['threadClick', 'setTabInfo', 'UserNameClicked', 'BarNameClicked']);
const handleEnter = async () => {
  isLoading.value = true;
  const api = new tieBaAPI;

  switch (searchType.value) {
    case 0:
      const barResult = await api.searchBar(searchContent.value);
      searchResult.value = barResult.data;
      break;
    case 1:
      const threadResult = await api.searchThread(searchContent.value);
      searchResult.value = threadResult.data.post_list;
      console.log(searchResult.value)
      break;
    case 2:
      const userResult = await api.searchUser(searchContent.value);
      searchResult.value = userResult.data;
      break;
  }
  isLoading.value = false;
}
const handleClick = (id) => {
  emit('threadClick', id);
}
const onUserNameClicked = (uid) => {
  emit('UserNameClicked', uid);
}
</script>

<template>
  <Container @yscroll="onScroll">
    <div class="container1">
      <div class="list-title">搜索</div>
      <div class="navi-buttons">
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 0 }"
          @click="searchResult = undefined; searchType = 0; handleEnter()">搜吧
        </RippleButton>
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 1 }"
          @click="searchResult = undefined; searchType = 1; handleEnter()">搜贴
        </RippleButton>
        <RippleButton class="button-nostyle" :class="{ 'selected': searchType == 2 }"
          @click="searchResult = undefined; searchType = 2; handleEnter()">搜人
        </RippleButton>
      </div>
      <input placeholder="键入关键词后按下回车键进行搜索……" @keyup.enter="handleEnter" v-model="searchContent"></input>
      <TransitionGroup name="fade1">
        <div class="result" v-if="searchType == 0 && searchResult">
          <div v-if="searchResult.exactMatch.avatar != undefined">
            <Tag>最佳匹配</Tag>
            <div style="margin-top: 10px; display: grid; gap: 10px 10px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); align-items: start;">
              <button class="bar-button" @click="emit('BarNameClicked', searchResult.exactMatch.forum_name)">
                <img class="avatar" :src="searchResult.exactMatch.avatar" referrerpolicy="no-referrer">
                <div style="margin-left: 5px;">
                  <div class="bar-name">{{ searchResult.exactMatch.forum_name }} </div>
                  <div class="desc"><span>贴子数 {{ searchResult.exactMatch.post_num }}</span></div>
                </div>
              </button>
            </div>
          </div>
          <div v-if="searchResult.fuzzyMatch[0].avatar != undefined">
            <Tag>相关匹配</Tag>
            <div style="margin-top: 10px; display: grid; gap: 10px 10px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); align-items: start;">
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


        <div class="result" v-if="searchType == 1 && searchResult">
          <Thread @UserNameClicked="onUserNameClicked(item.user.uid)" @threadClicked="handleClick(item.tid)"
            v-for="item in searchResult" :thread_title="item.title"
            :user_name="item.user.user_name || item.user.show_nickname || '(未知)'"
            :avatar="item.user.portrait.match(/tb\.1\.[^/]+/) ? item.user.portrait.match(/tb\.1\.[^/]+/)[0] : '0'"
            :thread_content="Array({ type: 0, text: item.content })" :create_time="item.time"
            :reply_num="item.post_num">
          </Thread>
        </div>


        <div class="result" v-if="searchType == 2 && searchResult">
          <div v-if="searchResult.exactMatch.id != undefined">
            <Tag>最佳匹配</Tag>
            <div style="margin-top: 10px; display: grid; gap: 10px 10px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); align-items: start;">
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
            <div style="margin-top: 10px; display: grid; gap: 10px 10px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); align-items: start;">
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
      </TransitionGroup>
    </div>
    <transition name="fade1">
      <Loading class="loading-box" v-if="isLoading"></Loading>
    </transition>
  </Container>
</template>

<style scoped>
.thread {
  width: 100%;
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
  height: 100%;
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
  margin: 10px 0;
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
  margin-bottom: 10px;
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
  width: 100%;
}
</style>
