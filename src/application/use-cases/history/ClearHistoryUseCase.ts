import type { ICalculationHistoryRepository } from '../../../domain/repositories/ICalculationHistoryRepository'

/**
 * 履歴クリアユースケース
 */
export class ClearHistoryUseCase {
  constructor(
    private readonly historyRepository: ICalculationHistoryRepository
  ) {}

  /**
   * 履歴をクリア
   */
  execute(): void {
    this.historyRepository.clear()
  }
}

