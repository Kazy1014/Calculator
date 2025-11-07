import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import { Operator } from '../../domain/value-objects/Operator'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 演算子入力ユースケース
 * ユーザーが演算子ボタンを押したときの処理
 */
export class InputOperatorUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(operatorStr: string): CalculationDTO {
    let calculation = this.repository.getCurrent()
    if (!calculation) {
      calculation = Calculation.create()
    }

    const operator = Operator.create(operatorStr)
    calculation.inputOperator(operator)
    this.repository.save(calculation)

    return {
      displayValue: calculation.getDisplayValue().toString()
    }
  }
}

