/**
 * Algoritmo Fisher-Yates Shuffle Mejorado
 * 
 * Mezcla un array de forma completamente aleatoria.
 * Usa crypto.getRandomValues() para mejor aleatoriedad que Math.random()
 * 
 * ¿Por qué es mejor que Math.random()?
 * - Math.random() puede tener patrones predecibles
 * - crypto.getRandomValues() usa el generador criptográfico del sistema
 * - Más difícil que se repitan secuencias
 */

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]; // Crea copia para no modificar el original
  
  for (let i = newArray.length - 1; i > 0; i--) {
    // Generar índice aleatorio usando crypto
    const j = getSecureRandomIndex(i + 1);
    
    // Intercambiar elementos
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
}

/**
 * Genera un número aleatorio seguro entre 0 y max (exclusivo)
 */
function getSecureRandomIndex(max: number): number {
  // Intentar usar crypto si está disponible (mejor aleatoriedad)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] % max;
  }
  
  // Fallback a Math.random() si crypto no está disponible
  return Math.floor(Math.random() * max);
}

/**
 * Mezcla números con historial
 * 
 * Evita que las primeras N fichas sean iguales a las últimas N del juego anterior
 * 
 * @param numeros - Array de números a mezclar
 * @param ultimasFichas - Últimas fichas del juego anterior (opcional)
 * @param evitarPrimeras - Cuántas posiciones evitar al inicio (default: 5)
 */
export function shuffleConHistorial(
  numeros: number[],
  ultimasFichas: number[] = [],
  evitarPrimeras: number = 5
): number[] {
  let mezcla = shuffleArray(numeros);
  
  // Si hay historial y las primeras fichas coinciden con las últimas del juego anterior
  if (ultimasFichas.length > 0) {
    const primerasFichasActuales = mezcla.slice(0, evitarPrimeras);
    const ultimasFichasPrevias = ultimasFichas.slice(-evitarPrimeras);
    
    // Verificar si hay demasiada coincidencia
    const coincidencias = primerasFichasActuales.filter(num => 
      ultimasFichasPrevias.includes(num)
    ).length;
    
    // Si hay más de 2 coincidencias, volver a mezclar
    if (coincidencias > 2) {
      console.log('⚠️ Patrón detectado, remezclando...');
      return shuffleConHistorial(numeros, ultimasFichas, evitarPrimeras);
    }
  }
  
  return mezcla;
}