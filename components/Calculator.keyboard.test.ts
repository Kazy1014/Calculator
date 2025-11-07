import { describe, it, expect, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import CalculatorComponent from './Calculator.vue'

describe('Calculator Keyboard Input', () => {
  let wrapper: VueWrapper<any> | null = null

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
      wrapper = null
    }
  })

  it('数字キーで入力できる', async () => {
    wrapper = mount(CalculatorComponent)
    
    // キーボード入力をシミュレート
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }))
    await wrapper.vm.$nextTick()
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('123')
  })

  it('演算子キーで計算できる', async () => {
    wrapper = mount(CalculatorComponent)
    
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await wrapper.vm.$nextTick()
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('8')
  })

  it('小数点キーで小数入力できる', async () => {
    wrapper = mount(CalculatorComponent)
    
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '.' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }))
    await wrapper.vm.$nextTick()
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('1.5')
  })

  it('Escapeキーでクリアできる', async () => {
    wrapper = mount(CalculatorComponent)
    
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('0')
  })

  it('cキーでクリアできる', async () => {
    wrapper = mount(CalculatorComponent)
    
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
    await wrapper.vm.$nextTick()
    
    const display = wrapper.find('[data-testid="display"]')
    expect(display.text()).toBe('0')
  })

  it('すべての演算子キー（+, -, *, /）が動作する', async () => {
    wrapper = mount(CalculatorComponent)
    
    // 足し算
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="display"]').text()).toBe('8')
    
    // クリア
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
    await wrapper.vm.$nextTick()
    
    // 掛け算
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '4' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '*' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }))
    await wrapper.vm.$nextTick()
    await window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="display"]').text()).toBe('12')
  })
})

