/**
 * Redondea y acota un porcentaje a la escala 0-100.
 *
 * El contrato del backend expresa `matchRate`, `gapPorcentual` y `confianza` en
 * escala 0-100 (p. ej. `78.5`, `35.5`, `92.0`); acá solo se redondea y se acota
 * al rango válido. No se aplica heurística de fracción (`value <= 1 ? ×100`):
 * inflaría un porcentaje legítimo ≤1 (un match de 1% se volvería 100%).
 */
export function normalizePercentage(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}
