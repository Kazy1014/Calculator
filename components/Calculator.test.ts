import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import CalculatorComponent from './Calculator.vue'
import { resetCalculatorRepository } from '~/src/presentation/composables/useCalculator'

describe('Calculator Component', () => {
  let wrapper: VueWrapper<any> | null = null

  beforeEach(() => {
    resetCalculatorRepository()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('初期表示は0', () => {
    wrapper = mount(CalculatorComponent)
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('0')
  })

  it('数字ボタンをクリックすると表示に反映される', async () => {
    wrapper = mount(CalculatorComponent)
    await wrapper.find('[data-testid="btn-1"]').trigger('click')
    await wrapper.find('[data-testid="btn-2"]').trigger('click')
    await wrapper.find('[data-testid="btn-3"]').trigger('click')
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('123')
  })

  it('足し算の計算ができる', async () => {
    wrapper = mount(CalculatorComponent)
    await wrapper.find('[data-testid="btn-5"]').trigger('click')
    await wrapper.find('[data-testid="btn-add"]').trigger('click')
    await wrapper.find('[data-testid="btn-3"]').trigger('click')
    await wrapper.find('[data-testid="btn-equals"]').trigger('click')
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('8')
  })

  it('クリアボタンで初期状態に戻る', async () => {
    wrapper = mount(CalculatorComponent)
    await wrapper.find('[data-testid="btn-5"]').trigger('click')
    await wrapper.find('[data-testid="btn-add"]').trigger('click')
    await wrapper.find('[data-testid="btn-3"]').trigger('click')
    await wrapper.find('[data-testid="btn-clear"]').trigger('click')
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('0')
  })

  it('小数点ボタンが正しく動作する', async () => {
    wrapper = mount(CalculatorComponent)
    await wrapper.find('[data-testid="btn-1"]').trigger('click')
    await wrapper.find('[data-testid="btn-decimal"]').trigger('click')
    await wrapper.find('[data-testid="btn-5"]').trigger('click')
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('1.5')
  })

  it('すべての演算子ボタンが存在する', () => {
    wrapper = mount(CalculatorComponent)
    expect(wrapper.find('[data-testid="btn-add"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-subtract"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-multiply"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="btn-divide"]').exists()).toBe(true)
  })

  it('すべての数字ボタン（0-9）が存在する', () => {
    wrapper = mount(CalculatorComponent)
    for (let i = 0; i <= 9; i++) {
      expect(wrapper.find(`[data-testid="btn-${i}"]`).exists()).toBe(true)
    }
  })
})

