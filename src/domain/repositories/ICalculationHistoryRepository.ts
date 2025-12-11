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
   * すべての履歴を取得（時系列順、新しいものが先頭）
   */
  getAll(): CalculationHistory[]

  /**
   * 履歴をクリア
   */
  clear(): void

  /**
   * 履歴の件数を取得
   */
  count(): number
}
