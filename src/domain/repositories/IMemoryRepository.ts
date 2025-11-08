import type { MemoryStorage } from '../entities/MemoryStorage'

/**
 * メモリリポジトリのインターフェース
 */
export interface IMemoryRepository {
  /**
   * メモリを保存
   */
  save(memory: MemoryStorage): void

  /**
   * メモリを取得
   */
  get(): MemoryStorage | null

  /**
   * メモリをクリア
   */
  clear(): void
}

