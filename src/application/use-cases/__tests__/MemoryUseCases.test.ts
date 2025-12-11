import { describe, it, expect, beforeEach } from 'vitest'
import { SaveToMemoryUseCase } from '../SaveToMemoryUseCase'
import { RecallMemoryUseCase } from '../RecallMemoryUseCase'
import { AddToMemoryUseCase } from '../AddToMemoryUseCase'
import { SubtractFromMemoryUseCase } from '../SubtractFromMemoryUseCase'
import { ClearMemoryUseCase } from '../ClearMemoryUseCase'
import { InMemoryMemoryRepository } from '../../../infrastructure/repositories/InMemoryMemoryRepository'

describe('Memory Use Cases', () => {
  let memoryRepository: InMemoryMemoryRepository
  let saveToMemoryUseCase: SaveToMemoryUseCase
  let recallMemoryUseCase: RecallMemoryUseCase
  let addToMemoryUseCase: AddToMemoryUseCase
  let subtractFromMemoryUseCase: SubtractFromMemoryUseCase
  let clearMemoryUseCase: ClearMemoryUseCase

  beforeEach(() => {
    memoryRepository = new InMemoryMemoryRepository()
    saveToMemoryUseCase = new SaveToMemoryUseCase(memoryRepository)
    recallMemoryUseCase = new RecallMemoryUseCase(memoryRepository)
    addToMemoryUseCase = new AddToMemoryUseCase(memoryRepository)
    subtractFromMemoryUseCase = new SubtractFromMemoryUseCase(memoryRepository)
    clearMemoryUseCase = new ClearMemoryUseCase(memoryRepository)
  })

  describe('SaveToMemoryUseCase', () => {
    it('値をメモリに保存できる', () => {
      saveToMemoryUseCase.execute(100)
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('100')
    })
  })

  describe('RecallMemoryUseCase', () => {
    it('空のメモリから呼び出すと0を返す', () => {
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('0')
    })

    it('保存された値を呼び出せる', () => {
      saveToMemoryUseCase.execute(50)
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('50')
    })
  })

  describe('AddToMemoryUseCase', () => {
    it('空のメモリに値を加算できる', () => {
      addToMemoryUseCase.execute(30)
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('30')
    })

    it('既存の値に加算できる', () => {
      saveToMemoryUseCase.execute(20)
      addToMemoryUseCase.execute(30)
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('50')
    })
  })

  describe('SubtractFromMemoryUseCase', () => {
    it('空のメモリから減算できる', () => {
      subtractFromMemoryUseCase.execute(10)
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('-10')
    })

    it('既存の値から減算できる', () => {
      saveToMemoryUseCase.execute(50)
      subtractFromMemoryUseCase.execute(20)
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('30')
    })
  })

  describe('ClearMemoryUseCase', () => {
    it('メモリをクリアできる', () => {
      saveToMemoryUseCase.execute(100)
      clearMemoryUseCase.execute()
      const result = recallMemoryUseCase.execute()
      expect(result.displayValue).toBe('0')
    })
  })
})
