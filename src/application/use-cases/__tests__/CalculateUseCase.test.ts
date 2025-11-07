import { describe, it, expect, beforeEach } from 'vitest'
import { InputNumberUseCase } from '../InputNumberUseCase'
import { InputOperatorUseCase } from '../InputOperatorUseCase'
import { CalculateUseCase } from '../CalculateUseCase'
import { CalculationRepositoryFactory } from '../../../infrastructure/repositories/CalculationRepositoryFactory'
import { ICalculationRepository } from '../../../domain/repositories/ICalculationRepository'

describe('CalculateUseCase', () => {
  let repository: ICalculationRepository
  let inputNumberUseCase: InputNumberUseCase
  let inputOperatorUseCase: InputOperatorUseCase
  let calculateUseCase: CalculateUseCase

  beforeEach(() => {
    CalculationRepositoryFactory.reset()
    repository = CalculationRepositoryFactory.getInstance()
    inputNumberUseCase = new InputNumberUseCase(repository)
    inputOperatorUseCase = new InputOperatorUseCase(repository)
    calculateUseCase = new CalculateUseCase(repository)
  })

  it('足し算の計算ができる', () => {
    inputNumberUseCase.execute('5')
    inputOperatorUseCase.execute('+')
    inputNumberUseCase.execute('3')
    const result = calculateUseCase.execute()
    expect(result.displayValue).toBe('8')
  })

  it('引き算の計算ができる', () => {
    inputNumberUseCase.execute('9')
    inputOperatorUseCase.execute('-')
    inputNumberUseCase.execute('4')
    const result = calculateUseCase.execute()
    expect(result.displayValue).toBe('5')
  })

  it('掛け算の計算ができる', () => {
    inputNumberUseCase.execute('6')
    inputOperatorUseCase.execute('*')
    inputNumberUseCase.execute('7')
    const result = calculateUseCase.execute()
    expect(result.displayValue).toBe('42')
  })

  it('割り算の計算ができる', () => {
    inputNumberUseCase.execute('8')
    inputOperatorUseCase.execute('/')
    inputNumberUseCase.execute('4')
    const result = calculateUseCase.execute()
    expect(result.displayValue).toBe('2')
  })

  it('ゼロ除算はエラーを表示', () => {
    inputNumberUseCase.execute('5')
    inputOperatorUseCase.execute('/')
    inputNumberUseCase.execute('0')
    const result = calculateUseCase.execute()
    expect(result.displayValue).toBe('Error')
  })
})

