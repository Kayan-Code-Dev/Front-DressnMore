const EN_US = "en-US";

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(EN_US, options).format(value);
}

export function formatInteger(value: number): string {
  return formatNumber(value, { maximumFractionDigits: 0 });
}

/** Normalize Arabic/Persian digits in user input to Western digits. */
export function toWesternDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}
