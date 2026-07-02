const EMBEDDABLE_HOSTS = ["youtube.com", "www.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com"];

/**
 * Determina si la `url` de un curso corresponde a un proveedor de video
 * embebible (YouTube/Vimeo, los que soporta `react-player`).
 *
 * `Course.url` es un campo genérico del contrato real (puede apuntar a un
 * video o a un sitio externo del proveedor); esta heurística decide si vale
 * la pena abrir el dialog de reproducción o simplemente linkear afuera.
 */
export function isEmbeddableVideoUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return EMBEDDABLE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
