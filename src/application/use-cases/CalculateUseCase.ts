import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import { ExpressionEvaluator } from '../../domain/services/ExpressionEvaluator'
import { DisplayValue } from '../../domain/value-objects/DisplayValue'
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

    // 式文字列がある場合は式評価エンジンを使用
    const expressionString = calculation.getExpressionString()
    if (expressionString && expressionString.trim() !== '') {
      const result = ExpressionEvaluator.evaluate(expressionString)
      
      if (result.failed()) {
        return {
          displayValue: result.getErrorMessage()
        }
      }

      const displayValue = DisplayValue.fromNumber(result.getValue())
      return {
        displayValue: displayValue.toString()
      }
    }

    // 通常の計算
    calculation.calculate()
    this.repository.save(calculation)

    return {
      displayValue: calculation.getDisplayValue().toString()
    }
  }
}

