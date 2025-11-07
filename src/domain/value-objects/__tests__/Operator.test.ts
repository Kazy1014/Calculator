import { describe, it, expect } from 'vitest'
import { Operator } from '../Operator'

describe('Operator Value Object', () => {
  describe('create', () => {
    it('有効な演算子を作成できる', () => {
      const add = Operator.create('+')
      expect(add.value).toBe('+')

      const subtract = Operator.create('-')
      expect(subtract.value).toBe('-')

      const multiply = Operator.create('*')
      expect(multiply.value).toBe('*')

      const divide = Operator.create('/')
      expect(divide.value).toBe('/')
    })

    it('無効な演算子は例外を投げる', () => {
      expect(() => Operator.create('%')).toThrow('Invalid operator')
      expect(() => Operator.create('x')).toThrow('Invalid operator')
    })
  })

  describe('getDisplaySymbol', () => {
    it('表示用の記号を返す', () => {
      expect(Operator.create('+').getDisplaySymbol()).toBe('+')
      expect(Operator.create('-').getDisplaySymbol()).toBe('-')
      expect(Operator.create('*').getDisplaySymbol()).toBe('×')
      expect(Operator.create('/').getDisplaySymbol()).toBe('÷')
    })
  })

  describe('equals', () => {
    it('同じ演算子は等しい', () => {
      const op1 = Operator.create('+')
      const op2 = Operator.create('+')
      expect(op1.equals(op2)).toBe(true)
    })

    it('異なる演算子は等しくない', () => {
      const op1 = Operator.create('+')
      const op2 = Operator.create('-')
      expect(op1.equals(op2)).toBe(false)
    })
  })
})

