/**
 * 演算子バリューオブジェクト
 * DDDにおけるValue Objectとして、演算子の概念をカプセル化
 */
export class Operator {
  private static readonly VALID_OPERATORS = ['+', '-', '*', '/'] as const
  public readonly value: '+' | '-' | '*' | '/'

  private constructor(value: '+' | '-' | '*' | '/') {
    this.value = value
  }

  /**
   * ファクトリメソッド - 演算子を作成
   */
  static create(value: string): Operator {
    if (!this.isValid(value)) {
      throw new Error(`Invalid operator: ${value}`)
    }
    return new Operator(value as '+' | '-' | '*' | '/')
  }

  /**
   * 演算子が有効かチェック
   */
  static isValid(value: string): boolean {
    return this.VALID_OPERATORS.includes(value as any)
  }

  /**
   * 表示用の記号を取得
   */
  getDisplaySymbol(): string {
    const symbols: Record<typeof this.value, string> = {
      '+': '+',
      '-': '-',
      '*': '×',
      '/': '÷'
    }
    return symbols[this.value]
  }

  /**
   * 等価性チェック
   */
  equals(other: Operator): boolean {
    return this.value === other.value
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this.value
  }
}

