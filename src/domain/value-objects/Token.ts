/**
 * トークンの種類
 */
export enum TokenType {
  NUMBER = 'NUMBER',           // 数値
  OPERATOR = 'OPERATOR',       // 演算子 (+, -, *, /)
  FUNCTION = 'FUNCTION',       // 関数 (sin, cos, log, etc.)
  LEFT_PAREN = 'LEFT_PAREN',   // 開き括弧 (
  RIGHT_PAREN = 'RIGHT_PAREN', // 閉じ括弧 )
}

/**
 * トークンを表現する値オブジェクト
 */
export class Token {
  private constructor(
    private readonly type: TokenType,
    private readonly value: string
  ) {}

  /**
   * 数値トークンを作成
   */
  static number(value: string): Token {
    if (isNaN(Number(value))) {
      throw new Error(`Invalid number: ${value}`)
    }
    return new Token(TokenType.NUMBER, value)
  }

  /**
   * 演算子トークンを作成
   */
  static operator(value: string): Token {
    if (!['+', '-', '*', '/', '^'].includes(value)) {
      throw new Error(`Invalid operator: ${value}`)
    }
    return new Token(TokenType.OPERATOR, value)
  }

  /**
   * 関数トークンを作成
   */
  static function(value: string): Token {
    const validFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs']
    if (!validFunctions.includes(value.toLowerCase())) {
      throw new Error(`Invalid function: ${value}`)
    }
    return new Token(TokenType.FUNCTION, value.toLowerCase())
  }

  /**
   * 開き括弧トークンを作成
   */
  static leftParen(): Token {
    return new Token(TokenType.LEFT_PAREN, '(')
  }

  /**
   * 閉じ括弧トークンを作成
   */
  static rightParen(): Token {
    return new Token(TokenType.RIGHT_PAREN, ')')
  }

  /**
   * トークンタイプを取得
   */
  getType(): TokenType {
    return this.type
  }

  /**
   * トークン値を取得
   */
  getValue(): string {
    return this.value
  }

  /**
   * 数値トークンかどうか
   */
  isNumber(): boolean {
    return this.type === TokenType.NUMBER
  }

  /**
   * 演算子トークンかどうか
   */
  isOperator(): boolean {
    return this.type === TokenType.OPERATOR
  }

  /**
   * 関数トークンかどうか
   */
  isFunction(): boolean {
    return this.type === TokenType.FUNCTION
  }

  /**
   * 開き括弧トークンかどうか
   */
  isLeftParen(): boolean {
    return this.type === TokenType.LEFT_PAREN
  }

  /**
   * 閉じ括弧トークンかどうか
   */
  isRightParen(): boolean {
    return this.type === TokenType.RIGHT_PAREN
  }

  /**
   * 演算子の優先順位を取得
   * 数値が大きいほど優先度が高い
   */
  getPrecedence(): number {
    if (!this.isOperator()) {
      return -1
    }

    switch (this.value) {
      case '+':
      case '-':
        return 1
      case '*':
      case '/':
        return 2
      case '^':
        return 3
      default:
        return -1
    }
  }

  /**
   * 右結合かどうか（累乗演算子のみ）
   */
  isRightAssociative(): boolean {
    return this.isOperator() && this.value === '^'
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this.value
  }

  /**
   * 等価性チェック
   */
  equals(other: Token): boolean {
    return this.type === other.type && this.value === other.value
  }
}

