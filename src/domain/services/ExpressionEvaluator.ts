import { CalculationResult } from '../value-objects/CalculationResult'
import { AngleUnit, AngleUnitType } from '../value-objects/AngleUnit'

/**
 * 式評価エンジン
 * 括弧を含む複雑な数式を評価する
 */
export class ExpressionEvaluator {
  private static readonly MAX_NESTING_DEPTH = 10
  private static currentAngleUnit: AngleUnit = AngleUnit.radians()

  /**
   * 角度単位を設定
   */
  static setAngleUnit(unit: AngleUnit): void {
    this.currentAngleUnit = unit
  }

  /**
   * 現在の角度単位を取得
   */
  static getAngleUnit(): AngleUnit {
    return this.currentAngleUnit
  }

  /**
   * 数式を評価する
   */
  static evaluate(expression: string): CalculationResult {
    try {
      // 括弧の対応チェック
      if (!this.isValidParentheses(expression)) {
        return CalculationResult.failure('括弧の対応が正しくありません')
      }

      // 括弧のネスト階層チェック
      const maxDepth = this.getMaxNestingDepth(expression)
      if (maxDepth > this.MAX_NESTING_DEPTH) {
        return CalculationResult.failure(`括弧のネスト階層が${this.MAX_NESTING_DEPTH}階層を超えています`)
      }

      // 式を評価
      const result = this.evaluateExpression(expression)
      
      if (!isFinite(result)) {
        if (isNaN(result)) {
          return CalculationResult.failure('計算エラー')
        }
        return CalculationResult.failure('無限大')
      }

      return CalculationResult.success(result)
    } catch (error) {
      return CalculationResult.failure('計算エラー')
    }
  }

  /**
   * 括弧の対応が正しいかチェック
   */
  private static isValidParentheses(expression: string): boolean {
    let count = 0
    for (const char of expression) {
      if (char === '(') count++
      if (char === ')') count--
      if (count < 0) return false
    }
    return count === 0
  }

  /**
   * 括弧の最大ネスト階層を取得
   */
  private static getMaxNestingDepth(expression: string): number {
    let maxDepth = 0
    let currentDepth = 0
    for (const char of expression) {
      if (char === '(') {
        currentDepth++
        maxDepth = Math.max(maxDepth, currentDepth)
      } else if (char === ')') {
        currentDepth--
      }
    }
    return maxDepth
  }

  /**
   * 式を評価（再帰的下向き構文解析）
   */
  private static evaluateExpression(expression: string): number {
    // 空白を削除
    const expr = expression.replace(/\s/g, '')
    
    // トークンに分割
    const tokens = this.tokenize(expr)
    
    // 式を評価
    return this.parseExpression(tokens)
  }

  /**
   * 式をトークンに分割
   */
  private static tokenize(expression: string): string[] {
    const tokens: string[] = []
    let current = ''
    
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i]
      
