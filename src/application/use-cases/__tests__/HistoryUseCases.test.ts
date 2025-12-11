import { describe, it, expect, beforeEach } from 'vitest'
import { SaveHistoryUseCase } from '../SaveHistoryUseCase'
import { GetHistoryUseCase } from '../GetHistoryUseCase'
import { ClearHistoryUseCase } from '../ClearHistoryUseCase'
import { InMemoryCalculationHistoryRepository } from '../../../infrastructure/repositories/InMemoryCalculationHistoryRepository'

describe('History Use Cases', () => {
  let historyRepository: InMemoryCalculationHistoryRepository
  let saveHistoryUseCase: SaveHistoryUseCase
  let getHistoryUseCase: GetHistoryUseCase
  let clearHistoryUseCase: ClearHistoryUseCase

  beforeEach(() => {
    historyRepository = new InMemoryCalculationHistoryRepository()
    saveHistoryUseCase = new SaveHistoryUseCase(historyRepository)
    getHistoryUseCase = new GetHistoryUseCase(historyRepository)
    clearHistoryUseCase = new ClearHistoryUseCase(historyRepository)
  })

  describe('SaveHistoryUseCase', () => {
    it('計算履歴を保存できる', () => {
      saveHistoryUseCase.execute('2+3', '5')
      const histories = getHistoryUseCase.execute()
      expect(histories.length).toBe(1)
      expect(histories[0].getExpression()).toBe('2+3')
      expect(histories[0].getResult()).toBe('5')
    })

    it('複数の履歴を保存できる', () => {
      saveHistoryUseCase.execute('2+3', '5')
      saveHistoryUseCase.execute('4*5', '20')
      const histories = getHistoryUseCase.execute()
      expect(histories.length).toBe(2)
      expect(histories[0].getExpression()).toBe('4*5') // 新しいものが先頭
      expect(histories[1].getExpression()).toBe('2+3')
    })

    it('20件を超える場合は古いものを削除', () => {
      for (let i = 1; i <= 25; i++) {
        saveHistoryUseCase.execute(`${i}+1`, `${i + 1}`)
      }
      const histories = getHistoryUseCase.execute()
      expect(histories.length).toBe(20)
      expect(histories[0].getExpression()).toBe('25+1')
    })
  })

  describe('GetHistoryUseCase', () => {
    it('空の履歴を取得できる', () => {
      const histories = getHistoryUseCase.execute()
      expect(histories.length).toBe(0)
    })

    it('時系列順（新しいものが先頭）で取得できる', () => {
      saveHistoryUseCase.execute('1+1', '2')
      saveHistoryUseCase.execute('2+2', '4')
      saveHistoryUseCase.execute('3+3', '6')
      const histories = getHistoryUseCase.execute()
      expect(histories[0].getExpression()).toBe('3+3')
      expect(histories[1].getExpression()).toBe('2+2')
      expect(histories[2].getExpression()).toBe('1+1')
    })
  })

  describe('ClearHistoryUseCase', () => {
    it('履歴をクリアできる', () => {
      saveHistoryUseCase.execute('2+3', '5')
      saveHistoryUseCase.execute('4*5', '20')
      clearHistoryUseCase.execute()
      const histories = getHistoryUseCase.execute()
      expect(histories.length).toBe(0)
    })
  })
})
