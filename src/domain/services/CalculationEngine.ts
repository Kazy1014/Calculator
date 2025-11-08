import { Token } from '../value-objects/Token'
import { ScientificCalculator } from './ScientificCalculator'

/**
 * 計算エンジン（ドメインサービス）
 * 逆ポーランド記法（RPN）のトークン列を評価して結果を計算
 */
export class CalculationEngine {
  constructor(private readonly scientificCalculator: ScientificCalculator) {}

  /**
   * RPNトークン列を評価して結果を返す
   */
  evaluate(rpnTokens: Token[]): number {
    const stack: number[] = []

    for (const token of rpnTokens) {
      // 数値の場合はスタックにプッシュ
      if (token.isNumber()) {
        stack.push(Number(token.getValue()))
        continue
      }

      // 演算子の場合は2つの値をポップして計算
      if (token.isOperator()) {
        if (stack.length < 2) {
          throw new Error('数式が不正です')
        }

        const b = stack.pop()!
        const a = stack.pop()!
        const result = this.applyOperator(token.getValue(), a, b)
        stack.push(result)
        continue
      }

      // 関数の場合は1つの値をポップして計算
      if (token.isFunction()) {
        if (stack.length < 1) {
          throw new Error('数式が不正です')
        }

        const value = stack.pop()!
        const result = this.scientificCalculator.calculateFunction(token.getValue(), value)
        stack.push(result)
        continue
      }
    }

    // スタックに残った値が1つなら計算成功
    if (stack.length !== 1) {
      throw new Error('数式が不正です')
    }

    return stack[0]
  }

  /**
   * 演算子を適用
   */
  private applyOperator(operator: string, a: number, b: number): number {
    switch (operator) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        if (b === 0) {
          throw new Error('ゼロで除算できません')
        }
        return a / b
      case '^':
        return Math.pow(a, b)
      default:
        throw new Error(`未知の演算子: ${operator}`)
    }
  }
}

