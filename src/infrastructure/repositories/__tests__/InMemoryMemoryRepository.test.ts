import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryMemoryRepository } from '../InMemoryMemoryRepository'
import { Memory } from '../../../domain/value-objects/Memory'

describe('InMemoryMemoryRepository', () => {
  let repository: InMemoryMemoryRepository

  beforeEach(() => {
    repository = new InMemoryMemoryRepository()
  })

  describe('get', () => {
    it('初期状態は空のメモリを返す', () => {
      const memory = repository.get()
      expect(memory.isEmpty()).toBe(true)
    })
  })

  describe('save', () => {
    it('メモリを保存できる', () => {
      const memory = Memory.fromValue(100)
      repository.save(memory)
      const retrieved = repository.get()
      expect(retrieved.getValue()).toBe(100)
    })

    it('メモリを上書きできる', () => {
      repository.save(Memory.fromValue(50))
      repository.save(Memory.fromValue(100))
      const retrieved = repository.get()
      expect(retrieved.getValue()).toBe(100)
    })
  })

  describe('clear', () => {
    it('メモリをクリアできる', () => {
      repository.save(Memory.fromValue(100))
      repository.clear()
      const memory = repository.get()
      expect(memory.isEmpty()).toBe(true)
    })
  })
})
