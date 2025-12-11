import type { ICalculationHistoryRepository } from '../../domain/repositories/ICalculationHistoryRepository'
import type { CalculationHistory } from '../../domain/entities/CalculationHistory'

/**
 * 計算履歴を取得するユースケース
 */
export class GetHistoryUseCase {
  constructor(private readonly historyRepository: ICalculationHistoryRepository) {}

  execute(): CalculationHistory[] {
    return this.historyRepository.getAll()
  }
}
