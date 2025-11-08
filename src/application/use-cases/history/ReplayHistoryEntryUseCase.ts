import type { ICalculationHistoryRepository } from '../../../domain/repositories/ICalculationHistoryRepository'
import { Expression } from '../../../domain/value-objects/Expression'
import type { CalculationResultDTO } from '../../dto/CalculationResultDTO'

/**
 * 履歴再生ユースケース
 * 履歴から数式を選択して再入力
 */
export class ReplayHistoryEntryUseCase {
  constructor(
    private readonly historyRepository: ICalculationHistoryRepository
  ) {}

  /**
   * 履歴エントリを再生
   */
  execute(entryId: string): CalculationResultDTO | null {
    const history = this.historyRepository.get()
    
    if (!history) {
      return null
    }

    const entry = history.getEntryById(entryId)
    
    if (!entry) {
      return null
    }

    const expression = entry.getExpression()

    return {
      expression: expression.getValue(),
      result: null,
      displayValue: expression.getValue(),
      error: null,
      calculated: false
    }
  }
}

