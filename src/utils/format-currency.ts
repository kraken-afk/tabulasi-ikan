export function formatCurrency(
  amount: number,
  currencyCode = "IDR",
  locale = "id-ID",
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}
