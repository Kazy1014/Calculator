import { Expression } from '../../../domain/value-objects/Expression'
import type { CalculationResultDTO } from '../../dto/CalculationResultDTO'

/**
 * バックスペースユースケース
 * 最後に入力した1文字を削除
 */
export class BackspaceUseCase {
  /**
   * バックスペースを実行
   */
  execute(currentExpression: Expression): CalculationResultDTO {
    const newExpression = currentExpression.backspace()

    return {
      expression: newExpression.getValue(),
      result: null,
      displayValue: newExpression.getValue() || '0',
      error: null,
      calculated: false
    }
  }
}

