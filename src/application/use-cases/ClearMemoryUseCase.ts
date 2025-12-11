import type { IMemoryRepository } from '../../domain/repositories/IMemoryRepository'
import { Memory } from '../../domain/value-objects/Memory'

/**
 * メモリをクリアするユースケース（MC）
 */
export class ClearMemoryUseCase {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(): void {
    this.memoryRepository.clear()
  }
}
