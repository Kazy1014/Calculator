import type { IMemoryRepository } from '../../../domain/repositories/IMemoryRepository'
import type { MemoryStateDTO } from '../../dto/MemoryStateDTO'

/**
 * メモリクリアユースケース（MC: Memory Clear）
 * メモリをクリア
 */
export class ClearMemoryUseCase {
  constructor(
    private readonly memoryRepository: IMemoryRepository
  ) {}

  /**
   * メモリをクリア
   */
  execute(): MemoryStateDTO {
    this.memoryRepository.clear()

    return {
      hasValue: false,
      value: null,
      displayValue: '0'
    }
  }
}

