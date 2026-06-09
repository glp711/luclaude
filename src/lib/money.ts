/**
 * Dinheiro sempre em centavos (int) no banco e na rede.
 * Formatação (R$ 176,90) é responsabilidade de UI.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(cents: number): string {
  return BRL.format(cents / 100);
}

export function parseBRLToCents(text: string): number {
  const cleaned = text
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const reais = Number.parseFloat(cleaned);
  if (Number.isNaN(reais)) {
    throw new Error(`Valor monetário inválido: "${text}"`);
  }
  return Math.round(reais * 100);
}

export function centsToReais(cents: number): number {
  return cents / 100;
}
