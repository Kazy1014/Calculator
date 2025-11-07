export type Operator = '+' | '-' | '*' | '/'

export class Calculator {
  private display: string = '0'
  private previousValue: number = 0
  private currentOperator: Operator | null = null
  private waitingForNewValue: boolean = true
  private hasError: boolean = false

  /**
   * 現在の表示値を取得
   */
  getDisplay(): string {
    return this.display
  }

  /**
   * 数字を入力
   */
  inputNumber(digit: string): void {
    if (this.hasError) {
      return
    }

    if (this.waitingForNewValue) {
      this.display = digit
      this.waitingForNewValue = false
    } else {
      this.display = this.display === '0' ? digit : this.display + digit
    }
  }

  /**
   * 小数点を入力
   */
  inputDecimal(): void {
    if (this.hasError) {
      return
    }

    if (this.waitingForNewValue) {
      this.display = '0.'
      this.waitingForNewValue = false
    } else if (!this.display.includes('.')) {
      this.display += '.'
    }
  }

  /**
   * 演算子を入力
   */
  inputOperator(operator: Operator): void {
    if (this.hasError) {
      return
    }

    const currentValue = parseFloat(this.display)

    if (this.currentOperator !== null && !this.waitingForNewValue) {
      // 連続計算
      this.performCalculation(currentValue)
      if (this.hasError) {
        return
      }
    } else {
      this.previousValue = currentValue
    }

    this.currentOperator = operator
    this.waitingForNewValue = true
  }

  /**
   * 計算を実行
   */
  calculate(): void {
    if (this.hasError || this.currentOperator === null) {
      return
    }

    const currentValue = parseFloat(this.display)
    this.performCalculation(currentValue)
    this.currentOperator = null
  }

  /**
   * 実際の計算処理
   */
  private performCalculation(currentValue: number): void {
    let result: number

    switch (this.currentOperator) {
      case '+':
        result = this.previousValue + currentValue
        break
      case '-':
        result = this.previousValue - currentValue
        break
      case '*':
        result = this.previousValue * currentValue
        break
      case '/':
        if (currentValue === 0) {
          this.display = 'Error'
          this.hasError = true
          return
        }
        result = this.previousValue / currentValue
        break
      default:
        return
    }

    // 小数点以下の桁数を制限（浮動小数点誤差対策）
    result = Math.round(result * 100000000) / 100000000
    
    // 整数の場合は小数点を表示しない
    this.display = Number.isInteger(result) ? result.toString() : result.toString()
    this.previousValue = result
    this.waitingForNewValue = true
  }

  /**
   * クリア（リセット）
   */
  clear(): void {
    this.display = '0'
    this.previousValue = 0
    this.currentOperator = null
    this.waitingForNewValue = true
    this.hasError = false
  }
}

