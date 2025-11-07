import type { Calculation } from '../entities/Calculation'

/**
 * 計算リポジトリのインターフェース
 * ドメイン層でインターフェースを定義し、インフラ層で実装する（依存性逆転の原則）
 */
export interface ICalculationRepository {
  /**
   * 現在の計算を保存
   */
  save(calculation: Calculation): void

  /**
   * 現在の計算を取得
   */
  getCurrent(): Calculation | null

  /**
   * 計算をクリア
   */
  clear(): void
}

