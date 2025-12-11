import type { IMemoryRepository } from '../../domain/repositories/IMemoryRepository'
import { Memory } from '../../domain/value-objects/Memory'

/**
 * メモリに加算するユースケース（M+）
 */
export class AddToMemoryUseCase {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(value: number): void {
    const currentMemory = this.memoryRepository.get()
    const newMemory = currentMemory.add(value)
    this.memoryRepository.save(newMemory)
  }
}
