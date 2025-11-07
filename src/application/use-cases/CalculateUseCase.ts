import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 計算実行ユースケース
 * ユーザーがイコールボタンを押したときの処理
 */
export class CalculateUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(): CalculationDTO {
    let calculation = this.repository.getCurrent()
    if (!calculation) {
      calculation = Calculation.create()
    }

    calculation.calculate()
    this.repository.save(calculation)

    return {
      displayValue: calculation.getDisplayValue().toString()
    }
  }
}

