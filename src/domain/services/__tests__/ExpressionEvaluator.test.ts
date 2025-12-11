import { describe, it, expect, beforeEach } from 'vitest'
import { ExpressionEvaluator } from '../ExpressionEvaluator'
import { AngleUnit } from '../../value-objects/AngleUnit'

describe('ExpressionEvaluator', () => {
  beforeEach(() => {
    // 角度単位をラジアンにリセット
    ExpressionEvaluator.setAngleUnit(AngleUnit.radians())
  })

  describe('基本的な四則演算', () => {
    it('足し算ができる', () => {
      const result = ExpressionEvaluator.evaluate('2+3')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(5)
    })

    it('引き算ができる', () => {
      const result = ExpressionEvaluator.evaluate('10-4')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(6)
    })

    it('掛け算ができる', () => {
      const result = ExpressionEvaluator.evaluate('3*4')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(12)
    })

    it('割り算ができる', () => {
      const result = ExpressionEvaluator.evaluate('15/3')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(5)
    })

    it('ゼロ除算はエラーを返す', () => {
      const result = ExpressionEvaluator.evaluate('10/0')
      expect(result.failed()).toBe(true)
    })

    it('複数の演算が優先順位に従って計算される', () => {
      const result = ExpressionEvaluator.evaluate('2+3*4')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(14) // 2 + (3*4) = 14
    })
  })

  describe('括弧を使った計算', () => {
    it('括弧で優先順位を変更できる', () => {
      const result = ExpressionEvaluator.evaluate('(2+3)*4')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(20) // (2+3)*4 = 20
    })

    it('ネストした括弧が計算できる', () => {
      const result = ExpressionEvaluator.evaluate('((2+3)*4)+1')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(21)
    })

    it('最大10階層のネストが可能', () => {
      // 10階層のネスト: (((((((((1+1)+1)+1)+1)+1)+1)+1)+1)+1)
      const expression = '(((((((((1+1)+1)+1)+1)+1)+1)+1)+1)+1)'
      const result = ExpressionEvaluator.evaluate(expression)
      expect(result.succeeded()).toBe(true)
      // 1+1=2, その後8回+1するので 2+8=10
      expect(result.getValue()).toBe(10)
    })

    it('11階層を超えるネストはエラーを返す', () => {
      // 11階層のネスト: (((((((((((1+1)+1)+1)+1)+1)+1)+1)+1)+1)+1)+1)
      const expression = '(((((((((((1+1)+1)+1)+1)+1)+1)+1)+1)+1)+1)+1)'
      const result = ExpressionEvaluator.evaluate(expression)
      expect(result.failed()).toBe(true)
      expect(result.getErrorMessage()).toContain('10階層')
    })

    it('括弧の対応が正しくない場合はエラーを返す', () => {
      const result = ExpressionEvaluator.evaluate('(2+3')
      expect(result.failed()).toBe(true)
      expect(result.getErrorMessage()).toContain('括弧の対応')
    })

    it('閉じ括弧が多すぎる場合はエラーを返す', () => {
      const result = ExpressionEvaluator.evaluate('2+3)')
      expect(result.failed()).toBe(true)
    })
  })

  describe('科学計算関数', () => {
    it('sin関数が計算できる（ラジアン）', () => {
      ExpressionEvaluator.setAngleUnit(AngleUnit.radians())
      const result = ExpressionEvaluator.evaluate('sin(0)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBeCloseTo(0, 10)
    })

    it('sin関数が計算できる（度）', () => {
      ExpressionEvaluator.setAngleUnit(AngleUnit.degrees())
      const result = ExpressionEvaluator.evaluate('sin(90)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBeCloseTo(1, 5)
    })

    it('cos関数が計算できる', () => {
      ExpressionEvaluator.setAngleUnit(AngleUnit.radians())
      const result = ExpressionEvaluator.evaluate('cos(0)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBeCloseTo(1, 10)
    })

    it('tan関数が計算できる', () => {
      ExpressionEvaluator.setAngleUnit(AngleUnit.radians())
      const result = ExpressionEvaluator.evaluate('tan(0)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBeCloseTo(0, 10)
    })

    it('log関数が計算できる', () => {
      const result = ExpressionEvaluator.evaluate('log(100)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBeCloseTo(2, 10)
    })

    it('ln関数が計算できる', () => {
      const result = ExpressionEvaluator.evaluate('ln(1)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBeCloseTo(0, 10)
    })

    it('sqrt関数が計算できる', () => {
      const result = ExpressionEvaluator.evaluate('sqrt(16)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(4)
    })

    it('負の数の平方根はエラーを返す', () => {
      const result = ExpressionEvaluator.evaluate('sqrt(-1)')
      expect(result.failed()).toBe(true)
    })

    it('累乗が計算できる', () => {
      const result = ExpressionEvaluator.evaluate('2^3')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(8)
    })
  })

  describe('複雑な式', () => {
    it('関数と演算を組み合わせられる', () => {
      ExpressionEvaluator.setAngleUnit(AngleUnit.radians())
      const result = ExpressionEvaluator.evaluate('sin(0)+cos(0)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBeCloseTo(1, 10)
    })

    it('括弧と関数を組み合わせられる', () => {
      const result = ExpressionEvaluator.evaluate('sqrt((2+2)*4)')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(4)
    })

    it('複数の関数をネストできる', () => {
      const result = ExpressionEvaluator.evaluate('sqrt(sqrt(16))')
      expect(result.succeeded()).toBe(true)
      expect(result.getValue()).toBe(2)
    })
  })
})
