import type { IMemoryRepository } from '../../domain/repositories/IMemoryRepository'
import type { MemoryStorage } from '../../domain/entities/MemoryStorage'

/**
 * インメモリメモリリポジトリ
 * メモリデータをメモリ上に保持（リロードでリセット）
 */
export class InMemoryMemoryRepository implements IMemoryRepository {
  private memory: MemoryStorage | null = null

  /**
   * メモリを保存
   */
  save(memory: MemoryStorage): void {
    this.memory = memory
  }

  /**
   * メモリを取得
   */
  get(): MemoryStorage | null {
    return this.memory
  }

  /**
   * メモリをクリア
   */
  clear(): void {
    this.memory = null
  }
}

