import * as Util from '../Util/index'
import ReactDOM from 'react-dom'
import React from 'react'
import { MyBalance } from '../Util/index'

window.it('get currency symbol', () => {
  expect(Util.getCurrencySymbol('USD')).toBe('$')
  expect(Util.getCurrencySymbol('EUR')).toBe('€')
  expect(Util.getCurrencySymbol('GBP')).toBe('£')
})

window.it('get localized prices', () => {
  expect(Util.getLocalizedPrice(123456789.99, null)).toBe('')
  expect(Util.getLocalizedPrice(.12345, { currency: 'USD', decimals2: 1 })).toBe(`$0.12`)
  expect(Util.getLocalizedPrice(.12345, { currency: 'USD', decimals3: 1 })).toBe(`$0.123`)
  expect(Util.getLocalizedPrice(.12344, { currency: 'USD', decimals4: 1 })).toBe(`$0.1234`)
  expect(Util.getLocalizedPrice(.12345, { currency: 'USD', decimals4: 1 })).toBe(`$0.1235`)
  expect(Util.getLocalizedPrice(123456789.99, { currency: 'USD' })).toBe(`$123,456,790`)
  expect(Util.getLocalizedPrice(123456789.49, { currency: 'USD' })).toBe(`$123,456,789`)
})

window.it('get localized numbers', () => {
  expect(Util.getLocalizedNumber(123456789.99, null)).toBe('')
  expect(Util.getLocalizedNumber(.12345, { currency: 'USD', decimals2: 1 })).toBe(`0.12`)
  expect(Util.getLocalizedNumber(.12345, { currency: 'USD', decimals3: 1 })).toBe(`0.123`)
  expect(Util.getLocalizedNumber(.12344, { currency: 'USD', decimals4: 1 })).toBe(`0.1234`)
  expect(Util.getLocalizedNumber(.12345, { currency: 'USD', decimals4: 1 })).toBe(`0.1235`)
  expect(Util.getLocalizedNumber(123456789.99, { currency: 'USD' })).toBe(`123,456,790`)
  expect(Util.getLocalizedNumber(123456789.49, { currency: 'USD' })).toBe(`123,456,789`)
})

window.it('get localized percent', () => {
  expect(Util.getLocalizedPercent(.1234)).toBe('12.34%')
  expect(Util.getLocalizedPercent(.12345)).toBe('12.35%')
  expect(Util.getLocalizedPercent(.12345, 3)).toBe('12.345%')
  expect(Util.getLocalizedPercent(.12345, 1)).toBe('12.3%')
  expect(Util.getLocalizedPercent(.12345, 0)).toBe('12%')
  expect(Util.getLocalizedPercent(.125, 0)).toBe('13%')
})

window.it('MyBalance renders', () => {
  const holdings = 1
  const price = 123.50
  const settings = {
    currency: 'USD',
    showAssetBalances: true
  }
  
  const div = document.createElement('div')
  ReactDOM.render(<MyBalance holdings={holdings} price={price} settings={settings} />, div)

  expect(div).toMatchSnapshot()
  expect(div.textContent).toBe('Balance:$124')

  ReactDOM.unmountComponentAtNode(div)
})