import type { ICalculationHistoryRepository } from '../../domain/repositories/ICalculationHistoryRepository'
import { CalculationHistory } from '../../domain/entities/CalculationHistory'

/**
 * 計算履歴を保存するユースケース
 */
export class SaveHistoryUseCase {
  constructor(private readonly historyRepository: ICalculationHistoryRepository) {}

  execute(expression: string, result: string): void {
    const history = CalculationHistory.create(expression, result)
    this.historyRepository.save(history)
  }
}
