export type ValidationResult = { ok: true } | { ok: false; message: string };

export function validateRequiredText(
  value: string,
  label: string,
  minLen = 1,
): ValidationResult {
  const trimmed = value.trim();
  if (trimmed.length < minLen) {
    return { ok: false, message: `${label} is required` };
  }
  return { ok: true };
}

export function validatePositiveNumber(
  raw: string,
  label: string,
  opts: { min?: number; max?: number; allowZero?: boolean } = {},
): ValidationResult & { value?: number } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, message: `Enter a valid ${label.toLowerCase()}` };
  }

  const value = parseFloat(trimmed);
  if (Number.isNaN(value)) {
    return { ok: false, message: `${label} must be a number` };
  }

  const min = opts.min ?? (opts.allowZero ? 0 : 0.0001);
  if (value < min) {
    return {
      ok: false,
      message: opts.allowZero
        ? `${label} cannot be negative`
        : `${label} must be greater than 0`,
    };
  }

  if (opts.max != null && value > opts.max) {
    return { ok: false, message: `${label} seems too high (max ${opts.max.toLocaleString("en-IN")})` };
  }

  return { ok: true, value };
}

export function validateBillAmount(raw: string): ValidationResult & { value?: number } {
  return validatePositiveNumber(raw, "Bill amount", { min: 1, max: 5_000_000 });
}

export function validateUnits(raw: string): ValidationResult & { value?: number } {
  return validatePositiveNumber(raw, "Units", { min: 1, max: 50_000 });
}

export function validatePanelWatts(raw: string): ValidationResult & { value?: number } {
  return validatePositiveNumber(raw, "Panel wattage", { min: 100, max: 800 });
}

export function validateKw(raw: string): ValidationResult & { value?: number } {
  return validatePositiveNumber(raw, "kW size", { min: 0.1, max: 100 });
}

export function validatePhone(raw: string): ValidationResult {
  const trimmed = raw.trim();
  if (!/^[6-9]\d{9}$/.test(trimmed)) {
    return { ok: false, message: "Enter a valid 10-digit Indian mobile number" };
  }
  return { ok: true };
}

export function validateInterestRate(value: number): ValidationResult {
  if (value < 0 || value > 30) {
    return { ok: false, message: "Interest rate must be between 0 and 30%" };
  }
  return { ok: true };
}

export function validateTenureYears(value: number): ValidationResult {
  if (value < 1 || value > 30) {
    return { ok: false, message: "Tenure must be between 1 and 30 years" };
  }
  return { ok: true };
}

export function validateRoofArea(raw: string): ValidationResult & { value?: number } {
  return validatePositiveNumber(raw, "Roof area", { allowZero: true, min: 0, max: 100_000 });
}
