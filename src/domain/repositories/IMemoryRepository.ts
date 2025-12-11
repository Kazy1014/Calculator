import type { Memory } from '../value-objects/Memory'

/**
 * メモリリポジトリのインターフェース
 */
export interface IMemoryRepository {
  /**
   * メモリを取得
   */
  get(): Memory

  /**
   * メモリを保存
   */
  save(memory: Memory): void

  /**
   * メモリをクリア
   */
  clear(): void
}
