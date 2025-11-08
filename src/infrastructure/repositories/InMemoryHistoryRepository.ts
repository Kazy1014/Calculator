import type { ICalculationHistoryRepository } from '../../domain/repositories/ICalculationHistoryRepository'
import type { CalculationHistory } from '../../domain/entities/CalculationHistory'

/**
 * インメモリ計算履歴リポジトリ
 * 履歴をメモリ上に保持（リロードでリセット）
 */
export class InMemoryHistoryRepository implements ICalculationHistoryRepository {
  private history: CalculationHistory | null = null

  /**
   * 履歴を保存
   */
  save(history: CalculationHistory): void {
    this.history = history
  }

  /**
   * 履歴を取得
   */
  get(): CalculationHistory | null {
    return this.history
  }

  /**
   * 履歴をクリア
   */
  clear(): void {
    this.history = null
  }
}

