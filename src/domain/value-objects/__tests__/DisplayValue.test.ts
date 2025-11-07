import { describe, it, expect } from 'vitest'
import { DisplayValue } from '../DisplayValue'

describe('DisplayValue Value Object', () => {
  describe('factory methods', () => {
    it('fromNumber - 数値から作成', () => {
      const dv = DisplayValue.fromNumber(123)
      expect(dv.toString()).toBe('123')
    })

    it('fromNumber - 小数を作成', () => {
      const dv = DisplayValue.fromNumber(1.5)
      expect(dv.toString()).toBe('1.5')
    })

    it('fromString - 文字列から作成', () => {
      const dv = DisplayValue.fromString('456')
      expect(dv.toString()).toBe('456')
    })

    it('zero - ゼロを作成', () => {
      const dv = DisplayValue.zero()
      expect(dv.toString()).toBe('0')
      expect(dv.isZero()).toBe(true)
    })

    it('error - エラーを作成', () => {
      const dv = DisplayValue.error()
      expect(dv.toString()).toBe('Error')
      expect(dv.isError()).toBe(true)
    })
  })

  describe('appendDigit', () => {
    it('数字を追加できる', () => {
      const dv = DisplayValue.fromString('12')
      const newDv = dv.appendDigit('3')
      expect(newDv.toString()).toBe('123')
    })

    it('ゼロから数字を追加すると置き換わる', () => {
      const dv = DisplayValue.zero()
      const newDv = dv.appendDigit('5')
      expect(newDv.toString()).toBe('5')
    })

    it('エラー状態では追加できない', () => {
      const dv = DisplayValue.error()
      const newDv = dv.appendDigit('1')
      expect(newDv.isError()).toBe(true)
    })
  })

  describe('appendDecimalPoint', () => {
    it('小数点を追加できる', () => {
      const dv = DisplayValue.fromString('1')
      const newDv = dv.appendDecimalPoint()
      expect(newDv.toString()).toBe('1.')
      expect(newDv.hasDecimalPoint()).toBe(true)
    })

    it('既に小数点がある場合は追加されない', () => {
      const dv = DisplayValue.fromString('1.5')
      const newDv = dv.appendDecimalPoint()
      expect(newDv.toString()).toBe('1.5')
    })

    it('エラー状態では追加できない', () => {
      const dv = DisplayValue.error()
      const newDv = dv.appendDecimalPoint()
      expect(newDv.isError()).toBe(true)
    })
  })

  describe('toNumber', () => {
    it('数値に変換できる', () => {
      const dv = DisplayValue.fromString('123.45')
      expect(dv.toNumber()).toBe(123.45)
    })
  })

  describe('equals', () => {
    it('同じ値は等しい', () => {
      const dv1 = DisplayValue.fromString('123')
      const dv2 = DisplayValue.fromString('123')
      expect(dv1.equals(dv2)).toBe(true)
    })

    it('異なる値は等しくない', () => {
      const dv1 = DisplayValue.fromString('123')
      const dv2 = DisplayValue.fromString('456')
      expect(dv1.equals(dv2)).toBe(false)
    })
  })
})

