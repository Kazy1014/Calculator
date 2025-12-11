import type { IMemoryRepository } from '../../domain/repositories/IMemoryRepository'
import { Memory } from '../../domain/value-objects/Memory'

/**
 * メモリから減算するユースケース（M-）
 */
export class SubtractFromMemoryUseCase {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(value: number): void {
    const currentMemory = this.memoryRepository.get()
    const newMemory = currentMemory.subtract(value)
    this.memoryRepository.save(newMemory)
  }
}
