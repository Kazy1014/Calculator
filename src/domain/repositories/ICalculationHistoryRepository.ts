import type { CalculationHistory } from '../entities/CalculationHistory'

/**
 * 計算履歴リポジトリのインターフェース
 */
export interface ICalculationHistoryRepository {
  /**
   * 履歴を保存
   */
  save(history: CalculationHistory): void

  /**
   * 履歴を取得
   */
  get(): CalculationHistory | null

  /**
   * 履歴をクリア
   */
  clear(): void
}

