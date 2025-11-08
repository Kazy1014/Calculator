import { Expression } from '../value-objects/Expression'
import { Token, TokenType } from '../value-objects/Token'

/**
 * 数式パーサー（ドメインサービス）
 * Shunting-yard algorithmを使用して中置記法を後置記法（RPN）に変換
 */
export class ExpressionParser {
  /**
   * 数式文字列をトークンリストに変換
   */
  tokenize(expression: Expression): Token[] {
    const tokens: Token[] = []
    const str = expression.getValue().replace(/\s/g, '') // 空白を除去
    let i = 0

    while (i < str.length) {
      const char = str[i]

      // 数値の読み取り（小数点対応）
      if (char >= '0' && char <= '9' || char === '.') {
        let numStr = ''
        while (i < str.length && (str[i] >= '0' && str[i] <= '9' || str[i] === '.')) {
          numStr += str[i]
          i++
        }
        tokens.push(Token.number(numStr))
        continue
      }

      // 演算子
      if (['+', '-', '*', '/', '^'].includes(char)) {
        // 負の数の処理：先頭または開き括弧の直後の'-'は単項マイナス
        if (char === '-' && (tokens.length === 0 || tokens[tokens.length - 1].isLeftParen() || tokens[tokens.length - 1].isOperator())) {
          // 次の数値を読み取って負の数として扱う
          i++
          if (i < str.length && (str[i] >= '0' && str[i] <= '9' || str[i] === '.')) {
            let numStr = '-'
            while (i < str.length && (str[i] >= '0' && str[i] <= '9' || str[i] === '.')) {
              numStr += str[i]
              i++
            }
            tokens.push(Token.number(numStr))
            continue
          } else if (i < str.length && str[i] === '(') {
            // -(expression)の場合は-1を乗算として扱う
            tokens.push(Token.number('-1'))
            tokens.push(Token.operator('*'))
            continue
          }
          i-- // 解析できなかったので戻す
        }
        tokens.push(Token.operator(char))
        i++
        continue
      }

      // 括弧
      if (char === '(') {
        tokens.push(Token.leftParen())
        i++
        continue
      }

      if (char === ')') {
        tokens.push(Token.rightParen())
        i++
        continue
      }

      // 関数名の読み取り
      if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z') {
        let funcName = ''
        while (i < str.length && (str[i] >= 'a' && str[i] <= 'z' || str[i] >= 'A' && str[i] <= 'Z')) {
          funcName += str[i]
          i++
        }
        tokens.push(Token.function(funcName))
        continue
      }

      // 認識できない文字はスキップ
      i++
    }

    return tokens
  }

  /**
   * トークンリストを逆ポーランド記法（RPN）に変換
   * Shunting-yard algorithmを使用
   */
  toRPN(tokens: Token[]): Token[] {
    const output: Token[] = []
    const operatorStack: Token[] = []

    for (const token of tokens) {
      // 数値はそのまま出力
      if (token.isNumber()) {
        output.push(token)
        continue
      }

      // 関数はスタックにプッシュ
      if (token.isFunction()) {
        operatorStack.push(token)
        continue
      }

      // 演算子の処理
      if (token.isOperator()) {
        // スタックのトップが演算子で、優先順位が高い場合はポップして出力
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].isOperator() &&
          !operatorStack[operatorStack.length - 1].isLeftParen()
        ) {
          const top = operatorStack[operatorStack.length - 1]
          const shouldPop = token.isRightAssociative()
            ? top.getPrecedence() > token.getPrecedence()
            : top.getPrecedence() >= token.getPrecedence()

          if (shouldPop) {
            output.push(operatorStack.pop()!)
          } else {
            break
          }
        }
        operatorStack.push(token)
        continue
      }

      // 開き括弧はスタックにプッシュ
      if (token.isLeftParen()) {
        operatorStack.push(token)
        continue
      }

      // 閉じ括弧の処理
      if (token.isRightParen()) {
        // 開き括弧が見つかるまでポップ
        while (operatorStack.length > 0 && !operatorStack[operatorStack.length - 1].isLeftParen()) {
          output.push(operatorStack.pop()!)
        }

        // 開き括弧をポップ（出力には含めない）
        if (operatorStack.length > 0) {
          operatorStack.pop()
        }

        // 開き括弧の前に関数があればポップして出力
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].isFunction()) {
          output.push(operatorStack.pop()!)
        }
        continue
      }
    }

    // 残りの演算子をすべてポップ
    while (operatorStack.length > 0) {
      output.push(operatorStack.pop()!)
    }

    return output
  }

  /**
   * 数式をパースしてRPNに変換
   */
  parse(expression: Expression): Token[] {
    // 開き括弧が多い場合は自動補完
    const completeExpression = expression.autoCloseParentheses()
    
    // トークン化
    const tokens = this.tokenize(completeExpression)
    
    // RPNに変換
    return this.toRPN(tokens)
  }
}

