export const PAYMENT_CURRENCIES = ["EUR", "USD", "GBP", "SEK", "PKR"] as const;

export const APPOINTMENT_TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
] as const;

export function isPaymentCurrency(currency: string) {
  return PAYMENT_CURRENCIES.includes(
    currency.toUpperCase() as (typeof PAYMENT_CURRENCIES)[number]
  );
}

export function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}
