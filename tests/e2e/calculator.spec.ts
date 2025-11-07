import { test, expect } from '@playwright/test'

test.describe('電卓アプリ E2E テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('ページが正しく表示される', async ({ page }) => {
    await expect(page).toHaveTitle(/電卓アプリ/)
    await expect(page.locator('h1')).toHaveText('電卓アプリ')
    await expect(page.locator('[data-testid="display"]')).toBeVisible()
  })

  test('初期表示は0である', async ({ page }) => {
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('0')
  })

  test('数字ボタンをクリックして入力できる', async ({ page }) => {
    await page.locator('[data-testid="btn-1"]').click()
    await page.locator('[data-testid="btn-2"]').click()
    await page.locator('[data-testid="btn-3"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('123')
  })

  test('足し算の計算ができる', async ({ page }) => {
    await page.locator('[data-testid="btn-5"]').click()
    await page.locator('[data-testid="btn-add"]').click()
    await page.locator('[data-testid="btn-3"]').click()
    await page.locator('[data-testid="btn-equals"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('8')
  })

  test('引き算の計算ができる', async ({ page }) => {
    await page.locator('[data-testid="btn-9"]').click()
    await page.locator('[data-testid="btn-subtract"]').click()
    await page.locator('[data-testid="btn-4"]').click()
    await page.locator('[data-testid="btn-equals"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('5')
  })

  test('掛け算の計算ができる', async ({ page }) => {
    await page.locator('[data-testid="btn-6"]').click()
    await page.locator('[data-testid="btn-multiply"]').click()
    await page.locator('[data-testid="btn-7"]').click()
    await page.locator('[data-testid="btn-equals"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('42')
  })

  test('割り算の計算ができる', async ({ page }) => {
    await page.locator('[data-testid="btn-8"]').click()
    await page.locator('[data-testid="btn-divide"]').click()
    await page.locator('[data-testid="btn-4"]').click()
    await page.locator('[data-testid="btn-equals"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('2')
  })

  test('小数点の計算ができる', async ({ page }) => {
    await page.locator('[data-testid="btn-1"]').click()
    await page.locator('[data-testid="btn-decimal"]').click()
    await page.locator('[data-testid="btn-5"]').click()
    await page.locator('[data-testid="btn-add"]').click()
    await page.locator('[data-testid="btn-2"]').click()
    await page.locator('[data-testid="btn-decimal"]').click()
    await page.locator('[data-testid="btn-5"]').click()
    await page.locator('[data-testid="btn-equals"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('4')
  })

  test('クリアボタンで初期状態に戻る', async ({ page }) => {
    await page.locator('[data-testid="btn-5"]').click()
    await page.locator('[data-testid="btn-add"]').click()
    await page.locator('[data-testid="btn-3"]').click()
    await page.locator('[data-testid="btn-clear"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('0')
  })

  test('連続計算ができる', async ({ page }) => {
    await page.locator('[data-testid="btn-5"]').click()
    await page.locator('[data-testid="btn-add"]').click()
    await page.locator('[data-testid="btn-3"]').click()
    await page.locator('[data-testid="btn-add"]').click()
    
    let display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('8')
    
    await page.locator('[data-testid="btn-2"]').click()
    await page.locator('[data-testid="btn-equals"]').click()
    
    await expect(display).toHaveText('10')
  })

  test('ゼロ除算でエラー表示', async ({ page }) => {
    await page.locator('[data-testid="btn-5"]').click()
    await page.locator('[data-testid="btn-divide"]').click()
    await page.locator('[data-testid="btn-0"]').click()
    await page.locator('[data-testid="btn-equals"]').click()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('Error')
  })

  test('キーボードで数字入力ができる', async ({ page }) => {
    await page.keyboard.press('1')
    await page.keyboard.press('2')
    await page.keyboard.press('3')
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('123')
  })

  test('キーボードで計算ができる', async ({ page }) => {
    await page.keyboard.press('5')
    await page.keyboard.press('+')
    await page.keyboard.press('3')
    await page.keyboard.press('Enter')
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('8')
  })

  test('キーボードのEscapeでクリアできる', async ({ page }) => {
    await page.keyboard.press('5')
    await page.keyboard.press('+')
    await page.keyboard.press('3')
    await page.keyboard.press('Escape')
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('0')
  })

  test('キーボードでcキーを押してクリアできる', async ({ page }) => {
    await page.keyboard.press('5')
    await page.keyboard.press('+')
    await page.keyboard.press('3')
    await page.keyboard.press('c')
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('0')
  })

  test('キーボードで小数点入力ができる', async ({ page }) => {
    await page.keyboard.press('1')
    await page.keyboard.press('.')
    await page.keyboard.press('5')
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('1.5')
  })

  test('ページをリロードすると状態がリセットされる', async ({ page }) => {
    await page.locator('[data-testid="btn-5"]').click()
    await page.locator('[data-testid="btn-add"]').click()
    await page.locator('[data-testid="btn-3"]').click()
    
    await page.reload()
    
    const display = page.locator('[data-testid="display"]')
    await expect(display).toHaveText('0')
  })

  test('ボタンのホバー効果が機能する', async ({ page }) => {
    const button = page.locator('[data-testid="btn-1"]')
    
    // ボタンにマウスオーバー
    await button.hover()
    
    // ボタンがクリック可能であることを確認
    await expect(button).toBeEnabled()
  })

  test('すべての数字ボタン（0-9）が存在する', async ({ page }) => {
    for (let i = 0; i <= 9; i++) {
      await expect(page.locator(`[data-testid="btn-${i}"]`)).toBeVisible()
    }
  })

  test('すべての演算子ボタンが存在する', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-add"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-subtract"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-multiply"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-divide"]')).toBeVisible()
  })

  test('クリアボタンとイコールボタンが存在する', async ({ page }) => {
    await expect(page.locator('[data-testid="btn-clear"]')).toBeVisible()
    await expect(page.locator('[data-testid="btn-equals"]')).toBeVisible()
  })
})

