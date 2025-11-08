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
      <!-- 第1行: メモリと角度モード -->
      <button class="btn btn-memory" @click="$emit('clearMemory')">MC</button>
      <button class="btn btn-memory" @click="$emit('recallFromMemory')">MR</button>
      <button class="btn btn-memory" @click="saveCurrentToMemory">M+</button>
      <button class="btn btn-memory" @click="$emit('toggleAngleMode')">DEG</button>

      <!-- 第2行: クリアと特殊機能 -->
      <button class="btn btn-secondary btn-all-clear" data-testid="btn-all-clear" @click="$emit('allClear')">AC</button>
      <button class="btn btn-secondary" data-testid="btn-clear" @click="$emit('clearEntry')">C</button>
      <button class="btn btn-secondary" data-testid="btn-backspace" @click="$emit('backspace')">←</button>
      <button class="btn btn-secondary" data-testid="btn-percent" @click="$emit('inputCharacter', '%')">%</button>

      <!-- 第3行: 7, 8, 9, ÷ -->
      <button class="btn" data-testid="btn-7" @click="$emit('inputCharacter', '7')">7</button>
      <button class="btn" data-testid="btn-8" @click="$emit('inputCharacter', '8')">8</button>
      <button class="btn" data-testid="btn-9" @click="$emit('inputCharacter', '9')">9</button>
      <button class="btn btn-operator" data-testid="btn-divide" @click="$emit('inputCharacter', '/')">÷</button>

      <!-- 第4行: 4, 5, 6, × -->
      <button class="btn" data-testid="btn-4" @click="$emit('inputCharacter', '4')">4</button>
      <button class="btn" data-testid="btn-5" @click="$emit('inputCharacter', '5')">5</button>
      <button class="btn" data-testid="btn-6" @click="$emit('inputCharacter', '6')">6</button>
      <button class="btn btn-operator" data-testid="btn-multiply" @click="$emit('inputCharacter', '*')">×</button>

      <!-- 第5行: 1, 2, 3, - -->
      <button class="btn" data-testid="btn-1" @click="$emit('inputCharacter', '1')">1</button>
      <button class="btn" data-testid="btn-2" @click="$emit('inputCharacter', '2')">2</button>
      <button class="btn" data-testid="btn-3" @click="$emit('inputCharacter', '3')">3</button>
      <button class="btn btn-operator" data-testid="btn-subtract" @click="$emit('inputCharacter', '-')">-</button>

      <!-- 第6行: 0, ., =, + -->
      <button class="btn" data-testid="btn-0" @click="$emit('inputCharacter', '0')">0</button>
      <button class="btn" data-testid="btn-decimal" @click="$emit('inputCharacter', '.')">.</button>
      <button class="btn btn-equals" data-testid="btn-equals" @click="$emit('evaluate')">=</button>
      <button class="btn btn-operator" data-testid="btn-add" @click="$emit('inputCharacter', '+')">+</button>
    </div>

    <!-- 科学計算ボタン -->
    <div class="scientific-section">
      <div class="scientific-header">
        <span>科学計算機能</span>
      </div>
      <div class="scientific-grid">
        <!-- 三角関数 -->
        <button class="btn btn-scientific" data-testid="btn-sin" @click="inputFunction('sin')">sin</button>
        <button class="btn btn-scientific" data-testid="btn-cos" @click="inputFunction('cos')">cos</button>
        <button class="btn btn-scientific" data-testid="btn-tan" @click="inputFunction('tan')">tan</button>
        <button class="btn btn-scientific" data-testid="btn-power" @click="$emit('inputCharacter', '^')">x^y</button>

        <!-- 逆三角関数 -->
        <button class="btn btn-scientific" @click="inputFunction('asin')">asin</button>
        <button class="btn btn-scientific" @click="inputFunction('acos')">acos</button>
        <button class="btn btn-scientific" @click="inputFunction('atan')">atan</button>
        <button class="btn btn-scientific" @click="inputFunction('exp')">exp</button>

        <!-- 対数と特殊関数 -->
        <button class="btn btn-scientific" data-testid="btn-log" @click="inputFunction('log')">log</button>
        <button class="btn btn-scientific" data-testid="btn-ln" @click="inputFunction('ln')">ln</button>
        <button class="btn btn-scientific" data-testid="btn-sqrt" @click="inputFunction('sqrt')">√</button>
        <button class="btn btn-scientific" @click="inputFunction('abs')">abs</button>

        <!-- 定数と括弧 -->
        <button class="btn btn-scientific" @click="insertConstant('pi')">π</button>
        <button class="btn btn-scientific" @click="insertConstant('e')">e</button>
        <button class="btn btn-scientific" data-testid="btn-left-paren" @click="onParenthesisClick('(')">(</button>
        <button class="btn btn-scientific" data-testid="btn-right-paren" @click="onParenthesisClick(')')">)</button>
      </div>
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
  allClear: []
  clearEntry: []
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

const insertConstant = (constant: string) => {
  if (constant === 'pi') {
    emit('inputCharacter', Math.PI.toString())
  } else if (constant === 'e') {
    emit('inputCharacter', Math.E.toString())
  }
}

const onParenthesisClick = (paren: string) => {
  emit('inputCharacter', paren)
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
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.btn {
  padding: 24px;
  font-size: 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: #f0f0f0;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* メモリボタン（青色） */
.btn-memory {
  background: #5b9bd5;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
}

.btn-memory:hover {
  background: #4a8bc2;
}

.btn-memory:active {
  background: #3a7aae;
}

/* セカンダリボタン（グレー） */
.btn-secondary {
  background: #b0b0b0;
  color: white;
  font-weight: 600;
  font-size: 1.3rem;
}

.btn-secondary:hover {
  background: #9a9a9a;
}

.btn-secondary:active {
  background: #888;
}

/* ACボタン（少し濃いグレー） */
.btn-all-clear {
  background: #989898;
  font-weight: 700;
}

.btn-all-clear:hover {
  background: #828282;
}

.btn-all-clear:active {
  background: #707070;
}

/* 特殊演算子ボタン（オレンジ - A） */
.btn-operator-special {
  background: #d97850;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
}

.btn-operator-special:hover {
  background: #c86840;
}

.btn-operator-special:active {
  background: #b85830;
}

/* 演算子ボタン（オレンジ） */
.btn-operator {
  background: #d97850;
  color: white;
  font-weight: 600;
  font-size: 1.8rem;
}

.btn-operator:hover {
  background: #c86840;
}

.btn-operator:active {
  background: #b85830;
}

/* イコールボタン（緑色） */
.btn-equals {
  background: #70ad47;
  color: white;
  font-weight: 600;
  font-size: 1.8rem;
}

.btn-equals:hover {
  background: #5f9639;
}

.btn-equals:active {
  background: #4f7f2f;
}

/* 科学計算セクション */
.scientific-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.scientific-header {
  text-align: center;
  margin-bottom: 15px;
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
}

.scientific-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.btn-scientific {
  background: #8e7cc3;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 16px;
}

.btn-scientific:hover {
  background: #7d6bb0;
}

.btn-scientific:active {
  background: #6c5a9e;
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

  .scientific-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }

  .btn-scientific {
    padding: 12px;
    font-size: 0.85rem;
  }
}
</style>

