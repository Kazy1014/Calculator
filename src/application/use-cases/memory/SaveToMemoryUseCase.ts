import type { IMemoryRepository } from '../../../domain/repositories/IMemoryRepository'
import { MemoryStorage } from '../../../domain/entities/MemoryStorage'
import type { MemoryStateDTO } from '../../dto/MemoryStateDTO'
import { NumberFormatter } from '../../../domain/services/NumberFormatter'

/**
 * メモリ保存ユースケース（AC: All Clear and Save）
 * 現在の値をメモリに保存
 */
export class SaveToMemoryUseCase {
  private readonly formatter: NumberFormatter

  constructor(
    private readonly memoryRepository: IMemoryRepository
  ) {
    this.formatter = new NumberFormatter()
  }

  /**
   * メモリに保存
   */
  execute(value: number): MemoryStateDTO {
    let memory = this.memoryRepository.get()
    
    if (!memory) {
      memory = MemoryStorage.create()
    }

    memory = memory.store(value)
    this.memoryRepository.save(memory)

    return {
      hasValue: true,
      value,
      displayValue: this.formatter.format(value)
    }
  }
}

