import { Expression } from '../../../domain/value-objects/Expression'
import type { CalculationResultDTO } from '../../dto/CalculationResultDTO'

/**
 * 文字入力ユースケース
 * 数字、演算子、括弧などの文字を入力
 */
export class InputCharacterUseCase {
  /**
   * 文字を入力
   */
  execute(currentExpression: Expression, char: string): CalculationResultDTO {
    try {
      const newExpression = currentExpression.append(char)

      return {
        expression: newExpression.getValue(),
        result: null,
        displayValue: newExpression.getValue() || '0',
        error: null,
        calculated: false
      }
    } catch (error) {
      return {
        expression: currentExpression.getValue(),
        result: null,
        displayValue: currentExpression.getValue() || '0',
        error: error instanceof Error ? error.message : '入力エラー',
        calculated: false
      }
    }
  }
}

