<template>
  <div class="research-page">
    <!-- 背景光晕 -->
    <div class="research-page__glow" />

    <div class="research-content">
      <h1 class="research-title">人才培养方案调研</h1>
      <p class="research-desc">检索全国优秀职业院校人培方案</p>

      <!-- 搜索框 -->
      <div class="search-box">
        <input
          v-model="keyword"
          type="text"
          class="search-box__input"
          placeholder="输入专业关键词如：机电一体化、工程造价 进行搜索"
          @keydown.enter="handleSearch"
        />
        <button class="search-box__btn" @click="handleSearch">
          <Sparkles :size="16" :stroke-width="2" />
          开始调研
        </button>
      </div>

      <!-- 猜你想搜 -->
      <div class="suggest-row">
        <span class="suggest-row__label">猜你想搜：</span>
        <button
          v-for="s in suggestions"
          :key="s"
          class="suggest-chip"
          @click="keyword = s; handleSearch()"
        >{{ s }}</button>
      </div>

      <!-- 收录统计 -->
      <p class="research-stat">
        <span class="research-stat__dot" />
        已收录 <strong>17</strong> 篇院校人才培养方案
        <span class="research-stat__dot" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'

const keyword = ref('')
const suggestions = ['机电一体化', '工程造价', '人工智能', '物联网']

function handleSearch() {
  const url = 'https://iflyvedcs.fifedu.com/vocational-mannage/majorConstruction/research/planResearch'
  window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.research-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #f0faf5 0%, var(--iflyv-bg-page) 50%);
}

.research-page__glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.research-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 760px;
  width: 100%;
  padding: 0 24px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.5s ease both;
}

.research-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--iflyv-text-1);
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}

.research-desc {
  font-size: 15px;
  color: var(--iflyv-text-4);
  margin: 0 0 40px;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid var(--iflyv-border-light);
  border-radius: 14px;
  padding: 6px 6px 6px 24px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus-within {
    border-color: rgba(30, 30, 30, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }

  &__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: var(--iflyv-text-1);
    min-width: 0;

    &::placeholder {
      color: var(--iflyv-text-4);
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 24px;
    border-radius: 10px;
    border: none;
    background: #1a1a2e;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover {
      background: #2d2d44;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

/* 猜你想搜 */
.suggest-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  flex-wrap: wrap;
  justify-content: center;

  &__label {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    white-space: nowrap;
  }
}

.suggest-chip {
  padding: 8px 20px;
  border-radius: 10px;
  border: 1px solid var(--iflyv-border-light);
  background: #fff;
  color: var(--iflyv-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--iflyv-text-4);
    color: var(--iflyv-text-1);
    background: var(--iflyv-bg-inset);
  }
}

/* 收录统计 */
.research-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 56px;
  font-size: 13px;
  color: var(--iflyv-text-4);

  strong {
    font-weight: 700;
    color: var(--iflyv-text-3);
  }

  &__dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--iflyv-text-4);
    opacity: 0.4;
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
