export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  // Format the number with Indonesian locale for proper thousand separators
  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedAmount = formatter.format(amount);
  
  // Return with IDR prefix for Xendit compatibility
  return `IDR ${formattedAmount}`;
} 