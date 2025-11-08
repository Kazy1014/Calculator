<template>
  <div class="calculator-console">
    <!-- ディスプレイ -->
    <div class="display-section">
      <div class="expression-display" data-testid="expression-display">{{ expressionText }}</div>
      <div class="main-display" :class="{ error: errorMessage }" data-testid="display">
        {{ errorMessage || displayValue }}
      </div>
      <div class="indicator-row">
        <span v-if="memoryHasValue" class="memory-indicator" data-testid="memory-indicator">M</span>
        <span class="angle-indicator" data-testid="angle-indicator">{{ angleMode }}</span>
      </div>
    </div>

    <!-- ボタン -->
    <div class="buttons-grid">
      <!-- 第1行: メモリと関数 -->
      <button class="btn btn-function" @click="$emit('clearMemory')">MC</button>
      <button class="btn btn-function" @click="$emit('recallFromMemory')">MR</button>
      <button class="btn btn-function" @click="saveCurrentToMemory">AC</button>
      <button class="btn btn-function" @click="$emit('toggleAngleMode')">DEG/RAD</button>

      <!-- 第2行: クリアとバックスペース -->
      <button class="btn btn-clear" data-testid="btn-clear" @click="$emit('clear')">C</button>
      <button class="btn btn-operator" data-testid="btn-backspace" @click="$emit('backspace')">←</button>
      <button class="btn btn-operator" data-testid="btn-left-paren" @click="$emit('inputCharacter', '(')">(</button>
      <button class="btn btn-operator" data-testid="btn-right-paren" @click="$emit('inputCharacter', ')')">)</button>

      <!-- 第3-6行: 数字と演算子 -->
      <button class="btn btn-function" data-testid="btn-sin" @click="inputFunction('sin')">sin</button>
      <button class="btn btn-function" data-testid="btn-cos" @click="inputFunction('cos')">cos</button>
      <button class="btn btn-function" data-testid="btn-tan" @click="inputFunction('tan')">tan</button>
      <button class="btn btn-operator" data-testid="btn-divide" @click="$emit('inputCharacter', '/')">÷</button>

      <button class="btn btn-function" data-testid="btn-log" @click="inputFunction('log')">log</button>
      <button class="btn" data-testid="btn-7" @click="$emit('inputCharacter', '7')">7</button>
      <button class="btn" data-testid="btn-8" @click="$emit('inputCharacter', '8')">8</button>
      <button class="btn" data-testid="btn-9" @click="$emit('inputCharacter', '9')">9</button>
      <button class="btn btn-operator" data-testid="btn-multiply" @click="$emit('inputCharacter', '*')">×</button>

      <button class="btn btn-function" data-testid="btn-ln" @click="inputFunction('ln')">ln</button>
      <button class="btn" data-testid="btn-4" @click="$emit('inputCharacter', '4')">4</button>
      <button class="btn" data-testid="btn-5" @click="$emit('inputCharacter', '5')">5</button>
      <button class="btn" data-testid="btn-6" @click="$emit('inputCharacter', '6')">6</button>
      <button class="btn btn-operator" data-testid="btn-subtract" @click="$emit('inputCharacter', '-')">-</button>

      <button class="btn btn-function" data-testid="btn-sqrt" @click="inputFunction('sqrt')">√</button>
      <button class="btn" data-testid="btn-1" @click="$emit('inputCharacter', '1')">1</button>
      <button class="btn" data-testid="btn-2" @click="$emit('inputCharacter', '2')">2</button>
      <button class="btn" data-testid="btn-3" @click="$emit('inputCharacter', '3')">3</button>
      <button class="btn btn-operator" data-testid="btn-add" @click="$emit('inputCharacter', '+')">+</button>

      <button class="btn btn-function" data-testid="btn-power" @click="$emit('inputCharacter', '^')">x^y</button>
      <button class="btn btn-zero" data-testid="btn-0" @click="$emit('inputCharacter', '0')">0</button>
      <button class="btn" data-testid="btn-decimal" @click="$emit('inputCharacter', '.')">.</button>
      <button class="btn btn-equals" data-testid="btn-equals" @click="$emit('evaluate')">=</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AngleMode } from '~/src/domain/value-objects/AngleMode'

const props = defineProps<{
  expressionText: string
  displayValue: string
  errorMessage: string | null
  memoryHasValue: boolean
  angleMode: AngleMode
}>()

const emit = defineEmits<{
  inputCharacter: [char: string]
  backspace: []
  clear: []
  evaluate: []
  saveToMemory: [value: number]
  recallFromMemory: []
  clearMemory: []
  toggleAngleMode: []
}>()

const inputFunction = (functionName: string) => {
  emit('inputCharacter', functionName)
  emit('inputCharacter', '(')
}

const saveCurrentToMemory = () => {
  // 現在の表示値をメモリに保存
  const value = parseFloat(props.displayValue.replace(/,/g, ''))
  if (!isNaN(value)) {
    emit('saveToMemory', value)
  }
}
</script>

<style scoped>
.calculator-console {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.display-section {
  background: #2c3e50;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  min-height: 120px;
}

.expression-display {
  color: #95a5a6;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  min-height: 24px;
  margin-bottom: 10px;
  text-align: right;
  word-wrap: break-word;
}

.main-display {
  color: #ecf0f1;
  font-size: 2.5rem;
  font-weight: 300;
  font-family: 'Courier New', monospace;
  text-align: right;
  word-wrap: break-word;
  min-height: 60px;
}

.main-display.error {
  color: #e74c3c;
}

.indicator-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.memory-indicator,
.angle-indicator {
  color: #3498db;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 8px;
  background: rgba(52, 152, 219, 0.2);
  border-radius: 4px;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.btn {
  padding: 20px;
  font-size: 1.3rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s ease;
  background: #f5f5f5;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
}

.btn:active {
  transform: translateY(0);
  box-shadow: none;
  background: #d9d9d9;
}

.btn-clear {
  background: #e74c3c;
  color: white;
  font-weight: 600;
  grid-column: span 1;
}

.btn-clear:hover {
  background: #d62c1a;
}

.btn-clear:active {
  background: #c0392b;
}

.btn-operator {
  background: #3498db;
  color: white;
  font-weight: 600;
}

.btn-operator:hover {
  background: #2980b9;
}

.btn-operator:active {
  background: #21618c;
}

.btn-function {
  background: #9b59b6;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.btn-function:hover {
  background: #8e44ad;
}

.btn-function:active {
  background: #7d3c98;
}

.btn-equals {
  background: #27ae60;
  color: white;
  font-weight: 600;
  grid-row: span 2;
  font-size: 2rem;
}

.btn-equals:hover {
  background: #229954;
}

.btn-equals:active {
  background: #1e8449;
}

.btn-zero {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .buttons-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .btn {
    padding: 15px;
    font-size: 1.1rem;
  }

  .main-display {
    font-size: 2rem;
  }
}
</style>

