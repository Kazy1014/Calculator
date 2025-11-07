import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 小数点入力ユースケース
 * ユーザーが小数点ボタンを押したときの処理
 */
export class InputDecimalUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(): CalculationDTO {
    let calculation = this.repository.getCurrent()
    if (!calculation) {
      calculation = Calculation.create()
    }

    calculation.inputDecimalPoint()
    this.repository.save(calculation)

    return {
      displayValue: calculation.getDisplayValue().toString()
    }
  }
}

