import type { ICalculationHistoryRepository } from '../../../domain/repositories/ICalculationHistoryRepository'
import type { HistoryEntryDTO } from '../../dto/HistoryEntryDTO'

/**
 * 履歴取得ユースケース
 */
export class GetHistoryUseCase {
  constructor(
    private readonly historyRepository: ICalculationHistoryRepository
  ) {}

  /**
   * 履歴を取得
   */
  execute(): HistoryEntryDTO[] {
    const history = this.historyRepository.get()
    
    if (!history) {
      return []
    }

    return history.getEntries().map(entry => ({
      id: entry.getId(),
      expression: entry.getExpression().getValue(),
      result: entry.getResult(),
      formattedExpression: entry.getFormattedExpression(),
      formattedResult: entry.getFormattedResult(),
      timestamp: entry.getTimestamp()
    }))
  }
}

