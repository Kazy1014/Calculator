import { describe, it, expect } from 'vitest'
import { Memory } from '../Memory'

describe('Memory', () => {
  describe('create', () => {
    it('空のメモリを作成できる', () => {
      const memory = Memory.empty()
      expect(memory.isEmpty()).toBe(true)
      expect(memory.getValue()).toBeNull()
    })

    it('値からメモリを作成できる', () => {
      const memory = Memory.fromValue(100)
      expect(memory.isEmpty()).toBe(false)
      expect(memory.getValue()).toBe(100)
    })
  })

  describe('add', () => {
    it('空のメモリに値を加算できる', () => {
      const memory = Memory.empty()
      const newMemory = memory.add(50)
      expect(newMemory.getValue()).toBe(50)
    })

    it('既存の値に加算できる', () => {
      const memory = Memory.fromValue(100)
      const newMemory = memory.add(50)
      expect(newMemory.getValue()).toBe(150)
    })
  })

  describe('subtract', () => {
    it('空のメモリから減算できる（負の値になる）', () => {
      const memory = Memory.empty()
      const newMemory = memory.subtract(50)
      expect(newMemory.getValue()).toBe(-50)
    })

    it('既存の値から減算できる', () => {
      const memory = Memory.fromValue(100)
      const newMemory = memory.subtract(50)
      expect(newMemory.getValue()).toBe(50)
    })
  })

  describe('clear', () => {
    it('メモリをクリアできる', () => {
      const memory = Memory.fromValue(100)
      const clearedMemory = memory.clear()
      expect(clearedMemory.isEmpty()).toBe(true)
      expect(clearedMemory.getValue()).toBeNull()
    })
  })
})
