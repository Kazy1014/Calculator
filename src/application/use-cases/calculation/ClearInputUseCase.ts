import { Expression } from '../../../domain/value-objects/Expression'
import type { CalculationResultDTO } from '../../dto/CalculationResultDTO'

/**
 * 入力クリアユースケース
 * 現在の入力をすべてクリア
 */
export class ClearInputUseCase {
  /**
   * 入力をクリア
   */
  execute(): CalculationResultDTO {
    return {
      expression: '',
      result: null,
      displayValue: '0',
      error: null,
      calculated: false
    }
  }
}

