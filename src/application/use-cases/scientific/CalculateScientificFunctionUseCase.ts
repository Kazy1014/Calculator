import { ScientificCalculator } from '../../../domain/services/ScientificCalculator'
import { NumberFormatter } from '../../../domain/services/NumberFormatter'
import type { CalculationResultDTO } from '../../dto/CalculationResultDTO'

/**
 * 科学関数計算ユースケース
 */
export class CalculateScientificFunctionUseCase {
  private readonly formatter: NumberFormatter

  constructor(
    private readonly scientificCalculator: ScientificCalculator
  ) {
    this.formatter = new NumberFormatter()
  }

  /**
   * 科学関数を計算
   */
  execute(functionName: string, value: number): CalculationResultDTO {
    try {
      const result = this.scientificCalculator.calculateFunction(functionName, value)
      const formattedResult = this.formatter.format(result)

      return {
        expression: `${functionName}(${value})`,
        result,
        displayValue: formattedResult,
        error: null,
        calculated: true
      }
    } catch (error) {
      return {
        expression: `${functionName}(${value})`,
        result: null,
        displayValue: 'Error',
        error: error instanceof Error ? error.message : '計算エラー',
        calculated: false
      }
    }
  }
}

