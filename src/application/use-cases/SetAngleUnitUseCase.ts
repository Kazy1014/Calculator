import { ExpressionEvaluator } from '../../domain/services/ExpressionEvaluator'
import { AngleUnit } from '../../domain/value-objects/AngleUnit'

/**
 * 角度単位を設定するユースケース
 */
export class SetAngleUnitUseCase {
  execute(unit: AngleUnit): void {
    ExpressionEvaluator.setAngleUnit(unit)
  }
}
