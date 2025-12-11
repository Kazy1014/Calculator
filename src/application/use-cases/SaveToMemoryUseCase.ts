import type { IMemoryRepository } from '../../domain/repositories/IMemoryRepository'
import { Memory } from '../../domain/value-objects/Memory'

/**
 * メモリに保存するユースケース（ACボタンで実行）
 */
export class SaveToMemoryUseCase {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(value: number): void {
    const memory = Memory.fromValue(value)
    this.memoryRepository.save(memory)
  }
}
