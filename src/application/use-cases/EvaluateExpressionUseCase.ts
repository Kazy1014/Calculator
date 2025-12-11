import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { ExpressionEvaluator } from '../../domain/services/ExpressionEvaluator'
import { Calculation } from '../../domain/entities/Calculation'
import { DisplayValue } from '../../domain/value-objects/DisplayValue'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 式評価ユースケース
 * 括弧を含む複雑な数式を評価する
 */
export class EvaluateExpressionUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(expression: string): CalculationDTO {
    const result = ExpressionEvaluator.evaluate(expression)
    
    if (result.failed()) {
      return {
        displayValue: result.getErrorMessage()
      }
    }

    // 計算結果を表示値に設定
    const displayValue = DisplayValue.fromNumber(result.getValue())
    
    return {
      displayValue: displayValue.toString()
    }
  }
}