      if (char === '(' || char === ')') {
        if (current) {
          tokens.push(current)
          current = ''
        }
        tokens.push(char)
      } else if (this.isOperator(char)) {
        if (current) {
          tokens.push(current)
          current = ''
        }
        tokens.push(char)
      } else if (char === '.' || (char >= '0' && char <= '9')) {
        current += char
      } else if (this.isFunctionStart(char, expression, i)) {
        if (current) {
          tokens.push(current)
          current = ''
        }
        // 関数名を抽出
        const funcName = this.extractFunctionName(expression, i)
        tokens.push(funcName)
        i += funcName.length - 1
      }
    }
    
    if (current) {
      tokens.push(current)
    }
    
    return tokens
  }

  /**
   * 演算子かどうか
   */
  private static isOperator(char: string): boolean {
    return char === '+' || char === '-' || char === '*' || char === '/' || char === '^'
  }

  /**
   * 関数の開始かどうか
   */
  private static isFunctionStart(char: string, expression: string, index: number): boolean {
    const functions = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'mean', 'median', 'stddev', 'variance']
    for (const func of functions) {
      if (expression.substring(index, index + func.length) === func) {
        return true
      }
    }
    return false
  }

  /**
   * 関数名を抽出
   */
  private static extractFunctionName(expression: string, index: number): string {
    const functions = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'mean', 'median', 'stddev', 'variance']
    for (const func of functions) {
      if (expression.substring(index, index + func.length) === func) {
        return func
      }
    }
    return ''
  }

  /**
   * 式をパースして評価（演算子の優先順位を考慮）
   */
  private static parseExpression(tokens: string[]): number {
    let index = 0
    
    const parseAddSub = (): number => {
      let result = parseMulDiv()
      
      while (index < tokens.length) {
        const op = tokens[index]
        if (op === '+') {
          index++
          result += parseMulDiv()
        } else if (op === '-') {
          index++
          result -= parseMulDiv()
        } else {
          break
        }
      }
      
      return result
    }
    
    const parseMulDiv = (): number => {
      let result = parsePower()
      
      while (index < tokens.length) {
        const op = tokens[index]
        if (op === '*') {
          index++
          result *= parsePower()
        } else if (op === '/') {
          index++
          const divisor = parsePower()
          if (divisor === 0) {
            throw new Error('Division by zero')
          }
          result /= divisor
        } else {
          break
        }
      }
      
      return result
    }
    
    const parsePower = (): number => {
      let result = parseFactor()
      
      while (index < tokens.length && tokens[index] === '^') {
        index++
        result = Math.pow(result, parseFactor())
      }
      
      return result
    }
    
    const parseFactor = (): number => {
      if (index >= tokens.length) {
        throw new Error('Unexpected end of expression')
      }
      
      const token = tokens[index]
      
      // 負の数
      if (token === '-') {
        index++
        return -parseFactor()
      }
      
      // 正の符号（無視）
      if (token === '+') {
        index++
        return parseFactor()
      }
      
      // 括弧
      if (token === '(') {
        index++
        const result = parseAddSub()
        if (index >= tokens.length || tokens[index] !== ')') {
          throw new Error('Missing closing parenthesis')
        }
        index++
        return result
      }
      
      // 関数
      if (this.isFunctionName(token)) {
        index++
        if (index >= tokens.length || tokens[index] !== '(') {
          throw new Error('Function must be followed by parenthesis')
        }
        index++ // '(' をスキップ
        const arg = parseAddSub()
        if (index >= tokens.length || tokens[index] !== ')') {
          throw new Error('Missing closing parenthesis for function')
        }
        index++ // ')' をスキップ
        return this.evaluateFunction(token, arg)
      }
      
      // 数値
      const num = parseFloat(token)
      if (isNaN(num)) {
        throw new Error(`Invalid token: ${token}`)
      }
      index++
      return num
    }
    
    return parseAddSub()
  }

  /**
   * 関数名かどうか
   */
  private static isFunctionName(token: string): boolean {
    return ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'mean', 'median', 'stddev', 'variance'].includes(token)
  }

  /**
   * 関数を評価（角度単位を考慮）
   */
  private static evaluateFunction(funcName: string, arg: number): number {
    switch (funcName) {
      case 'sin':
        const sinArg = this.currentAngleUnit.getType() === AngleUnitType.DEGREES 
          ? this.currentAngleUnit.toRadians(arg) 
          : arg
        return Math.sin(sinArg)
      case 'cos':
        const cosArg = this.currentAngleUnit.getType() === AngleUnitType.DEGREES 
          ? this.currentAngleUnit.toRadians(arg) 
          : arg
        return Math.cos(cosArg)
      case 'tan':
        const tanArg = this.currentAngleUnit.getType() === AngleUnitType.DEGREES 
          ? this.currentAngleUnit.toRadians(arg) 
          : arg
        return Math.tan(tanArg)
      case 'log':
        if (arg <= 0) throw new Error('Logarithm of non-positive number')
        return Math.log10(arg)
      case 'ln':
        if (arg <= 0) throw new Error('Natural logarithm of non-positive number')
        return Math.log(arg)
      case 'sqrt':
        if (arg < 0) throw new Error('Square root of negative number')
        return Math.sqrt(arg)
      case 'abs':
        return Math.abs(arg)
      case 'mean':
        // 平均関数は配列を受け取る必要があるが、簡易実装として単一値として扱う
        // 実際の実装では、配列構文をサポートする必要がある
        return arg
      case 'median':
        // 中央値関数も同様
        return arg
      case 'stddev':
        // 標準偏差関数も同様
        return arg
      case 'variance':
        // 分散関数も同様
        return arg
      default:
        throw new Error(`Unknown function: ${funcName}`)
    }
  }

  /**
   * 統計関数を評価（配列を受け取る）
   * 注: 現在は簡易実装。実際の実装では配列構文をサポートする必要がある
   */
  private static evaluateStatisticalFunction(funcName: string, values: number[]): number {
    switch (funcName) {
      case 'mean':
        return values.reduce((sum, val) => sum + val, 0) / values.length
      case 'median':
        const sorted = [...values].sort((a, b) => a - b)
        const mid = Math.floor(sorted.length / 2)
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid]
      case 'stddev':
        const mean = this.evaluateStatisticalFunction('mean', values)
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
        return Math.sqrt(variance)
      case 'variance':
        const meanVal = this.evaluateStatisticalFunction('mean', values)
        return values.reduce((sum, val) => sum + Math.pow(val - meanVal, 2), 0) / values.length
      default:
        throw new Error(`Unknown statistical function: ${funcName}`)
    }
  }
}
