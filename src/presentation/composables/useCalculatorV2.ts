import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Expression } from '../../domain/value-objects/Expression'
import { InMemoryHistoryRepository } from '../../infrastructure/repositories/InMemoryHistoryRepository'
import { InMemoryMemoryRepository } from '../../infrastructure/repositories/InMemoryMemoryRepository'
import { ScientificCalculator } from '../../domain/services/ScientificCalculator'
import { InputCharacterUseCase } from '../../application/use-cases/calculation/InputCharacterUseCase'
import { EvaluateExpressionUseCase } from '../../application/use-cases/calculation/EvaluateExpressionUseCase'
import { BackspaceUseCase } from '../../application/use-cases/calculation/BackspaceUseCase'
import { ClearInputUseCase } from '../../application/use-cases/calculation/ClearInputUseCase'
import { GetHistoryUseCase } from '../../application/use-cases/history/GetHistoryUseCase'
import { ClearHistoryUseCase } from '../../application/use-cases/history/ClearHistoryUseCase'
import { ReplayHistoryEntryUseCase } from '../../application/use-cases/history/ReplayHistoryEntryUseCase'
import { SaveToMemoryUseCase } from '../../application/use-cases/memory/SaveToMemoryUseCase'
import { RecallFromMemoryUseCase } from '../../application/use-cases/memory/RecallFromMemoryUseCase'
import { ClearMemoryUseCase } from '../../application/use-cases/memory/ClearMemoryUseCase'
import { CalculateScientificFunctionUseCase } from '../../application/use-cases/scientific/CalculateScientificFunctionUseCase'
import { ToggleAngleModeUseCase } from '../../application/use-cases/scientific/ToggleAngleModeUseCase'
import { ConvertUnitUseCase } from '../../application/use-cases/conversion/ConvertUnitUseCase'
import type { HistoryEntryDTO } from '../../application/dto/HistoryEntryDTO'
import { AngleMode } from '../../domain/value-objects/AngleMode'
import type { UnitType } from '../../domain/value-objects/Unit'

// グローバルリポジトリ
let globalHistoryRepository: InMemoryHistoryRepository | null = null
let globalMemoryRepository: InMemoryMemoryRepository | null = null
let globalScientificCalculator: ScientificCalculator | null = null

function getHistoryRepository(): InMemoryHistoryRepository {
  if (!globalHistoryRepository) {
    globalHistoryRepository = new InMemoryHistoryRepository()
  }
  return globalHistoryRepository
}

function getMemoryRepository(): InMemoryMemoryRepository {
  if (!globalMemoryRepository) {
    globalMemoryRepository = new InMemoryMemoryRepository()
  }
  return globalMemoryRepository
}

function getScientificCalculator(): ScientificCalculator {
  if (!globalScientificCalculator) {
    globalScientificCalculator = new ScientificCalculator()
  }
  return globalScientificCalculator
}

/**
 * テスト用にリポジトリをリセット
 */
export function resetCalculatorV2Repository(): void {
  globalHistoryRepository = null
  globalMemoryRepository = null
  globalScientificCalculator = null
}

/**
 * 高度な電卓機能を提供するComposable（v2）
 */
