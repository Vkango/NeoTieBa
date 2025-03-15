<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import { tieBaAPI } from '../tieba-api';
import Loading from '../components/Loading.vue';
import Container from '../components/Container.vue';
import Tag from '../components/Tag.vue';
import RippleButton from '../components/RippleButton.vue';
const returnData = ref({});
const returnData1 = ref({});
const isLoading = ref(true);
const FollowBarList = ref([]);
const props = defineProps({
  uid: {
    type: Number,
    required: true
  },
  key_: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['setTabInfo']);
onMounted(async() => {
  isLoading.value = true;
  const api = new tieBaAPI;
  returnData.value = (await api.user_info_protobuf(props.uid, 1)).data;
  returnData1.value = await api.userCard(returnData.value.user.portraith);
  emit('setTabInfo', { key: props.key_, title: returnData.value.user.nameShow + '的贴吧', icon: 'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.value.user.portrait });
  for (const [level, info] of Object.entries(returnData1.value.data.honor.grade)) {
    for (const forumName of info.forum_list) {
      FollowBarList.value.push({ forum_name: forumName, level_id: level });
    }
  }
  isLoading.value = false;
});
</script>

<template>
  <Container @yscroll="onScroll">
  <div v-if="!isLoading">
  <div class="bar-banner">
    <div class="image-container">
      <img class="background-image" :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.user.portrait" referrerpolicy="no-referrer">
    </div>
    <div class="banner-content">
      <img class="avatar" :src="'https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/' + returnData.user.portrait" referrerpolicy="no-referrer">
      <div>
        <div class="title">{{ returnData.user.nameShow }} ({{ returnData.user.name }})</div>
        <div class="description">{{ returnData.user.intro }}</div>
        <div class="tags">
          <Tag>吧龄：{{ returnData.user.tbAge }}年</Tag>
          <Tag>发帖：{{ returnData.user.postNum }}</Tag>
          <Tag>获赞：{{ returnData.user.totalAgreeNum }}</Tag>
          <Tag>{{ returnData.user.sex == 1 ? '♂' : '♀' }}</Tag>
          <Tag>IP属地：{{ returnData.user.ipAddress }}</Tag>
        </div>
      </div>
    </div>
  </div>

  <div class="content">
    <div style="width: 80%; display: flex;">
      <div class="post-list">
        <h3>发帖</h3>
      </div>
      <div class="user-cards">
        <div><h3>关注的吧</h3>
      <div class="bar-buttons">
          <div class="bar-button" v-for="item in FollowBarList" @click="emit('BarNameClicked', item.forum_name)">
            <span class="bar-name">{{ item.forum_name }} </span>
            <span class="desc"><span class="level" :class="{ 'color1' : item.level_id >= 0 && item.level_id < 4, 'color2': item.level_id >= 4 && item.level_id < 10, 'color3': item.level_id >= 10 && item.level_id < 16, 'color4': item.level_id > 16}">{{ item.level_id }}</span></span>
          </div>
        </div>
        </div>


        <div><h3>关注的人</h3>
      <div class="bar-buttons">
          <div class="bar-button" v-for="item in FollowBarList" @click="emit('BarNameClicked', item.forum_name)">
            <span class="bar-name">{{ item.forum_name }} </span>
            <span class="desc"><span class="level" :class="{ 'color1' : item.level_id >= 0 && item.level_id < 4, 'color2': item.level_id >= 4 && item.level_id < 10, 'color3': item.level_id >= 10 && item.level_id < 16, 'color4': item.level_id > 16}">{{ item.level_id }}</span></span>
          </div>
        </div>
        </div>

        <div><h3>粉丝</h3>
      <div class="bar-buttons">
          <div class="bar-button" v-for="item in FollowBarList" @click="emit('BarNameClicked', item.forum_name)">
            <span class="bar-name">{{ item.forum_name }} </span>
            <span class="desc"><span class="level" :class="{ 'color1' : item.level_id >= 0 && item.level_id < 4, 'color2': item.level_id >= 4 && item.level_id < 10, 'color3': item.level_id >= 10 && item.level_id < 16, 'color4': item.level_id > 16}">{{ item.level_id }}</span></span>
          </div>
        </div>
        </div>
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
hr {
  opacity: 0.1;
}
.level {
  margin: 10px;
}
.bar-button {
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 5px;
}
.user-cards {
  flex: auto;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.post-list {
  min-width: 500px;
  width: calc(100% - 300px);
}
.my-btn {
  width: 200px;
  height: 200px;
}
.tags {
  margin-top: 5px;
}
.thread-filter {
  width: 90%;
}
.thread-list {
  padding: 10px;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.content {
  padding: 10px;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.banner-content .title {
  font-size: 20px;
  font-weight: bold;
}
.banner-content .description {
  margin-top: 5px;
  opacity: 0.5;
}
.banner-content {
  position: absolute;
  top: 60px;
  padding: 15px 45px;
  display: flex;
  gap: 30px;
}
.bar-banner .background-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.image-container img {
  -webkit-mask-image: linear-gradient(rgba(0, 0, 0, 0.2), transparent);
  mask-image: linear-gradient(rgba(0, 0, 0, 0.2), transparent);
  filter: blur(50px);
}
.bar-banner .avatar {
  width: 80px;
  height: 80px;
  border-radius: 80px;
}
.bar-banner {
  width: 100%;
  height: 200px;
  position: relative;
}
.bar-buttons {
  width: 100%;
  background-color: transparent;
  box-shadow: none;
  display: flex;
  gap: 10px;
  flex-direction: column;
}
</style>
