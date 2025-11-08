import type { IMemoryRepository } from '../../../domain/repositories/IMemoryRepository'
import type { MemoryStateDTO } from '../../dto/MemoryStateDTO'
import { NumberFormatter } from '../../../domain/services/NumberFormatter'

/**
 * メモリ呼び出しユースケース（MR: Memory Recall）
 * メモリから値を呼び出し
 */
export class RecallFromMemoryUseCase {
  private readonly formatter: NumberFormatter

  constructor(
    private readonly memoryRepository: IMemoryRepository
  ) {
    this.formatter = new NumberFormatter()
  }

  /**
   * メモリから呼び出し
   */
  execute(): MemoryStateDTO {
    const memory = this.memoryRepository.get()
    
    if (!memory || !memory.hasValue()) {
      return {
        hasValue: false,
        value: null,
        displayValue: '0'
      }
    }

    const value = memory.recall()

    return {
      hasValue: true,
      value,
      displayValue: value !== null ? this.formatter.format(value) : '0'
    }
  }
}

