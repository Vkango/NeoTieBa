<template>
  <Teleport to="#titlebar-mount">
    <RippleButton class="control-button" style="padding: 0; width: 48px; height: 45px;" id="avatar"
      @click="emit('showNotificationBox')">
      <img class="avatar" style="width: 20px; height: 20px; border-radius: 20px; padding: 0; margin-top: 5px;"
        :src="user.avatar">
      <div id="msgCount" v-if="msgCount > 0">{{ msgCount > 99 ? `99+` : msgCount }}</div>
    </RippleButton>
    <RippleButton class="control-button" @click="emit('showTabs')"> <!--Tabs-->
      <img class="icon" src="/assets/list.svg">
    </RippleButton>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RippleButton from '#components/common/RippleButton.vue';
import { getCurrentUser } from '@/services/user-manage';

interface UserDisplay {
  name: string;
  avatar: string;
}

const user = ref<UserDisplay>({ name: '', avatar: '' });

const updateAvatar = async (): Promise<void> => {
  try {
    const usr = await getCurrentUser();
    user.value.name = usr?.user_name || usr?.username || '';
    user.value.avatar = usr?.avatar || '/assets/user.svg';
  } catch {
    user.value = { name: '', avatar: '/assets/user.svg' };
  }
};

onMounted(async () => {
  await updateAvatar();
});

defineExpose({
  updateAvatar
});

const props = defineProps({
  msgCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['showTabs', 'showNotificationBox']);

</script>


<style scoped>
#avatar:hover {
  opacity: 1;
}

#avatar {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.icon {
  filter: invert(var(--invert));
}

.avatar {
  width: 30px;
  height: 30px;

  overflow: hidden;
}

#msgCount {
  opacity: 1;
  position: absolute;
  right: 6px;
  bottom: 10px;
  padding: 0 3px;
  background-color: rgba(var(--background-color), 0.288);
  backdrop-filter: blur(10px);
  min-width: 10px;
  height: 16px;
  border-radius: 10px;
  color: white;

}

.control-button img {
  width: 60%;
  padding-top: 3px;
}

.control-button {
  padding: 0 15px;
  background: none;
  border: none;
  color: rgba(var(--text-color), 0.5);
  font-size: 16px;
  cursor: pointer;
  height: 45px;
  box-shadow: none;
  display: flex;
  border-radius: 0;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: color 0.2s ease, background-color 0.2s ease;
  border-radius: 0;
}

.control-button:hover {
  color: rgba(var(--text-color), 1);
  background-color: rgba(var(--text-color), 0.1);
}

.control-button:active {
  background-color: rgba(var(--text-color), 0.1);
}

:root.dark .control-button,
:root.dark .control-button:active {
  background: none;
  background-color: transparent;
}

:root.dark .control-button:hover {
  background-color: rgba(var(--text-color), 0.1);
}
</style>
