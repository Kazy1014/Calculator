import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 表示値取得ユースケース
 * 現在の表示値を取得
 */
export class GetDisplayValueUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(): CalculationDTO {
    const calculation = this.repository.getCurrent()
    
    if (!calculation) {
      return { displayValue: '0' }
    }

    return {
      displayValue: calculation.getDisplayValue().toString()
    }
  }
}

