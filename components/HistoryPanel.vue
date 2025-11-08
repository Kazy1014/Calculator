<template>
  <div class="history-panel-container">
    <div class="history-header">
      <h2>計算履歴</h2>
      <button
        class="btn-clear-history"
        @click="$emit('clearHistory')"
        :disabled="history.length === 0"
      >
        すべてクリア
      </button>
    </div>
    <div class="history-list">
      <div v-if="history.length === 0" class="empty-message">
        履歴がありません
      </div>
      <div
        v-for="entry in history"
        :key="entry.id"
        class="history-entry"
        @click="$emit('replay', entry.id)"
      >
        <div class="entry-expression">{{ entry.formattedExpression }}</div>
        <div class="entry-result">= {{ entry.formattedResult }}</div>
        <div class="entry-timestamp">{{ formatTimestamp(entry.timestamp) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HistoryEntryDTO } from '~/src/application/dto/HistoryEntryDTO'

defineProps<{
  history: HistoryEntryDTO[]
}>()

defineEmits<{
  replay: [entryId: string]
  clearHistory: []
}>()

const formatTimestamp = (timestamp: Date) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
</script>

<style scoped>
.history-panel-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.history-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.btn-clear-history {
  padding: 8px 16px;
  font-size: 0.9rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-clear-history:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-1px);
}

.btn-clear-history:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-message {
  text-align: center;
  color: #95a5a6;
  padding: 40px 20px;
  font-size: 1.1rem;
}

.history-entry {
  background: white;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.history-entry:hover {
  border-color: #667eea;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.entry-expression {
  font-size: 1rem;
  color: #555;
  margin-bottom: 5px;
  font-family: 'Courier New', monospace;
}

.entry-result {
  font-size: 1.3rem;
  font-weight: 600;
  color: #27ae60;
  margin-bottom: 5px;
  font-family: 'Courier New', monospace;
}

.entry-timestamp {
  font-size: 0.8rem;
  color: #95a5a6;
  text-align: right;
}

/* Scrollbar styling */
.history-list::-webkit-scrollbar {
  width: 8px;
}

.history-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.history-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

