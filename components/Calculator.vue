<template>
  <div class="calculator-container">
    <!-- 左側: 計算履歴 -->
    <div v-if="showHistoryPanel" class="history-panel">
      <div class="history-header">
        <h2>計算履歴</h2>
        <button
          class="btn-clear-history"
          data-testid="btn-clear-history"
          @click="calculator.handleClearHistory"
          v-if="calculator.history.length > 0"
        >
          クリア
        </button>
      </div>
      <div class="history-list" data-testid="history-list">
        <div
          v-for="(item, index) in calculator.history"
          :key="item && typeof item.getId === 'function' ? item.getId() : `history-${index}`"
          class="history-item"
          data-testid="history-item"
          @click="calculator.handleHistoryClick(item)"
        >
          <div class="history-expression">{{ item && typeof item.getExpression === 'function' ? item.getExpression() : '' }}</div>
          <div class="history-result">= {{ item && typeof item.getResult === 'function' ? item.getResult() : '' }}</div>
        </div>
        <div v-if="calculator.history.length === 0" class="history-empty">
          履歴がありません
        </div>
      </div>
    </div>

    <!-- 右側: 電卓 -->
    <div class="calculator-panel">
      <div class="calculator">
        <!-- 表示エリア -->
        <div class="display-container">
          <!-- エラーメッセージ表示エリア（Display_Componentの上部） -->
          <div v-if="isError" class="error-message" data-testid="error-message">
            {{ errorMessageText }}
          </div>
          <!-- 表示エリア -->
          <div class="display" data-testid="display">{{ calculator.display }}</div>
        </div>

        <!-- メモリインジケーター -->
        <div v-if="calculator.hasMemory" class="memory-indicator" data-testid="memory-indicator">
          M
        </div>

        <!-- 角度単位表示 -->
        <div class="angle-unit-indicator">
          {{ calculator.angleUnit === 'degrees' ? 'DEG' : 'RAD' }}
        </div>

        <!-- メイン電卓ボタン（6行×4列の24ボタン） -->
        <div class="buttons">
          <!-- 1行目：履歴（1・2列目）、関数（3・4列目） -->
          <button
            class="btn btn-history"
            data-testid="btn-history-toggle"
            @click="showHistoryPanel = !showHistoryPanel"
          >
            履歴
          </button>
          <button
            class="btn btn-history"
            data-testid="btn-history-clear"
            @click="calculator.handleClearHistory"
            v-if="calculator.history.length > 0"
          >
            履歴クリア
          </button>
          <button
            class="btn btn-function"
            data-testid="btn-functions-toggle"
            @click="showFunctions = !showFunctions"
          >
            関数
          </button>
          <button
            class="btn btn-function"
            data-testid="btn-angle-unit"
            @click="calculator.handleToggleAngleUnit"
          >
            {{ calculator.angleUnit === 'degrees' ? 'DEG' : 'RAD' }}
          </button>

          <!-- 2行目：←、C、%、÷ -->
          <button
            class="btn btn-function"
            data-testid="btn-backspace"
            @click="calculator.handleBackspace"
          >
            ←
          </button>
          <button
            class="btn btn-function"
            data-testid="btn-clear"
            @click="handleClearButton"
          >
            C
          </button>
          <button
            class="btn btn-function"
            data-testid="btn-percent"
            @click="handlePercent"
          >
            %
          </button>
          <button
            class="btn btn-operator"
            data-testid="btn-divide"
            @click="() => handleOperatorButton('/')"
          >
            ÷
          </button>

          <!-- 3行目：7、8、9、× -->
          <button class="btn" data-testid="btn-7" @click="() => handleNumberButton('7')">7</button>
          <button class="btn" data-testid="btn-8" @click="() => handleNumberButton('8')">8</button>
          <button class="btn" data-testid="btn-9" @click="() => handleNumberButton('9')">9</button>
          <button
            class="btn btn-operator"
            data-testid="btn-multiply"
            @click="() => handleOperatorButton('*')"
          >
            ×
          </button>

          <!-- 4行目：4、5、6、- -->
          <button class="btn" data-testid="btn-4" @click="() => handleNumberButton('4')">4</button>
          <button class="btn" data-testid="btn-5" @click="() => handleNumberButton('5')">5</button>
          <button class="btn" data-testid="btn-6" @click="() => handleNumberButton('6')">6</button>
          <button
            class="btn btn-operator"
            data-testid="btn-subtract"
            @click="() => handleOperatorButton('-')"
          >
            -
          </button>

          <!-- 5行目：1、2、3、+ -->
          <button class="btn" data-testid="btn-1" @click="() => handleNumberButton('1')">1</button>
          <button class="btn" data-testid="btn-2" @click="() => handleNumberButton('2')">2</button>
          <button class="btn" data-testid="btn-3" @click="() => handleNumberButton('3')">3</button>
          <button
            class="btn btn-operator"
            data-testid="btn-add"
            @click="() => handleOperatorButton('+')"
          >
            +
          </button>

          <!-- 6行目：±、0、.、= -->
          <button
            class="btn btn-function"
            data-testid="btn-toggle-sign"
            @click="handleToggleSign"
          >
            ±
          </button>
          <button class="btn" data-testid="btn-0" @click="() => handleNumberButton('0')">0</button>
          <button class="btn" data-testid="btn-decimal" @click="handleDecimal">.</button>
          <button
            class="btn btn-equals"
            data-testid="btn-equals"
            @click="handleEqualsButton"
          >
            =
          </button>
        </div>

        <!-- 関数ライブラリ（折りたたみ可能、別エリア） -->
        <div v-if="showFunctions" class="function-library-panel">
          <div class="function-buttons">
            <button
              class="btn btn-function"
              @click="handleFunction('sin')"
              data-testid="btn-sin"
            >
              sin
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('cos')"
              data-testid="btn-cos"
            >
              cos
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('tan')"
              data-testid="btn-tan"
            >
              tan
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('log')"
              data-testid="btn-log"
            >
              log
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('ln')"
              data-testid="btn-ln"
            >
              ln
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('sqrt')"
              data-testid="btn-sqrt"
            >
              √
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('^')"
              data-testid="btn-power"
            >
              x^y
            </button>
            <button
              class="btn btn-function"
              @click="handleParenthesis('(')"
              data-testid="btn-open-paren"
            >
              (
            </button>
            <button
              class="btn btn-function"
              @click="handleParenthesis(')')"
              data-testid="btn-close-paren"
            >
              )
            </button>
            <!-- 統計関数 -->
            <button
              class="btn btn-function"
              @click="handleFunction('mean')"
              data-testid="btn-mean"
            >
              mean
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('median')"
              data-testid="btn-median"
            >
              median
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('stddev')"
              data-testid="btn-stddev"
            >
              stddev
            </button>
            <button
              class="btn btn-function"
              @click="handleFunction('variance')"
              data-testid="btn-variance"
            >
              variance
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculator } from '~/src/presentation/composables/useCalculator'

