import { describe, it, expect, beforeEach } from 'vitest'
import { BackspaceUseCase } from '../BackspaceUseCase'
import { InputNumberUseCase } from '../InputNumberUseCase'
import { CalculationRepositoryFactory } from '../../../infrastructure/repositories/CalculationRepositoryFactory'
import type { ICalculationRepository } from '../../../domain/repositories/ICalculationRepository'

describe('BackspaceUseCase', () => {
  let repository: ICalculationRepository
  let inputNumberUseCase: InputNumberUseCase
  let backspaceUseCase: BackspaceUseCase

  beforeEach(() => {
    CalculationRepositoryFactory.reset()
    repository = CalculationRepositoryFactory.getInstance()
    inputNumberUseCase = new InputNumberUseCase(repository)
    backspaceUseCase = new BackspaceUseCase(repository)
  })

  it('最後の1文字を削除できる', () => {
    inputNumberUseCase.execute('1')
    inputNumberUseCase.execute('2')
    inputNumberUseCase.execute('3')
    const result = backspaceUseCase.execute()
    expect(result.displayValue).toBe('12')
  })

  it('1文字のみの場合は0に戻る', () => {
    inputNumberUseCase.execute('5')
    const result = backspaceUseCase.execute()
    expect(result.displayValue).toBe('0')
  })

  it('複数回バックスペースできる', () => {
    inputNumberUseCase.execute('1')
    inputNumberUseCase.execute('2')
    inputNumberUseCase.execute('3')
    backspaceUseCase.execute()
    backspaceUseCase.execute()
    const result = backspaceUseCase.execute()
    expect(result.displayValue).toBe('0')
  })
})
