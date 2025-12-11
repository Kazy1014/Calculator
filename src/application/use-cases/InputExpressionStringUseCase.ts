import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 式文字列入力ユースケース
 * 括弧や関数を含む式文字列を入力する
 */
export class InputExpressionStringUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(expression: string): CalculationDTO {
    let calculation = this.repository.getCurrent()
    if (!calculation) {
      calculation = Calculation.create()
    }

    calculation.setExpressionString(expression)
    this.repository.save(calculation)

    return {
      displayValue: expression
    }
  }
}
