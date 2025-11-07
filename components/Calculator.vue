<template>
  <div class="calculator">
    <div class="display" data-testid="display">{{ calculator.display }}</div>
    <div class="buttons">
      <button
        class="btn btn-function"
        data-testid="btn-clear"
        @click="calculator.handleClear"
      >
        C
      </button>
      <button class="btn btn-operator" data-testid="btn-divide" @click="calculator.handleOperator('/')">
        ÷
      </button>
      <button class="btn btn-operator" data-testid="btn-multiply" @click="calculator.handleOperator('*')">
        ×
      </button>
      <button class="btn btn-operator" data-testid="btn-subtract" @click="calculator.handleOperator('-')">
        -
      </button>

      <button class="btn" data-testid="btn-7" @click="calculator.handleNumber('7')">7</button>
      <button class="btn" data-testid="btn-8" @click="calculator.handleNumber('8')">8</button>
      <button class="btn" data-testid="btn-9" @click="calculator.handleNumber('9')">9</button>
      <button
        class="btn btn-operator btn-add"
        data-testid="btn-add"
        @click="calculator.handleOperator('+')"
      >
        +
      </button>

      <button class="btn" data-testid="btn-4" @click="calculator.handleNumber('4')">4</button>
      <button class="btn" data-testid="btn-5" @click="calculator.handleNumber('5')">5</button>
      <button class="btn" data-testid="btn-6" @click="calculator.handleNumber('6')">6</button>

      <button class="btn" data-testid="btn-1" @click="calculator.handleNumber('1')">1</button>
      <button class="btn" data-testid="btn-2" @click="calculator.handleNumber('2')">2</button>
      <button class="btn" data-testid="btn-3" @click="calculator.handleNumber('3')">3</button>
      <button
        class="btn btn-equals"
        data-testid="btn-equals"
        @click="calculator.handleEquals"
      >
        =
      </button>

      <button class="btn btn-zero" data-testid="btn-0" @click="calculator.handleNumber('0')">
        0
      </button>
      <button class="btn" data-testid="btn-decimal" @click="calculator.handleDecimal">.</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalculator } from '~/src/presentation/composables/useCalculator'

// DDDアーキテクチャのComposableを使用
const calculator = useCalculator()
</script>

<style scoped>
.calculator {
  max-width: 320px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.display {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  text-align: right;
  font-size: 2.5rem;
  font-weight: 300;
  border-radius: 8px;
  margin-bottom: 20px;
  min-height: 60px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 10px;
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

.btn-add {
  grid-row: span 2;
}

.btn-zero {
  grid-column: span 2;
}

/* レスポンシブ対応 */
@media (max-width: 400px) {
  .calculator {
    max-width: 100%;
    padding: 15px;
  }

  .display {
    font-size: 2rem;
    padding: 15px;
  }

  .btn {
    padding: 15px;
    font-size: 1.2rem;
  }
}
</style>

