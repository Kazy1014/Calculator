/**
 * 計算履歴エンティティ
 */
export class CalculationHistory {
  private constructor(
    private readonly id: string,
    private readonly expression: string,
    private readonly result: string,
    private readonly timestamp: Date
  ) {}

  static create(expression: string, result: string, id?: string): CalculationHistory {
    const generatedId = id || `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    return new CalculationHistory(
      generatedId,
      expression,
      result,
      new Date()
    )
  }

  getId(): string {
    return this.id
  }

  getExpression(): string {
    return this.expression
  }

  getResult(): string {
    return this.result
  }

  getTimestamp(): Date {
    return this.timestamp
  }
}
