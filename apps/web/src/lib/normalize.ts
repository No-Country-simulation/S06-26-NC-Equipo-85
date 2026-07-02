/**
 * Normaliza un porcentaje potencialmente expresado como fracción (`0-1`) a
 * escala `0-100`, redondeado y acotado al rango válido.
 *
 * El OpenAPI no aclara la escala real de `JobMatch.matchRate` ni de
 * `OrientationResponse.gapPorcentual` (`double`, sin más contexto). Esta
 * heurística defensiva asume que un valor `<= 1` es una fracción y lo escala;
 * valores mayores se asumen ya expresados en `0-100` y solo se acotan.
 *
 * TODO(backend): confirmar la escala real de `matchRate`/`gapPorcentual` con
 * un request contra el backend desplegado y, si hace falta, ajustar o quitar
 * esta heurística.
 */
export function normalizePercentage(value: number): number {
  const normalized = value <= 1 ? value * 100 : value;
  return Math.round(Math.min(100, Math.max(0, normalized)));
}
