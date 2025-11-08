import { Expression } from '../value-objects/Expression'

/**
 * 計算履歴エントリ（エンティティ）
 * 1つの計算記録を表現
 */
export class CalculationHistoryEntry {
  private constructor(
    private readonly id: string,
    private readonly expression: Expression,
    private readonly result: number,
    private readonly timestamp: Date,
    private readonly formattedExpression: string,
    private readonly formattedResult: string
  ) {}

  /**
   * 計算履歴エントリを作成
   */
  static create(
    expression: Expression,
    result: number,
    formattedExpression: string,
    formattedResult: string,
    id?: string,
    timestamp?: Date
  ): CalculationHistoryEntry {
    const entryId = id || `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const entryTimestamp = timestamp || new Date()

    return new CalculationHistoryEntry(
      entryId,
      expression,
      result,
      entryTimestamp,
      formattedExpression,
      formattedResult
    )
  }

  /**
   * IDを取得
   */
  getId(): string {
    return this.id
  }

  /**
   * 数式を取得
   */
  getExpression(): Expression {
    return this.expression
  }

  /**
   * 結果を取得
   */
  getResult(): number {
    return this.result
  }

  /**
   * タイムスタンプを取得
   */
  getTimestamp(): Date {
    return this.timestamp
  }

  /**
   * フォーマット済み数式を取得
   */
  getFormattedExpression(): string {
    return this.formattedExpression
  }

  /**
   * フォーマット済み結果を取得
   */
  getFormattedResult(): string {
    return this.formattedResult
  }

  /**
   * 等価性チェック
   */
  equals(other: CalculationHistoryEntry): boolean {
    return this.id === other.id
  }
}

