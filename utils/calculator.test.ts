import { describe, it, expect, beforeEach } from 'vitest'
import { Calculator } from './calculator'

describe('Calculator', () => {
  let calculator: Calculator

  beforeEach(() => {
    calculator = new Calculator()
  })

  describe('数値入力', () => {
    it('数字を入力すると表示に反映される', () => {
      calculator.inputNumber('1')
      expect(calculator.getDisplay()).toBe('1')
    })

    it('複数の数字を連続入力できる', () => {
      calculator.inputNumber('1')
      calculator.inputNumber('2')
      calculator.inputNumber('3')
      expect(calculator.getDisplay()).toBe('123')
    })

    it('小数点を入力できる', () => {
      calculator.inputNumber('1')
      calculator.inputDecimal()
      calculator.inputNumber('5')
      expect(calculator.getDisplay()).toBe('1.5')
    })

    it('小数点は複数入力できない', () => {
      calculator.inputNumber('1')
      calculator.inputDecimal()
      calculator.inputNumber('5')
      calculator.inputDecimal()
      calculator.inputNumber('2')
      expect(calculator.getDisplay()).toBe('1.52')
    })
  })

  describe('四則演算', () => {
    it('足し算ができる', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('+')
      calculator.inputNumber('3')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('8')
    })

    it('引き算ができる', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('-')
      calculator.inputNumber('3')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('2')
    })

    it('掛け算ができる', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('*')
      calculator.inputNumber('3')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('15')
    })

    it('割り算ができる', () => {
      calculator.inputNumber('6')
      calculator.inputOperator('/')
      calculator.inputNumber('3')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('2')
    })

    it('ゼロ除算はエラーを表示', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('/')
      calculator.inputNumber('0')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('Error')
    })

    it('小数の計算ができる', () => {
      calculator.inputNumber('1')
      calculator.inputDecimal()
      calculator.inputNumber('5')
      calculator.inputOperator('+')
      calculator.inputNumber('2')
      calculator.inputDecimal()
      calculator.inputNumber('5')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('4')
    })
  })

  describe('連続計算', () => {
    it('連続して計算できる', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('+')
      calculator.inputNumber('3')
      calculator.inputOperator('+')
      expect(calculator.getDisplay()).toBe('8')
      calculator.inputNumber('2')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('10')
    })

    it('イコール後に続けて計算できる', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('+')
      calculator.inputNumber('3')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('8')
      calculator.inputOperator('*')
      calculator.inputNumber('2')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('16')
    })
  })

  describe('クリア機能', () => {
    it('clearで初期状態に戻る', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('+')
      calculator.inputNumber('3')
      calculator.clear()
      expect(calculator.getDisplay()).toBe('0')
    })

    it('clear後に新しい計算ができる', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('+')
      calculator.inputNumber('3')
      calculator.calculate()
      calculator.clear()
      calculator.inputNumber('2')
      calculator.inputOperator('*')
      calculator.inputNumber('3')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('6')
    })
  })

  describe('エラーハンドリング', () => {
    it('エラー後にクリアできる', () => {
      calculator.inputNumber('5')
      calculator.inputOperator('/')
      calculator.inputNumber('0')
      calculator.calculate()
      expect(calculator.getDisplay()).toBe('Error')
      calculator.clear()
      expect(calculator.getDisplay()).toBe('0')
    })
  })
})

