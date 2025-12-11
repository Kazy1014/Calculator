import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCalculationHistoryRepository } from '../InMemoryCalculationHistoryRepository'
import { CalculationHistory } from '../../../domain/entities/CalculationHistory'

describe('InMemoryCalculationHistoryRepository', () => {
  let repository: InMemoryCalculationHistoryRepository

  beforeEach(() => {
    repository = new InMemoryCalculationHistoryRepository()
  })

  describe('save', () => {
    it('履歴を保存できる', () => {
      const history = CalculationHistory.create('2+3', '5')
      repository.save(history)
      expect(repository.count()).toBe(1)
    })

    it('複数の履歴を保存できる', () => {
      repository.save(CalculationHistory.create('1+1', '2'))
      repository.save(CalculationHistory.create('2+2', '4'))
      expect(repository.count()).toBe(2)
    })

    it('20件を超える場合は古いものを削除', () => {
      for (let i = 1; i <= 25; i++) {
        repository.save(CalculationHistory.create(`${i}+1`, `${i + 1}`))
      }
      expect(repository.count()).toBe(20)
    })
  })

  describe('getAll', () => {
    it('空の配列を返す', () => {
      const histories = repository.getAll()
      expect(histories.length).toBe(0)
    })

    it('時系列順（新しいものが先頭）で返す', () => {
      repository.save(CalculationHistory.create('1+1', '2'))
      repository.save(CalculationHistory.create('2+2', '4'))
      const histories = repository.getAll()
      expect(histories[0].getExpression()).toBe('2+2')
      expect(histories[1].getExpression()).toBe('1+1')
    })
  })

  describe('clear', () => {
    it('履歴をクリアできる', () => {
      repository.save(CalculationHistory.create('2+3', '5'))
      repository.clear()
      expect(repository.count()).toBe(0)
    })
  })

  describe('count', () => {
    it('履歴の件数を返す', () => {
      expect(repository.count()).toBe(0)
      repository.save(CalculationHistory.create('1+1', '2'))
      expect(repository.count()).toBe(1)
    })
  })
})
