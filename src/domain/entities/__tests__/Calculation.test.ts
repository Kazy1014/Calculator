import { describe, it, expect } from 'vitest'
import { Calculation } from '../Calculation'
import { Operator } from '../../value-objects/Operator'

describe('Calculation Entity', () => {
  describe('create', () => {
    it('初期状態は0', () => {
      const calc = Calculation.create()
      expect(calc.getDisplayValue().toString()).toBe('0')
    })
  })

  describe('inputNumber', () => {
    it('数字を入力できる', () => {
      const calc = Calculation.create()
      calc.inputNumber('1')
      expect(calc.getDisplayValue().toString()).toBe('1')
    })

    it('複数の数字を連続入力できる', () => {
      const calc = Calculation.create()
      calc.inputNumber('1')
      calc.inputNumber('2')
      calc.inputNumber('3')
      expect(calc.getDisplayValue().toString()).toBe('123')
    })
  })

  describe('inputDecimalPoint', () => {
    it('小数点を入力できる', () => {
      const calc = Calculation.create()
      calc.inputNumber('1')
      calc.inputDecimalPoint()
      calc.inputNumber('5')
      expect(calc.getDisplayValue().toString()).toBe('1.5')
    })

    it('小数点は複数入力できない', () => {
      const calc = Calculation.create()
      calc.inputNumber('1')
      calc.inputDecimalPoint()
      calc.inputNumber('5')
      calc.inputDecimalPoint()
      calc.inputNumber('2')
      expect(calc.getDisplayValue().toString()).toBe('1.52')
    })
  })

  describe('inputOperator and calculate', () => {
    it('足し算ができる', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('+'))
      calc.inputNumber('3')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('8')
    })

    it('引き算ができる', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('-'))
      calc.inputNumber('3')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('2')
    })

    it('掛け算ができる', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('*'))
      calc.inputNumber('3')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('15')
    })

    it('割り算ができる', () => {
      const calc = Calculation.create()
      calc.inputNumber('6')
      calc.inputOperator(Operator.create('/'))
      calc.inputNumber('3')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('2')
    })

    it('ゼロ除算はエラーを表示', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('/'))
      calc.inputNumber('0')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('Error')
    })

    it('小数の計算ができる', () => {
      const calc = Calculation.create()
      calc.inputNumber('1')
      calc.inputDecimalPoint()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('+'))
      calc.inputNumber('2')
      calc.inputDecimalPoint()
      calc.inputNumber('5')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('4')
    })
  })

  describe('連続計算', () => {
    it('連続して計算できる', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('+'))
      calc.inputNumber('3')
      calc.inputOperator(Operator.create('+'))
      expect(calc.getDisplayValue().toString()).toBe('8')
      calc.inputNumber('2')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('10')
    })

    it('イコール後に続けて計算できる', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('+'))
      calc.inputNumber('3')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('8')
      calc.inputOperator(Operator.create('*'))
      calc.inputNumber('2')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('16')
    })
  })

  describe('clear', () => {
    it('clearで初期状態に戻る', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('+'))
      calc.inputNumber('3')
      calc.clear()
      expect(calc.getDisplayValue().toString()).toBe('0')
    })

    it('clear後に新しい計算ができる', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('+'))
      calc.inputNumber('3')
      calc.calculate()
      calc.clear()
      calc.inputNumber('2')
      calc.inputOperator(Operator.create('*'))
      calc.inputNumber('3')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('6')
    })
  })

  describe('エラーハンドリング', () => {
    it('エラー後にクリアできる', () => {
      const calc = Calculation.create()
      calc.inputNumber('5')
      calc.inputOperator(Operator.create('/'))
      calc.inputNumber('0')
      calc.calculate()
      expect(calc.getDisplayValue().toString()).toBe('Error')
      calc.clear()
      expect(calc.getDisplayValue().toString()).toBe('0')
    })
  })
})