// DDDアーキテクチャのComposableを使用
const calculator = useCalculator()
const showFunctions = ref(false)
const showHistoryPanel = ref(true) // 履歴パネルはデフォルトで表示

// エラー状態の判定
const isError = computed(() => {
  const displayValue = String(calculator.display || '')
  return displayValue === 'Error' || 
         displayValue.includes('括弧') ||
         displayValue.includes('エラー')
})

// エラーメッセージのテキスト
const errorMessageText = computed(() => {
  const displayValue = String(calculator.display || '')
  if (displayValue.includes('括弧の対応')) {
    return '括弧の対応が正しくありません'
  }
  if (displayValue.includes('10階層')) {
    return '括弧のネスト階層が10階層を超えています'
  }
  if (displayValue === 'Error' || displayValue.includes('Division by zero')) {
    return 'ゼロで除算することはできません'
  }
  return displayValue
})

// 式入力モードの状態
const isExpressionMode = ref(false)

// 関数ボタンの処理
const handleFunction = (funcName: string) => {
  isExpressionMode.value = true
  const currentDisplay = calculator.display.replace(/,/g, '') // カンマを除去
  
  // エラー状態の場合はリセット
  if (currentDisplay === 'Error' || isError.value) {
    calculator.display = `${funcName}(`
  } else if (currentDisplay === '0') {
    calculator.display = `${funcName}(`
  } else {
    // 数値の後に関数を追加
    calculator.display = `${currentDisplay}${funcName}(`
  }
  
  // 式文字列を更新
  updateExpressionString()
}

// 括弧の処理
const handleParenthesis = (paren: string) => {
  isExpressionMode.value = true
  const currentDisplay = calculator.display.replace(/,/g, '') // カンマを除去
  
  if (currentDisplay === 'Error' || isError.value) {
    calculator.display = paren === '(' ? '(' : '0'
  } else if (currentDisplay === '0' && paren === '(') {
    calculator.display = '('
  } else if (currentDisplay === '0' && paren === ')') {
    // 閉じ括弧は無視
    return
  } else {
    calculator.display = `${currentDisplay}${paren}`
  }
  
  // 式文字列を更新
  updateExpressionString()
}

// 式文字列を更新
const updateExpressionString = () => {
  const currentDisplay = calculator.display.replace(/,/g, '')
  calculator.setExpressionString(currentDisplay)
}

// 式入力モード用のハンドラー
const handleNumberInExpression = (digit: string) => {
  const currentDisplay = calculator.display.replace(/,/g, '')
  if (currentDisplay === '0' || currentDisplay === 'Error' || isError.value) {
    calculator.display = digit
  } else {
    calculator.display = `${currentDisplay}${digit}`
  }
  updateExpressionString()
}

const handleOperatorInExpression = (operator: string) => {
  const currentDisplay = calculator.display.replace(/,/g, '')
  calculator.display = `${currentDisplay}${operator}`
  updateExpressionString()
}

