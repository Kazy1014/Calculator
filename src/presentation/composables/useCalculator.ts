import { ref, onMounted, onUnmounted } from 'vue'
import { InMemoryCalculationRepository } from '../../infrastructure/repositories/InMemoryCalculationRepository'
import { InMemoryCalculationHistoryRepository } from '../../infrastructure/repositories/InMemoryCalculationHistoryRepository'
import { InMemoryMemoryRepository } from '../../infrastructure/repositories/InMemoryMemoryRepository'
import { InputNumberUseCase } from '../../application/use-cases/InputNumberUseCase'
import { InputDecimalUseCase } from '../../application/use-cases/InputDecimalUseCase'
import { InputOperatorUseCase } from '../../application/use-cases/InputOperatorUseCase'
import { CalculateUseCase } from '../../application/use-cases/CalculateUseCase'
import { ClearCalculationUseCase } from '../../application/use-cases/ClearCalculationUseCase'
import { GetDisplayValueUseCase } from '../../application/use-cases/GetDisplayValueUseCase'
import { BackspaceUseCase } from '../../application/use-cases/BackspaceUseCase'
import { SaveToMemoryUseCase } from '../../application/use-cases/SaveToMemoryUseCase'
import { RecallMemoryUseCase } from '../../application/use-cases/RecallMemoryUseCase'
import { AddToMemoryUseCase } from '../../application/use-cases/AddToMemoryUseCase'
import { SubtractFromMemoryUseCase } from '../../application/use-cases/SubtractFromMemoryUseCase'
import { ClearMemoryUseCase } from '../../application/use-cases/ClearMemoryUseCase'
import { SaveHistoryUseCase } from '../../application/use-cases/SaveHistoryUseCase'
import { GetHistoryUseCase } from '../../application/use-cases/GetHistoryUseCase'
import { ClearHistoryUseCase } from '../../application/use-cases/ClearHistoryUseCase'
import { EvaluateExpressionUseCase } from '../../application/use-cases/EvaluateExpressionUseCase'
import { SetAngleUnitUseCase } from '../../application/use-cases/SetAngleUnitUseCase'
import { InputExpressionStringUseCase } from '../../application/use-cases/InputExpressionStringUseCase'
import { AngleUnit } from '../../domain/value-objects/AngleUnit'
import type { CalculationHistory } from '../../domain/entities/CalculationHistory'

// グローバルリポジトリ（ブラウザ環境でのみ共有）
let globalRepository: InMemoryCalculationRepository | null = null
let globalHistoryRepository: InMemoryCalculationHistoryRepository | null = null
let globalMemoryRepository: InMemoryMemoryRepository | null = null

function getRepository(): InMemoryCalculationRepository {
  if (!globalRepository) {
    globalRepository = new InMemoryCalculationRepository()
  }
  return globalRepository
}

function getHistoryRepository(): InMemoryCalculationHistoryRepository {
  if (!globalHistoryRepository) {
    globalHistoryRepository = new InMemoryCalculationHistoryRepository()
  }
  return globalHistoryRepository
}

function getMemoryRepository(): InMemoryMemoryRepository {
  if (!globalMemoryRepository) {
    globalMemoryRepository = new InMemoryMemoryRepository()
  }
  return globalMemoryRepository
}

/**
 * テスト用にリポジトリをリセットする
 */
export function resetCalculatorRepository(): void {
  globalRepository = null
  globalHistoryRepository = null
  globalMemoryRepository = null
}

/**
 * 電卓ロジックを提供するComposable
 * DDDアーキテクチャのプレゼンテーション層
 */
