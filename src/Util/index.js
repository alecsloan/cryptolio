export function getCurrencySymbol(currency) {
  return (0).toLocaleString(
    window.navigator.language,
    {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }
  ).replace(/\d/g, '').trim()
}

export function getLocalizedNumber(number, settings) {
  return getLocalizedPrice(number, settings, 'decimal')
}

export function getLocalizedPrice(price, settings, style = 'currency') {
  if (!price || !settings) {
    return "";
  }

  var maxDigits = 0;

  if (settings.decimals4 && price < settings.decimals4) {
    maxDigits = 4;
  }
  else if (settings.decimals3 && price < settings.decimals3) {
    maxDigits = 3;
  }
  else if (settings.decimals2 && price < settings.decimals2) {
    maxDigits = 2;
  }

  return price.toLocaleString(
    window.navigator.language,
    {
      currency: settings.currency,
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: maxDigits,
      style: style
    }
  );
}

export function getLocalizedPercent(number) {
  return number.toLocaleString(window.navigator.language, {style: 'percent', minimumFractionDigits: 2});
}