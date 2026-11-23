import { test, expect } from '@playwright/test'

// Smoke test of the demo page: every grid feature the AIDD app relies on, against the built components.
test.beforeEach(async ({ page }) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  test.info().errors_ = errors
  await page.goto('/')
})
test.afterEach(async () => {
  expect(test.info().errors_).toEqual([])
})

const grid = (page) => page.getByRole('table').first()

test('renders rows, sorts and filters', async ({ page }) => {
  const rows = grid(page).getByRole('row')
  await expect(rows.nth(1)).toBeVisible()
  const before = await rows.count()
  expect(before).toBeGreaterThan(5)

  await grid(page).getByRole('button', { name: 'Column options: name', exact: true }).click({ force: true })
  await page.getByRole('menuitem', { name: 'Sort Descending' }).click()
  await expect(grid(page).getByRole('columnheader', { name: /name/ }).first()).toContainText('↓')

  const search = page.getByRole('combobox').first()
  await search.click()
  await page.getByRole('option', { name: 'name varchar' }).click()
  await page.getByRole('option', { name: /contains/i }).first().click()
  await page.getByLabel('Filter value for name').fill('zzzz-no-match')
  await expect(page.getByText('No rows found')).toBeVisible()
})

test('selection toolbar, context menu, delete confirmation', async ({ page }) => {
  const firstRow = grid(page).getByRole('row').nth(1)
  await firstRow.getByRole('checkbox', { name: 'Select row' }).check()
  await expect(page.getByText('1 row selected')).toBeVisible()
  await page.getByRole('button', { name: 'Clear selection' }).click()
  await expect(page.getByText('1 row selected')).toBeHidden()

  await firstRow.getByRole('cell').nth(3).click({ button: 'right' })
  await expect(page.getByRole('menuitem', { name: 'Log row' })).toBeVisible()
  await page.getByRole('menuitem', { name: 'Delete row' }).click()
  await expect(page.getByRole('alertdialog')).toContainText('delete 1 row')
  const count = await grid(page).getByRole('row').count()
  await page.getByRole('button', { name: 'Delete 1 row' }).click()
  await expect(grid(page).getByRole('row')).toHaveCount(count - 1)
})

test('expands a sub-table', async ({ page }) => {
  await page.getByRole('button', { name: 'Toggle sub-table' }).first().click()
  await expect(page.getByRole('table').nth(1)).toBeVisible()
})

test('inline cell edit commits on Enter', async ({ page }) => {
  const cell = grid(page).getByRole('row').nth(1).getByRole('cell').nth(3)
  await cell.dblclick()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.type('Edited name')
  await page.keyboard.press('Enter')
  await expect(cell).toContainText('Edited name')
})

test('mini table loads more on scroll and selects', async ({ page }) => {
  const mini = page.getByRole('table', { name: 'stores' }).last()
  await expect(page.getByText(/\d+ stores/)).toBeVisible()
  const rows = mini.getByRole('row')
  const n = await rows.count()
  await rows.last().scrollIntoViewIfNeeded()
  await mini.evaluate((el) => (el.scrollTop = el.scrollHeight))
  await expect.poll(() => rows.count()).toBeGreaterThanOrEqual(n)
  await rows.nth(1).getByRole('checkbox').check()
  await expect(page.getByText('Mini selected: 1')).toBeVisible()
})

test('meta.render puts a custom node in the cell', async ({ page }) => {
  const row = grid(page).getByRole('row').nth(1)
  const custom = row.getByTestId('custom-cell')
  await expect(custom).toHaveText(/.+!$/)

  // Never an inline editor, even though the demo table is editable...
  await custom.dblclick()
  await expect(grid(page).getByRole('textbox')).toHaveCount(0)

  // ...and cellButtons still work beside it.
  const button = row.getByRole('button', { name: 'Greet', exact: true })
  await row.hover()
  const logged = page.waitForEvent('console', (m) => m.text().startsWith('greet'))
  await button.click()
  await logged
})

test('a meta.render column keeps its own width: its content cannot be measured', async ({ page }) => {
  const box = await grid(page).getByRole('columnheader', { name: /name \(render\)/ }).first().boundingBox()
  expect(box.width).toBeGreaterThanOrEqual(240) // the demo column's size
})

const expandStore = (page, name) => grid(page).getByRole('row').filter({ hasText: name }).first().getByRole('button', { name: 'Toggle sub-table' }).click()

test('a nested table paged by a server stays on a short last page', async ({ page }) => {
  const events = []
  page.on('console', (m) => /^sub /.test(m.text()) && events.push(m.text()))
  await expandStore(page, 'Whole Foods - SOMA')
  const sub = page.getByRole('table').nth(1)
  await expect(sub.getByText('Crew 100', { exact: true })).toBeVisible()
  await page.waitForTimeout(300)
  expect(events).toEqual([]) // showing it asks for nothing: its first page is already there

  await page.getByRole('button', { name: 'Next page' }).first().click()
  await expect(sub.getByText('Crew 120', { exact: true })).toBeVisible()
  await expect(sub.getByText('Crew 1', { exact: true })).toHaveCount(0)
  await page.waitForTimeout(500)
  await expect(sub.getByText('Crew 120', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Page number').first()).toHaveValue('2')
  expect(events).toEqual(['sub page 1 100'])
})

test('a nested table draws only the rows in view', async ({ page }) => {
  await expandStore(page, 'Whole Foods - Noe Valley')
  await page.getByLabel('Rows per page:').first().selectOption('1000')
  const sub = page.getByRole('table').nth(1)
  await expect(sub.getByText('Crew 1', { exact: true })).toBeVisible()
  expect(await sub.getByRole('row').count()).toBeLessThan(120)
  // It scrolls inside itself, to the very end, under its header.
  const shell = sub.locator('..')
  expect((await shell.boundingBox()).height).toBeLessThan(700)
  await shell.evaluate((el) => (el.scrollTop = el.scrollHeight))
  await expect(sub.getByText('Crew 700', { exact: true })).toBeVisible()
  const header = await sub.getByRole('columnheader', { name: /role/ }).first().boundingBox()
  expect(Math.abs(header.y - (await shell.boundingBox()).y)).toBeLessThan(3)
  expect(await sub.getByRole('row').count()).toBeLessThan(120)
})