export function useCalculator() {
  const display = ref('0')
  const history = ref<CalculationHistory[]>([])
  const hasMemory = ref(false)
  const angleUnit = ref<'degrees' | 'radians'>('radians')

  // リポジトリとユースケースの初期化（DI）
  const repository = getRepository()
  const historyRepository = getHistoryRepository()
  const memoryRepository = getMemoryRepository()
  
  const inputNumberUseCase = new InputNumberUseCase(repository)
  const inputDecimalUseCase = new InputDecimalUseCase(repository)
  const inputOperatorUseCase = new InputOperatorUseCase(repository)
  const calculateUseCase = new CalculateUseCase(repository)
  const clearCalculationUseCase = new ClearCalculationUseCase(repository)
  const getDisplayValueUseCase = new GetDisplayValueUseCase(repository)
  const backspaceUseCase = new BackspaceUseCase(repository)
  const saveToMemoryUseCase = new SaveToMemoryUseCase(memoryRepository)
  const recallMemoryUseCase = new RecallMemoryUseCase(memoryRepository)
  const addToMemoryUseCase = new AddToMemoryUseCase(memoryRepository)
  const subtractFromMemoryUseCase = new SubtractFromMemoryUseCase(memoryRepository)
  const clearMemoryUseCase = new ClearMemoryUseCase(memoryRepository)
  const saveHistoryUseCase = new SaveHistoryUseCase(historyRepository)
  const getHistoryUseCase = new GetHistoryUseCase(historyRepository)
  const clearHistoryUseCase = new ClearHistoryUseCase(historyRepository)
  const evaluateExpressionUseCase = new EvaluateExpressionUseCase(repository)
  const setAngleUnitUseCase = new SetAngleUnitUseCase()
  const inputExpressionStringUseCase = new InputExpressionStringUseCase(repository)

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
    const currentCalculation = repository.getCurrent()
    let expression = ''
    
    // 式文字列がある場合はそれを使用、なければ現在の表示値を使用
    if (currentCalculation) {
      expression = currentCalculation.getExpressionString()
      if (!expression || expression.trim() === '') {
        // 式文字列がない場合は、通常の計算フローを使用
        // 履歴には現在の表示値と結果を保存
        const currentValue = currentCalculation.getDisplayValue().toString().replace(/,/g, '')
        expression = currentValue
      }
    }
    
    const result = calculateUseCase.execute()
    display.value = result.displayValue
    
    // 履歴に保存（式と結果の両方）
    if (expression && result.displayValue !== 'Error' && !result.displayValue.includes('括弧') && !result.displayValue.includes('エラー')) {
      saveHistoryUseCase.execute(expression, result.displayValue)
      updateHistory()
    }
    
    // 計算後は式文字列をクリア（次の計算のため）
    if (currentCalculation) {
      currentCalculation.setExpressionString('')
      repository.save(currentCalculation)
    }
  }

  // 小数点
  const handleDecimal = () => {
    const result = inputDecimalUseCase.execute()
    display.value = result.displayValue
  }

  // クリア
  const handleClear = () => {
    const currentValue = parseFloat(display.value)
    if (!isNaN(currentValue) && currentValue !== 0) {
      // ACボタンでメモリに保存
      saveToMemoryUseCase.execute(currentValue)
      updateMemoryStatus()
    }
    
    const result = clearCalculationUseCase.execute()
    display.value = result.displayValue
  }

  // バックスペース
  const handleBackspace = () => {
    const result = backspaceUseCase.execute()
    display.value = result.displayValue
  }

  // メモリ操作
  const handleMemoryRecall = () => {
    const result = recallMemoryUseCase.execute()
    display.value = result.displayValue
  }

  const handleMemoryAdd = () => {
    const currentValue = parseFloat(display.value)
    if (!isNaN(currentValue)) {
      addToMemoryUseCase.execute(currentValue)
      updateMemoryStatus()
    }
  }

  const handleMemorySubtract = () => {
    const currentValue = parseFloat(display.value)
    if (!isNaN(currentValue)) {
      subtractFromMemoryUseCase.execute(currentValue)
      updateMemoryStatus()
    }
  }

  const handleMemoryClear = () => {
    clearMemoryUseCase.execute()
    updateMemoryStatus()
  }

  // 履歴操作
  const updateHistory = () => {
    history.value = getHistoryUseCase.execute()
  }

  const handleHistoryClick = (historyItem: CalculationHistory) => {
    // 履歴の式を再入力（式文字列として設定）
    const expression = historyItem.getExpression()
    const result = inputExpressionStringUseCase.execute(expression)
    display.value = result.displayValue
  }

  const handleClearHistory = () => {
    clearHistoryUseCase.execute()
    updateHistory()
  }

  // メモリ状態の更新
  const updateMemoryStatus = () => {
    const memory = memoryRepository.get()
    hasMemory.value = !memory.isEmpty()
  }

  // 角度単位の切り替え
  const handleToggleAngleUnit = () => {
    if (angleUnit.value === 'degrees') {
      angleUnit.value = 'radians'
      setAngleUnitUseCase.execute(AngleUnit.radians())
    } else {
      angleUnit.value = 'degrees'
      setAngleUnitUseCase.execute(AngleUnit.degrees())
    }
  }

  // 式文字列を設定
  const setExpressionString = (expression: string) => {
    const result = inputExpressionStringUseCase.execute(expression)
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

    // バックスペース（Backspace または Delete）
    if (key === 'Backspace' || key === 'Delete') {
      event.preventDefault()
      handleBackspace()
      return
    }
  }

  // ライフサイクル
  onMounted(() => {
    initialize()
    updateHistory()
    updateMemoryStatus()
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })

  return {
    display,
    history,
    hasMemory,
    angleUnit,
    handleNumber,
    handleOperator,
    handleEquals,
    handleDecimal,
    handleClear,
    handleBackspace,
    handleMemoryRecall,
    handleMemoryAdd,
    handleMemorySubtract,
    handleMemoryClear,
    handleHistoryClick,
    handleClearHistory,
    handleToggleAngleUnit,
    setExpressionString
  }
}

