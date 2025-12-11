import type { ICalculationHistoryRepository } from '../../domain/repositories/ICalculationHistoryRepository'
import type { CalculationHistory } from '../../domain/entities/CalculationHistory'

/**
 * インメモリ計算履歴リポジトリ
 * 最低20件の履歴を保持
 */
export class InMemoryCalculationHistoryRepository implements ICalculationHistoryRepository {
  private readonly MAX_HISTORY_COUNT = 20
  private histories: CalculationHistory[] = []

  save(history: CalculationHistory): void {
    // 新しい履歴を先頭に追加
    this.histories.unshift(history)
    
    // 20件を超える場合は古いものを削除
    if (this.histories.length > this.MAX_HISTORY_COUNT) {
      this.histories = this.histories.slice(0, this.MAX_HISTORY_COUNT)
    }
  }

  getAll(): CalculationHistory[] {
    return [...this.histories]
  }

  clear(): void {
    this.histories = []
  }

  count(): number {
    return this.histories.length
  }
}
