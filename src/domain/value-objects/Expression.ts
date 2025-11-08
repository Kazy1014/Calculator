/**
 * 数式を表現する値オブジェクト
 * 数式文字列の妥当性検証と管理を行う
 */
export class Expression {
  private constructor(private readonly value: string) {}

  /**
   * 空の数式を作成
   */
  static empty(): Expression {
    return new Expression('')
  }

  /**
   * 数式を作成
   * @throws Error 括弧が対応していない場合
   */
  static create(value: string): Expression {
    if (!Expression.isValidParentheses(value)) {
      throw new Error('括弧が対応していません')
    }
    return new Expression(value)
  }

  /**
   * 文字を追加した新しい数式を返す
   */
  append(char: string): Expression {
    return new Expression(this.value + char)
  }

  /**
   * 最後の文字を削除した新しい数式を返す
   */
  backspace(): Expression {
    if (this.value.length === 0) {
      return this
    }
    return new Expression(this.value.slice(0, -1))
  }

  /**
   * 数式が空かどうか
   */
  isEmpty(): boolean {
    return this.value.length === 0
  }

  /**
   * 数式の長さ
   */
  length(): number {
    return this.value.length
  }

  /**
   * 数式文字列を取得
   */
  getValue(): string {
    return this.value
  }

  /**
   * 括弧の対応が正しいかチェック
   */
  private static isValidParentheses(expression: string): boolean {
    let depth = 0
    for (const char of expression) {
      if (char === '(') {
        depth++
      } else if (char === ')') {
        depth--
        if (depth < 0) {
          return false
        }
      }
    }
    return depth === 0
  }

  /**
   * 括弧のバランスをチェック（閉じ括弧が多い場合はfalse）
   */
  hasBalancedParentheses(): boolean {
    return Expression.isValidParentheses(this.value)
  }

  /**
   * 開き括弧の数が閉じ括弧より多いか（計算実行前に自動補完が必要）
   */
  hasUnclosedParentheses(): boolean {
    let depth = 0
    for (const char of this.value) {
      if (char === '(') {
        depth++
      } else if (char === ')') {
        depth--
      }
    }
    return depth > 0
  }

  /**
   * 不足している閉じ括弧を補完した数式を返す
   */
  autoCloseParentheses(): Expression {
    let depth = 0
    for (const char of this.value) {
      if (char === '(') {
        depth++
      } else if (char === ')') {
        depth--
      }
    }
    
    if (depth <= 0) {
      return this
    }

    return new Expression(this.value + ')'.repeat(depth))
  }

  /**
   * 等価性チェック
   */
  equals(other: Expression): boolean {
    return this.value === other.value
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return this.value
  }
}