// 小数点入力の処理
const handleDecimal = () => {
  if (isExpressionMode.value) {
    // 式入力モードの場合は式文字列に追加
    const currentDisplay = calculator.display.replace(/,/g, '')
    if (!currentDisplay.includes('.')) {
      calculator.display = `${currentDisplay}.`
      updateExpressionString()
    }
  } else {
    calculator.handleDecimal()
  }
}

// 数字ボタンのハンドラー（式入力モードを考慮）
const handleNumberButton = (digit: string) => {
  if (isExpressionMode.value) {
    handleNumberInExpression(digit)
  } else {
    calculator.handleNumber(digit)
  }
}

// 演算子ボタンのハンドラー（式入力モードを考慮）
const handleOperatorButton = (operator: string) => {
  if (isExpressionMode.value) {
    handleOperatorInExpression(operator)
  } else {
    calculator.handleOperator(operator)
  }
}

// クリア時に式入力モードもリセット
const handleClearButton = () => {
  isExpressionMode.value = false
  calculator.handleClear()
}

// イコール時に式入力モードをリセット
const handleEqualsButton = () => {
  calculator.handleEquals()
  isExpressionMode.value = false
}

// パーセント機能
const handlePercent = () => {
  const currentValue = parseFloat(calculator.display.replace(/,/g, ''))
  if (!isNaN(currentValue)) {
    const percentValue = currentValue / 100
    calculator.display = percentValue.toString()
    if (isExpressionMode.value) {
      updateExpressionString()
    }
  }
}

// 符号反転機能（±）
const handleToggleSign = () => {
  const currentDisplay = calculator.display.replace(/,/g, '')
  if (currentDisplay === '0' || currentDisplay === 'Error' || isError.value) {
    return
  }
  
  if (currentDisplay.startsWith('-')) {
    calculator.display = currentDisplay.substring(1)
  } else {
    calculator.display = `-${currentDisplay}`
  }
  
  if (isExpressionMode.value) {
    updateExpressionString()
  }
}
</script>

<style scoped>
.calculator-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.history-panel {
  width: 300px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-header {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.history-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.btn-clear-history {
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-clear-history:hover {
  background: #c0392b;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.history-item {
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid #e0e0e0;
}

.history-item:hover {
  background: #f0f0f0;
}

.history-expression {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 4px;
  word-break: break-all;
}

.history-result {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.history-empty {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
}

.calculator-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  padding: 20px;
  overflow-y: auto;
}

.calculator {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
}


.display-container {
  margin-bottom: 20px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #fcc;
}

.display {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  text-align: right;
  font-size: 2.5rem;
  font-weight: 300;
  border-radius: 8px;
  min-height: 60px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.memory-indicator {
  position: absolute;
  top: 25px;
  right: 25px;
  background: #27ae60;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.angle-unit-indicator {
  position: absolute;
  top: 25px;
  left: 25px;
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
}

.function-library {
  margin-bottom: 15px;
}

.btn-toggle-functions {
  width: 100%;
  padding: 10px;
  background: #ecf0f1;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.btn-toggle-functions:hover {
  background: #d5dbdb;
}

.function-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 10px;
}

.function-library-panel {
  margin-top: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.function-library-panel .function-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.btn-history {
  background: #95a5a6;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(149, 165, 166, 0.3);
}

.btn-history:hover {
  background: #7f8c8d;
  box-shadow: 0 3px 6px rgba(149, 165, 166, 0.4);
}

.btn-history:active {
  background: #6c7a7b;
  box-shadow: none;
}

.btn {
  padding: 20px;
  font-size: 1.5rem;
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

.btn-function {
  background: #e74c3c;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
}

.btn-function:hover {
  background: #d62c1a;
  box-shadow: 0 3px 6px rgba(231, 76, 60, 0.4);
}

.btn-function:active {
  background: #c0392b;
  box-shadow: none;
}

.btn-operator {
  background: #3498db;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

.btn-operator:hover {
  background: #2980b9;
  box-shadow: 0 3px 6px rgba(52, 152, 219, 0.4);
}

.btn-operator:active {
  background: #21618c;
  box-shadow: none;
}

.btn-memory {
  background: #9b59b6;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(155, 89, 182, 0.3);
}

.btn-memory:hover {
  background: #8e44ad;
  box-shadow: 0 3px 6px rgba(155, 89, 182, 0.4);
}

.btn-memory:active {
  background: #7d3c98;
  box-shadow: none;
}

.btn-equals {
  background: #27ae60;
  color: white;
  font-weight: 600;
  grid-row: span 2;
  box-shadow: 0 2px 4px rgba(39, 174, 96, 0.3);
}

.btn-equals:hover {
  background: #229954;
  box-shadow: 0 3px 6px rgba(39, 174, 96, 0.4);
}

.btn-equals:active {
  background: #1e8449;
  box-shadow: none;
}

.btn-zero {
  grid-column: span 1;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .calculator-container {
    flex-direction: column;
  }

  .history-panel {
    width: 100%;
    height: 200px;
  }

  .calculator-panel {
    flex: 1;
  }
}
</style>
