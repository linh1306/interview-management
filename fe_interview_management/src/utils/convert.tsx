export function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "VND" });
}

export function roundDownToNearestThousand(number: number) {
  return Math.floor(number / 1000) * 1000;
}
