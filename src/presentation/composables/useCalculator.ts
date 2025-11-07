import { ref, onMounted, onUnmounted } from 'vue'
import { InMemoryCalculationRepository } from '../../infrastructure/repositories/InMemoryCalculationRepository'
import { InputNumberUseCase } from '../../application/use-cases/InputNumberUseCase'
import { InputDecimalUseCase } from '../../application/use-cases/InputDecimalUseCase'
import { InputOperatorUseCase } from '../../application/use-cases/InputOperatorUseCase'
import { CalculateUseCase } from '../../application/use-cases/CalculateUseCase'
import { ClearCalculationUseCase } from '../../application/use-cases/ClearCalculationUseCase'
import { GetDisplayValueUseCase } from '../../application/use-cases/GetDisplayValueUseCase'

// グローバルリポジトリ（ブラウザ環境でのみ共有）
let globalRepository: InMemoryCalculationRepository | null = null

function getRepository(): InMemoryCalculationRepository {
  if (!globalRepository) {
    globalRepository = new InMemoryCalculationRepository()
  }
  return globalRepository
}

/**
 * テスト用にリポジトリをリセットする
 */
export function resetCalculatorRepository(): void {
  globalRepository = null
}

/**
 * 電卓ロジックを提供するComposable
 * DDDアーキテクチャのプレゼンテーション層
 */
export function useCalculator() {
  const display = ref('0')

  // リポジトリとユースケースの初期化（DI）
  const repository = getRepository()
  const inputNumberUseCase = new InputNumberUseCase(repository)
  const inputDecimalUseCase = new InputDecimalUseCase(repository)
  const inputOperatorUseCase = new InputOperatorUseCase(repository)
  const calculateUseCase = new CalculateUseCase(repository)
  const clearCalculationUseCase = new ClearCalculationUseCase(repository)
  const getDisplayValueUseCase = new GetDisplayValueUseCase(repository)

  // 初期化
  const initialize = () => {
    const result = getDisplayValueUseCase.execute()
    display.value = result.displayValue
  }

  // 数字入力
  const handleNumber = (digit: string) => {
    const result = inputNumberUseCase.execute(digit)
    display.value = result.displayValue
  }

  // 演算子入力
  const handleOperator = (operator: string) => {
    const result = inputOperatorUseCase.execute(operator)
    display.value = result.displayValue
  }

  // イコール
  const handleEquals = () => {
    const result = calculateUseCase.execute()
    display.value = result.displayValue
  }

  // 小数点
  const handleDecimal = () => {
    const result = inputDecimalUseCase.execute()
    display.value = result.displayValue
  }

  // クリア
  const handleClear = () => {
    const result = clearCalculationUseCase.execute()
    display.value = result.displayValue
  }

  // キーボード入力処理
  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key

    // 数字キー
    if (key >= '0' && key <= '9') {
      handleNumber(key)
      return
    }

    // 演算子キー
    if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleOperator(key)
      return
    }

    // 小数点
    if (key === '.' || key === ',') {
      handleDecimal()
      return
    }

    // イコール（Enter または =）
    if (key === 'Enter' || key === '=') {
      event.preventDefault()
      handleEquals()
      return
    }

    // クリア（Escape または c または C）
    if (key === 'Escape' || key.toLowerCase() === 'c') {
      handleClear()
      return
    }
  }

  // ライフサイクル
  onMounted(() => {
    initialize()
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })

  return {
    display,
    handleNumber,
    handleOperator,
    handleEquals,
    handleDecimal,
    handleClear
  }
}

