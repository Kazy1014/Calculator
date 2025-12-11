import type { ICalculationHistoryRepository } from '../../domain/repositories/ICalculationHistoryRepository'

/**
 * 計算履歴をクリアするユースケース
 */
export class ClearHistoryUseCase {
  constructor(private readonly historyRepository: ICalculationHistoryRepository) {}

  execute(): void {
    this.historyRepository.clear()
  }
}
