import type { IMemoryRepository } from '../../domain/repositories/IMemoryRepository'
import { Memory } from '../../domain/value-objects/Memory'

/**
 * インメモリメモリリポジトリ
 */
export class InMemoryMemoryRepository implements IMemoryRepository {
  private memory: Memory = Memory.empty()

  get(): Memory {
    return this.memory
  }

  save(memory: Memory): void {
    this.memory = memory
  }

  clear(): void {
    this.memory = Memory.empty()
  }
}
