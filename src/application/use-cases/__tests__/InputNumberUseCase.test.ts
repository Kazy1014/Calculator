import { describe, it, expect, beforeEach } from 'vitest'
import { InputNumberUseCase } from '../InputNumberUseCase'
import { CalculationRepositoryFactory } from '../../../infrastructure/repositories/CalculationRepositoryFactory'
import { ICalculationRepository } from '../../../domain/repositories/ICalculationRepository'

describe('InputNumberUseCase', () => {
  let repository: ICalculationRepository
  let useCase: InputNumberUseCase

  beforeEach(() => {
    CalculationRepositoryFactory.reset()
    repository = CalculationRepositoryFactory.getInstance()
    useCase = new InputNumberUseCase(repository)
  })

  it('数字を入力すると表示値が更新される', () => {
    const result = useCase.execute('5')
    expect(result.displayValue).toBe('5')
  })

  it('複数の数字を連続入力できる', () => {
    useCase.execute('1')
    useCase.execute('2')
    const result = useCase.execute('3')
    expect(result.displayValue).toBe('123')
  })
})

