import { InMemoryCalculationRepository } from './InMemoryCalculationRepository'
import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'

/**
 * リポジトリファクトリー（シングルトンパターン）
 * アプリケーション全体で単一のリポジトリインスタンスを共有
 */
class CalculationRepositoryFactory {
  private static instance: ICalculationRepository | null = null

  static getInstance(): ICalculationRepository {
    if (!this.instance) {
      this.instance = new InMemoryCalculationRepository()
    }
    return this.instance
  }

  // テスト用：インスタンスをリセット
  static reset(): void {
    this.instance = null
  }
}

export { CalculationRepositoryFactory }