export function useCalculatorV2() {
  // State
  const currentExpression = ref(Expression.empty())
  const displayValue = ref('0')
  const errorMessage = ref<string | null>(null)
  const history = ref<HistoryEntryDTO[]>([])
  const memoryHasValue = ref(false)
  const angleMode = ref<AngleMode>(AngleMode.DEGREE)

  // Repositories
  const historyRepository = getHistoryRepository()
  const memoryRepository = getMemoryRepository()
  const scientificCalculator = getScientificCalculator()

  // Use Cases - Calculation
  const inputCharacterUseCase = new InputCharacterUseCase()
  const evaluateExpressionUseCase = new EvaluateExpressionUseCase(historyRepository)
  const backspaceUseCase = new BackspaceUseCase()
  const clearInputUseCase = new ClearInputUseCase()

  // Use Cases - History
  const getHistoryUseCase = new GetHistoryUseCase(historyRepository)
  const clearHistoryUseCase = new ClearHistoryUseCase(historyRepository)
  const replayHistoryEntryUseCase = new ReplayHistoryEntryUseCase(historyRepository)

  // Use Cases - Memory
  const saveToMemoryUseCase = new SaveToMemoryUseCase(memoryRepository)
  const recallFromMemoryUseCase = new RecallFromMemoryUseCase(memoryRepository)
  const clearMemoryUseCase = new ClearMemoryUseCase(memoryRepository)

  // Use Cases - Scientific
  const calculateScientificFunctionUseCase = new CalculateScientificFunctionUseCase(scientificCalculator)
  const toggleAngleModeUseCase = new ToggleAngleModeUseCase(scientificCalculator)

  // Use Cases - Conversion
  const convertUnitUseCase = new ConvertUnitUseCase()

  // Computed
  const expressionText = computed(() => currentExpression.value.getValue() || '0')

  // Actions - Input
  const inputCharacter = (char: string) => {
    const result = inputCharacterUseCase.execute(currentExpression.value, char)
    // 入力中は括弧のバランスが取れていなくてもOK
    currentExpression.value = currentExpression.value.append(char)
    displayValue.value = result.displayValue
    errorMessage.value = result.error
  }

  const backspace = () => {
    const result = backspaceUseCase.execute(currentExpression.value)
    // バックスペース後も括弧のバランスが取れていなくてもOK
    currentExpression.value = currentExpression.value.backspace()
    displayValue.value = result.displayValue
    errorMessage.value = result.error
  }

  const clear = () => {
    const result = clearInputUseCase.execute()
    currentExpression.value = Expression.empty()
    displayValue.value = result.displayValue
    errorMessage.value = result.error
  }

  const evaluate = () => {
    const result = evaluateExpressionUseCase.execute(currentExpression.value)
    
    if (result.calculated && result.result !== null) {
      currentExpression.value = Expression.empty()
      displayValue.value = result.displayValue
      errorMessage.value = result.error
      
      // 履歴を更新
      refreshHistory()
    } else {
      displayValue.value = result.displayValue
      errorMessage.value = result.error
    }
  }

  // Actions - History
  const refreshHistory = () => {
    history.value = getHistoryUseCase.execute()
  }

  const clearHistory = () => {
    clearHistoryUseCase.execute()
    refreshHistory()
  }

  const replayHistoryEntry = (entryId: string) => {
    const result = replayHistoryEntryUseCase.execute(entryId)
    if (result) {
      // 履歴から復元する場合、括弧は完全な式なのでcreateを使用
      try {
        currentExpression.value = Expression.create(result.expression)
      } catch (e) {
        // エラーの場合は空の式にする
        currentExpression.value = Expression.empty()
      }
      displayValue.value = result.displayValue
      errorMessage.value = result.error
    }
  }

  // Actions - Memory
  const saveToMemory = (value: number) => {
    const result = saveToMemoryUseCase.execute(value)
    memoryHasValue.value = result.hasValue
  }

  const recallFromMemory = () => {
    const result = recallFromMemoryUseCase.execute()
    if (result.hasValue && result.value !== null) {
      inputCharacter(result.value.toString())
    }
  }

  const clearMemory = () => {
    const result = clearMemoryUseCase.execute()
    memoryHasValue.value = result.hasValue
  }

  // Actions - Scientific
  const calculateScientificFunction = (functionName: string, value: number) => {
    const result = calculateScientificFunctionUseCase.execute(functionName, value)
    if (result.calculated && result.result !== null) {
      currentExpression.value = Expression.empty()
      displayValue.value = result.displayValue
      errorMessage.value = result.error
    } else {
      errorMessage.value = result.error
    }
  }

  const toggleAngleMode = () => {
    angleMode.value = toggleAngleModeUseCase.execute()
  }

  // Actions - Conversion
  const convertUnit = (value: number, fromUnit: UnitType, toUnit: UnitType) => {
    try {
      return convertUnitUseCase.execute(value, fromUnit, toUnit)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '変換エラー'
      return null
    }
  }

  // Keyboard handling
  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key

    // 数字キー
    if (key >= '0' && key <= '9') {
      inputCharacter(key)
      return
    }

    // 演算子キー
    if (['+', '-', '*', '/'].includes(key)) {
      inputCharacter(key)
      return
    }

    // 小数点
    if (key === '.') {
      inputCharacter(key)
      return
    }

    // 括弧
    if (key === '(' || key === ')') {
      inputCharacter(key)
      return
    }

    // バックスペース
    if (key === 'Backspace') {
      event.preventDefault()
      backspace()
      return
    }

    // イコール（Enter または =）
    if (key === 'Enter' || key === '=') {
      event.preventDefault()
      evaluate()
      return
    }

    // クリア（Escape または c または C）
    if (key === 'Escape' || key.toLowerCase() === 'c') {
      clear()
      return
    }
  }

  // Lifecycle
  onMounted(() => {
    refreshHistory()
    window.addEventListener('keydown', handleKeyPress)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })

  return {
    // State
    expressionText,
    displayValue,
    errorMessage,
    history,
    memoryHasValue,
    angleMode,

    // Actions - Input
    inputCharacter,
    backspace,
    clear,
    evaluate,

    // Actions - History
    refreshHistory,
    clearHistory,
    replayHistoryEntry,

    // Actions - Memory
    saveToMemory,
    recallFromMemory,
    clearMemory,

    // Actions - Scientific
    calculateScientificFunction,
    toggleAngleMode,

    // Actions - Conversion
    convertUnit
  }
}

