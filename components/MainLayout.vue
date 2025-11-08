<template>
  <div class="main-layout">
    <div class="history-panel">
      <HistoryPanel
        :history="history"
        @replay="onReplayHistoryEntry"
        @clear-history="onClearHistory"
      />
    </div>
    <div class="calculator-panel">
      <CalculatorConsole
        :expression-text="expressionText"
        :display-value="displayValue"
        :error-message="errorMessage"
        :memory-has-value="memoryHasValue"
        :angle-mode="angleMode"
        @input-character="onInputCharacter"
        @backspace="onBackspace"
        @clear="onClear"
        @evaluate="onEvaluate"
        @save-to-memory="onSaveToMemory"
        @recall-from-memory="onRecallFromMemory"
        @clear-memory="onClearMemory"
        @toggle-angle-mode="onToggleAngleMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalculatorV2 } from '~/src/presentation/composables/useCalculatorV2'
import HistoryPanel from './HistoryPanel.vue'
import CalculatorConsole from './CalculatorConsole.vue'

// Composable
const calculator = useCalculatorV2()

// Props destructuring
const {
  expressionText,
  displayValue,
  errorMessage,
  history,
  memoryHasValue,
  angleMode,
  inputCharacter,
  backspace,
  clear,
  evaluate,
  refreshHistory,
  clearHistory,
  replayHistoryEntry,
  saveToMemory,
  recallFromMemory,
  clearMemory,
  toggleAngleMode
} = calculator

// Event handlers
const onInputCharacter = (char: string) => {
  inputCharacter(char)
}

const onBackspace = () => {
  backspace()
}

const onClear = () => {
  clear()
}

const onEvaluate = () => {
  evaluate()
}

const onReplayHistoryEntry = (entryId: string) => {
  replayHistoryEntry(entryId)
}

const onClearHistory = () => {
  clearHistory()
}

const onSaveToMemory = (value: number) => {
  saveToMemory(value)
}

const onRecallFromMemory = () => {
  recallFromMemory()
}

const onClearMemory = () => {
  clearMemory()
}

const onToggleAngleMode = () => {
  toggleAngleMode()
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  gap: 20px;
}

.history-panel {
  flex: 0 0 40%;
  max-width: 40%;
  display: flex;
  flex-direction: column;
}

.calculator-panel {
  flex: 0 0 60%;
  max-width: 60%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .history-panel,
  .calculator-panel {
    flex: 1;
    max-width: 100%;
  }
}
</style>

