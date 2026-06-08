// Device-capability detection for adaptive performance defaults.
//
// All reads are wrapped defensively because these APIs are not universally
// available. The function only returns 'high' when we are reasonably confident
// the device is capable; when signals are missing/ambiguous it defaults to 'mid'.

export type DeviceTier = 'low' | 'mid' | 'high';

interface NavigatorConnection {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Detects an approximate device capability tier using a small scoring model
 * over CPU cores, RAM, network conditions, and input/screen characteristics.
 */
export function detectDeviceTier(): DeviceTier {
  // Score starts neutral. Positive => stronger device, negative => weaker.
  let score = 0;
  let hadStrongSignal = false;

  // 1. CPU cores
  try {
    const cores = navigator.hardwareConcurrency;
    if (typeof cores === 'number' && cores > 0) {
      hadStrongSignal = true;
      if (cores <= 4) score -= 2;
      else if (cores >= 8) score += 2;
      else score += 0; // 5-7 cores: neutral / mid
    }
  } catch {
    // hardwareConcurrency unavailable
  }

  // 2. Device memory (RAM in GB)
  try {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof memory === 'number' && memory > 0) {
      hadStrongSignal = true;
      if (memory <= 2) score -= 2;
      else if (memory <= 4) score -= 1;
      else score += 2;
    }
  } catch {
    // deviceMemory unavailable
  }

  // 3. Network conditions
  try {
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (connection) {
      if (connection.saveData === true) {
        // Explicit user request to conserve data => treat as low.
        return 'low';
      }
      const et = connection.effectiveType;
      if (et === '2g' || et === 'slow-2g') score -= 2;
      else if (et === '3g') score -= 1;
    }
  } catch {
    // connection unavailable
  }

  // 4. Input capability + screen size (touch / small screens lean lower)
  try {
    if (window.matchMedia('(hover: none)').matches) score -= 1;
  } catch {
    // matchMedia unavailable
  }

  try {
    if (typeof window.innerWidth === 'number' && window.innerWidth > 0 && window.innerWidth < 768) {
      score -= 1;
    }
  } catch {
    // window metrics unavailable
  }

  // Classify. Only commit to 'high' when we had at least one strong hardware
  // signal AND the score is clearly positive; otherwise prefer 'mid'.
  if (score <= -2) return 'low';
  if (hadStrongSignal && score >= 2) return 'high';
  return 'mid';
}
