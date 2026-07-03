export function displayBillerId(value?: string | null): string {
  return value?.trim() || "—";
}

export function displayBillerName(value?: string | null): string {
  return value?.trim() || "—";
}

export function hasBiller(value?: string | null): boolean {
  return Boolean(value?.trim());
}

