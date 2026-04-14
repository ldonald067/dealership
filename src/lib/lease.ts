export interface LeaseInput {
  msrp: number;
  salePrice: number;
  residualPct: number; // e.g. 0.55 = 55%
  moneyFactor: number; // e.g. 0.00125 ≈ 3% APR
  termMonths: number; // 24, 36, 39, 48
  downPayment: number;
  tradeInValue: number;
  taxRate: number; // e.g. 0.08 = 8%
}

export interface LeaseResult {
  monthlyPayment: number;
  totalCost: number;
  depreciation: number;
  financeCharge: number;
  residualValue: number;
  netCapCost: number;
  monthlyPreTax: number;
  effectiveAPR: number;
}

export function calculateLease(input: LeaseInput): LeaseResult {
  const {
    msrp,
    salePrice,
    residualPct,
    moneyFactor,
    termMonths,
    downPayment,
    tradeInValue,
    taxRate,
  } = input;

  const residualValue = msrp * residualPct;
  const netCapCost = salePrice - downPayment - tradeInValue;
  const depreciation = (netCapCost - residualValue) / termMonths;
  const financeCharge = (netCapCost + residualValue) * moneyFactor;
  const monthlyPreTax = depreciation + financeCharge;
  const monthlyPayment = monthlyPreTax * (1 + taxRate);
  const totalCost = monthlyPayment * termMonths + downPayment;
  const effectiveAPR = moneyFactor * 2400;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    depreciation: Math.round(depreciation * 100) / 100,
    financeCharge: Math.round(financeCharge * 100) / 100,
    residualValue: Math.round(residualValue * 100) / 100,
    netCapCost: Math.round(netCapCost * 100) / 100,
    monthlyPreTax: Math.round(monthlyPreTax * 100) / 100,
    effectiveAPR: Math.round(effectiveAPR * 100) / 100,
  };
}
