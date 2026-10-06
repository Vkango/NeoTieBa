<template>
  <div class="share-card">
    <div class="card-header" :class="{ inline: data.inline }">
      <img v-if="data.avatar" class="card-avatar" :src="data.avatar" referrerpolicy="no-referrer" />
      <div v-else class="card-avatar card-avatar-fallback">{{ (data.title || '?').charAt(0) }}</div>
      <div class="card-header-text">
        <div class="card-title">{{ data.title }}</div>
        <template v-if="data.inline">
          <div class="card-sub" v-if="data.subtitle || data.meta">
            <span v-if="data.subtitle">{{ data.subtitle }}</span>
            <span v-if="data.subtitle && data.meta" class="card-sub-dot">·</span>
            <span v-if="data.meta">{{ data.meta }}</span>
          </div>
        </template>
        <template v-else>
          <div class="card-subtitle" v-if="data.subtitle">{{ data.subtitle }}</div>
          <div class="card-meta" v-if="data.meta">{{ data.meta }}</div>
        </template>
      </div>
    </div>
    <div class="card-bar-chip" v-if="data.barName">
      <img v-if="data.barAvatar" :src="data.barAvatar" referrerpolicy="no-referrer" />
      <span>{{ data.barName }}吧</span>
    </div>
    <div class="card-content" v-if="data.contentHtml || data.content" v-html="data.contentHtml || data.content"></div>
    <div class="card-stats" v-if="data.stats && data.stats.length">
      <span class="card-stat" v-for="(stat, i) in data.stats" :key="i">
        <b>{{ stat.value }}</b>
        <small>{{ stat.label }}</small>
      </span>
    </div>
    <div class="card-source" v-if="data.source && (data.source.title || data.source.author || data.source.barName)">
      <div class="source-title" v-if="data.source.title">{{ data.source.title }}</div>
      <div class="source-meta">
        <img v-if="data.source.authorAvatar" class="source-avatar" :src="data.source.authorAvatar"
          referrerpolicy="no-referrer" />
        <span v-if="data.source.author">{{ data.source.author }}</span>
        <img v-if="data.source.barAvatar" class="source-avatar" :src="data.source.barAvatar"
          referrerpolicy="no-referrer" />
        <span v-if="data.source.barName">{{ data.source.barName }}吧</span>
      </div>
    </div>
    <div class="card-footer">
      <div class="card-brand">
        <div class="brand-name">百度贴吧</div>
        <div class="brand-tip">扫码打开原链接</div>
      </div>
      <img class="card-qrcode" :src="qr" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShareCardData } from './types';

defineProps<{ data: ShareCardData; qr: string }>();
</script>

<style scoped>
.share-card {
  width: 360px;
  box-sizing: border-box;
  padding: 22px;
  background-color: #ffffff;
  border-radius: 16px;
  color: #1a1a1a;
  font-family: system-ui, 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header.inline {
  gap: 8px;
}

.card-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.card-header.inline .card-avatar {
  width: 26px;
  height: 26px;
}

.card-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.08);
  color: #666666;
  font-size: 20px;
  font-weight: 600;
}

.card-header.inline .card-avatar-fallback {
  font-size: 13px;
}

.card-header-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.card-header.inline .card-header-text {
  flex-direction: row;
  align-items: baseline;
  gap: 6px;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  color: #111111;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.card-header.inline .card-title {
  font-size: 14px;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  white-space: nowrap;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
}

.card-sub {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 12px;
  color: #999999;
  white-space: nowrap;
  flex-shrink: 0;
}

.card-sub-dot {
  opacity: 0.7;
}

.card-subtitle {
  margin-top: 3px;
  font-size: 12px;
  color: #888888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  margin-top: 2px;
  font-size: 12px;
  color: #999999;
}

.card-bar-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  padding: 3px 10px 3px 4px;
  background-color: #f2f3f5;
  border-radius: 999px;
  font-size: 12px;
  color: #555555;
}

.card-bar-chip img {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
}

.card-content {
  margin-top: 14px;
  font-size: 14px;
  line-height: 1.7;
  color: #333333;
  white-space: pre-wrap;
  word-break: break-all;
  display: -webkit-box;
  line-clamp: 8;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-content :deep(img.emoticon) {
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
  vertical-align: text-bottom;
}

.card-content :deep(img.thread-reply-img) {
  display: block;
  width: 100%;
  border-radius: 8px;
  margin: 8px 0;
}

.card-content :deep(a) {
  color: #4a7dbd;
  text-decoration: none;
}

.card-stats {
  display: flex;
  gap: 16px;
  margin-top: 14px;
}

.card-stat {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.card-stat b {
  font-size: 14px;
  color: #111111;
}

.card-stat small {
  font-size: 12px;
  color: #999999;
}

.card-source {
  margin-top: 14px;
  padding: 10px 12px;
  background-color: #f5f6f7;
  border-radius: 10px;
}

.source-title {
  font-size: 13px;
  font-weight: 500;
  color: #333333;
  line-height: 1.5;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}

.source-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  font-size: 12px;
  color: #888888;
}

.source-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
}

.source-meta img+span {
  margin-right: 6px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: #111111;
}

.brand-tip {
  margin-top: 3px;
  font-size: 11px;
  color: #999999;
}

.card-qrcode {
  width: 68px;
  height: 68px;
  flex-shrink: 0;
}
</style>
