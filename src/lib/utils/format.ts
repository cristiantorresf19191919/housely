export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDateRange(
  start: Date,
  end: Date,
  locale = 'en-US'
) {
  const fmt = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export function nightsBetween(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

const COMMISSION_RATE = Number(process.env.NEXT_PUBLIC_PLATFORM_COMMISSION_RATE ?? 0.1);

export function computePayment({
  pricePerNight,
  nights,
  cleaningFee,
}: {
  pricePerNight: number;
  nights: number;
  cleaningFee: number;
}) {
  const nightlyTotal = pricePerNight * nights;
  const subtotal = nightlyTotal + cleaningFee;
  const commissionAmount = Math.round(subtotal * COMMISSION_RATE);
  const remainingAtProperty = subtotal - commissionAmount;
  return {
    nightlyTotal,
    cleaningFee,
    subtotal,
    commissionRate: COMMISSION_RATE,
    commissionAmount,
    remainingAtProperty,
  };
}
