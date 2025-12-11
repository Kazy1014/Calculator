import { describe, it, expect } from 'vitest'
import { CalculationHistory } from '../CalculationHistory'

describe('CalculationHistory', () => {
  describe('create', () => {
    it('計算履歴を作成できる', () => {
      const history = CalculationHistory.create('2+3', '5')
      expect(history.getExpression()).toBe('2+3')
      expect(history.getResult()).toBe('5')
      expect(history.getId()).toBeTruthy()
      expect(history.getTimestamp()).toBeInstanceOf(Date)
    })

    it('IDを指定して作成できる', () => {
      const history = CalculationHistory.create('2+3', '5', 'test-id')
      expect(history.getId()).toBe('test-id')
    })
  })

  describe('getters', () => {
    it('式を取得できる', () => {
      const history = CalculationHistory.create('10*5', '50')
      expect(history.getExpression()).toBe('10*5')
    })

    it('結果を取得できる', () => {
      const history = CalculationHistory.create('10*5', '50')
      expect(history.getResult()).toBe('50')
    })

    it('タイムスタンプを取得できる', () => {
      const before = new Date()
      const history = CalculationHistory.create('1+1', '2')
      const after = new Date()
      const timestamp = history.getTimestamp()
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })
})
