import type { ICalculationHistoryRepository } from '../../../domain/repositories/ICalculationHistoryRepository'
import { Expression } from '../../../domain/value-objects/Expression'
import { ExpressionParser } from '../../../domain/services/ExpressionParser'
import { CalculationEngine } from '../../../domain/services/CalculationEngine'
import { NumberFormatter } from '../../../domain/services/NumberFormatter'
import { ScientificCalculator } from '../../../domain/services/ScientificCalculator'
import { CalculationHistory } from '../../../domain/entities/CalculationHistory'
import { CalculationHistoryEntry } from '../../../domain/entities/CalculationHistoryEntry'
import type { CalculationResultDTO } from '../../dto/CalculationResultDTO'

/**
 * 数式評価ユースケース
 * 数式を評価して計算結果を返す
 */
export class EvaluateExpressionUseCase {
  private readonly parser: ExpressionParser
  private readonly engine: CalculationEngine
  private readonly formatter: NumberFormatter

  constructor(
    private readonly historyRepository: ICalculationHistoryRepository
  ) {
    this.parser = new ExpressionParser()
    const scientificCalculator = new ScientificCalculator()
    this.engine = new CalculationEngine(scientificCalculator)
    this.formatter = new NumberFormatter()
  }

  /**
   * 数式を評価
   */
  execute(expression: Expression): CalculationResultDTO {
    try {
      // 空の数式は評価しない
      if (expression.isEmpty()) {
        return {
          expression: '',
          result: null,
          displayValue: '0',
          error: null,
          calculated: false
        }
      }

      // 数式をパースしてRPNに変換
      const rpnTokens = this.parser.parse(expression)

      // 計算を実行
      const result = this.engine.evaluate(rpnTokens)

      // 結果をフォーマット
      const formattedResult = this.formatter.format(result)

      // 履歴に保存
      const historyEntry = CalculationHistoryEntry.create(
        expression,
        result,
        expression.getValue(),
        formattedResult
      )

      let history = this.historyRepository.get()
      if (!history) {
        history = CalculationHistory.create()
      }
      history = history.addEntry(historyEntry)
      this.historyRepository.save(history)

      return {
        expression: expression.getValue(),
        result,
        displayValue: formattedResult,
        error: null,
        calculated: true
      }
    } catch (error) {
      return {
        expression: expression.getValue(),
        result: null,
        displayValue: 'Error',
        error: error instanceof Error ? error.message : '計算エラー',
        calculated: false
      }
    }
  }
}

