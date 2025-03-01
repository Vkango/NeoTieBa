<script setup>
import RippleButtonWithIcon from '../components/RippleButtonWithIcon.vue';
import { ref } from 'vue';

</script>

<template>
  <div class="bar-banner">
    <div class="image-container">
      <img class="background-image" src="https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=d4b5ecc4910735fa91f04abbae6a678e/08f790529822720e735eac253ecb0a46f31fab59.jpg?tbpicau=2025-03-12-05_78075b54a9f78702ef3e20e2efd88630" referrerpolicy="no-referrer">
    </div>
    <div class="banner-content">
      <img class="avatar" src="https://tiebapic.baidu.com/forum/w%3D120%3Bh%3D120/sign=d4b5ecc4910735fa91f04abbae6a678e/08f790529822720e735eac253ecb0a46f31fab59.jpg?tbpicau=2025-03-12-05_78075b54a9f78702ef3e20e2efd88630" referrerpolicy="no-referrer">
      <div>
        <div class="title">易遗言吧</div>
        <div class="description">猜猜我是谁</div>
        <div class="level">
          Lv.8 铁杆8u
        </div>
      </div>
    </div>
  </div>
  <div class="pinned-thread-list">
    <div class="pinned-thread">
      <span class="material-symbols-outlined">vertical_align_top</span>
      <span style="color: #ff3e46; font-weight: bold;">置顶</span>
      <span class="thread-title">【公告】关于对未成年色情低俗的内容治理处罚</span>
    </div>
    <div class="pinned-thread">
      <span class="material-symbols-outlined">vertical_align_top</span>
      <span style="color: #ff3e46; font-weight: bold;">置顶</span>
      <span class="thread-title">孙吧官方水楼 别处灌水会被封</span>
    </div>

  </div>
  <div class="thread-list">
    <div class="thread">
      <div class="user-info">
        <div class="avatar"><img class="avatar" src="https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/tb.1.eaaa7ef8.KOSkp6IgVSMUyp1VwLS3Tg?t=1724311386"></div>
        <div class="user-name">贴吧用户_JR6yJRJ</div>
      </div>
      <div class="thread-preview">
        <div class="thread-title">这不吃香菜哪个吧的</div>
        <div class="thread-content">
          <img class="emotion" v-for="i in 5" src="https://gsp0.baidu.com/5aAHeD3nKhI2p27j8IqW0jdnxx1xbK/tb/editor/images/client/image_emoticon22.png" referrerpolicy="no-referrer">
        </div>
        <div class="thread-media">
          <img class="thread-img" src="http://tiebapic.baidu.com/forum/w%3D580/sign=b02e89e2bdedab6474724dc8c736af81/63bf0e176d224f4a3485843a4ff790529822d145.jpg?tbpicau=2025-03-12-05_74be575c818040224e192ddfc73cf101" referrerpolicy="no-referrer">
        </div>
        <div class="thread-info">
          <span><span class="material-symbols-outlined">schedule</span>2025-02-18 14:04</span>
          <span><span class="material-symbols-outlined">
forum
</span> 100 </span>
        </div>
      </div>
    </div>
    <div class="thread">
      <div class="user-info">
        <div class="avatar"><img class="avatar" src="https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/tb.1.6e1f2ae9.JDMYi_x4k6CofuEGUFcokw?t=1709427637"></div>
        <div class="user-name">虾仁不会冬眠</div>
      </div>
      <div class="thread-preview">
        <div class="thread-title">🐢男又在幻想得吃</div>
        <div class="thread-content">
          <span>那完了</span>
        </div>
        <div class="thread-media">
          <img class="thread-img" src="http://tiebapic.baidu.com/forum/w%3D580/sign=1804cbf37f01213fcf334ed464e736f8/a18b76c69f3df8dc441470bb8b11728b471028b1.jpg?tbpicau=2025-03-12-05_c624c85f35f10b45f372a21c54abd21d" referrerpolicy="no-referrer">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thread-img {
  max-height: 450px;
  border-radius: 5px;
}
.thread-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.thread-preview .thread-title {
  font-weight: bold;
  font-size: 16px;
}
.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}
.thread-list .thread .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
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
.thread {
  width: 80%;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  font-size: 13px;
  gap: 10px;
  transition: background-color 0.3s ease;
}
.thread:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.pinned-thread {
  width: 80%;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 8px 10px;
  display: flex;
  border-radius: 8px;
  font-size: 13px;
  gap: 5px;
}
.pinned-thread-list {
  padding: 10px;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
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
  border-radius: 10px;
}
.bar-banner {
  width: 100%;
  height: 160px;
  position: relative;
}
</style>