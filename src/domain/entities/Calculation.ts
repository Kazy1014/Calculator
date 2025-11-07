import { Operator } from '../value-objects/Operator'
import { DisplayValue } from '../value-objects/DisplayValue'
import { CalculationResult } from '../value-objects/CalculationResult'

/**
 * 計算エンティティ
 * 電卓の計算状態を管理するドメインモデル
 */
export class Calculation {
  private constructor(
    private readonly id: string,
    private displayValue: DisplayValue,
    private previousValue: number,
    private currentOperator: Operator | null,
    private waitingForNewValue: boolean
  ) {}

  /**
   * 新しい計算を開始
   */
  static create(id?: string): Calculation {
    // ブラウザ環境とSSR環境の両方で動作するID生成
    const generatedId = id || `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    return new Calculation(
      generatedId,
      DisplayValue.zero(),
      0,
      null,
      true
    )
  }

  /**
   * 計算IDを取得
   */
  getId(): string {
    return this.id
  }

  /**
   * 現在の表示値を取得
   */
  getDisplayValue(): DisplayValue {
    return this.displayValue
  }

  /**
   * 数字を入力
   */
  inputNumber(digit: string): void {
    if (this.displayValue.isError()) {
      return
    }

    if (this.waitingForNewValue) {
      this.displayValue = DisplayValue.fromString(digit)
      this.waitingForNewValue = false
    } else {
      this.displayValue = this.displayValue.appendDigit(digit)
    }
  }

  /**
   * 小数点を入力
   */
  inputDecimalPoint(): void {
    if (this.displayValue.isError()) {
      return
    }

    if (this.waitingForNewValue) {
      this.displayValue = DisplayValue.fromString('0.')
      this.waitingForNewValue = false
    } else {
      this.displayValue = this.displayValue.appendDecimalPoint()
    }
  }

  /**
   * 演算子を入力
   */
  inputOperator(operator: Operator): void {
    if (this.displayValue.isError()) {
      return
    }

    const currentValue = this.displayValue.toNumber()

    if (this.currentOperator !== null && !this.waitingForNewValue) {
      // 連続計算
      const result = this.performCalculation(currentValue)
      if (result.failed()) {
        this.displayValue = DisplayValue.error()
        return
      }
      this.displayValue = DisplayValue.fromNumber(result.getValue())
      this.previousValue = result.getValue()
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
    if (this.displayValue.isError() || this.currentOperator === null) {
      return
    }

    const currentValue = this.displayValue.toNumber()
    const result = this.performCalculation(currentValue)
    
    if (result.failed()) {
      this.displayValue = DisplayValue.error()
    } else {
      this.displayValue = DisplayValue.fromNumber(result.getValue())
      this.previousValue = result.getValue()
    }
    
    this.currentOperator = null
    this.waitingForNewValue = true
  }

  /**
   * クリア（リセット）
   */
  clear(): void {
    this.displayValue = DisplayValue.zero()
    this.previousValue = 0
    this.currentOperator = null
    this.waitingForNewValue = true
  }

  /**
   * 実際の計算処理（プライベート）
   */
  private performCalculation(currentValue: number): CalculationResult {
    if (this.currentOperator === null) {
      return CalculationResult.failure('No operator set')
    }

    let result: number

    switch (this.currentOperator.value) {
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
          return CalculationResult.failure('Division by zero')
        }
        result = this.previousValue / currentValue
        break
    }

    return CalculationResult.success(result)
  }
}

