import { describe, it, expect, beforeEach } from 'vitest'
import { InputNumberUseCase } from '../InputNumberUseCase'
import { ClearCalculationUseCase } from '../ClearCalculationUseCase'
import { CalculationRepositoryFactory } from '../../../infrastructure/repositories/CalculationRepositoryFactory'
import { ICalculationRepository } from '../../../domain/repositories/ICalculationRepository'

describe('ClearCalculationUseCase', () => {
  let repository: ICalculationRepository
  let inputNumberUseCase: InputNumberUseCase
  let clearUseCase: ClearCalculationUseCase

  beforeEach(() => {
    CalculationRepositoryFactory.reset()
    repository = CalculationRepositoryFactory.getInstance()
    inputNumberUseCase = new InputNumberUseCase(repository)
    clearUseCase = new ClearCalculationUseCase(repository)
  })

  it('計算をクリアすると0に戻る', () => {
    inputNumberUseCase.execute('5')
    inputNumberUseCase.execute('3')
    const result = clearUseCase.execute()
    expect(result.displayValue).toBe('0')
  })

  it('クリア後に新しい計算ができる', () => {
    inputNumberUseCase.execute('5')
    clearUseCase.execute()
    const result = inputNumberUseCase.execute('3')
    expect(result.displayValue).toBe('3')
  })
})

