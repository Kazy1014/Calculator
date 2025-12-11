import type { IMemoryRepository } from '../../domain/repositories/IMemoryRepository'
import type { CalculationDTO } from '../dto/CalculationDTO'
import { DisplayValue } from '../../domain/value-objects/DisplayValue'

/**
 * メモリから値を呼び出すユースケース
 */
export class RecallMemoryUseCase {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(): CalculationDTO {
    const memory = this.memoryRepository.get()
    const value = memory.getValue()
    
    if (value === null) {
      return {
        displayValue: '0'
      }
    }

    return {
      displayValue: DisplayValue.fromNumber(value).toString()
    }
  }
}
