import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import type { Calculation } from '../../domain/entities/Calculation'

/**
 * インメモリ計算リポジトリ
 * 計算状態をメモリ上に保持（リロードでリセット）
 */
export class InMemoryCalculationRepository implements ICalculationRepository {
  private currentCalculation: Calculation | null = null

  save(calculation: Calculation): void {
    this.currentCalculation = calculation
  }

  getCurrent(): Calculation | null {
    return this.currentCalculation
  }

  clear(): void {
    this.currentCalculation = null
  }
}

